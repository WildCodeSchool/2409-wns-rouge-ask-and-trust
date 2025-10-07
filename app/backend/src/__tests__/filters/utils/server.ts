import "reflect-metadata"
import path from "path"
import { buildSchema } from "type-graphql"
import { ApolloServer } from "@apollo/server"
import { startStandaloneServer } from "@apollo/server/standalone"
import { DataSource } from "typeorm"
import {
	PostgreSqlContainer,
	StartedPostgreSqlContainer,
} from "@testcontainers/postgresql"
import { SurveysResolver } from "../../../graphql/resolvers/survey/survey-resolver"
import { Survey } from "../../../database/entities/survey/survey"
import { User } from "../../../database/entities/user"
import { createTestClient } from "./createTestClient"
import { Category } from "../../../database/entities/survey/category"

let server: ApolloServer
let httpServer: any
let ds: DataSource
let container: StartedPostgreSqlContainer

export async function startTestServer() {
	container = await new PostgreSqlContainer("postgres:16-alpine").start()

	ds = new DataSource({
		type: "postgres",
		host: container.getHost(),
		port: container.getPort(),
		username: container.getUsername(),
		password: container.getPassword(),
		database: container.getDatabase(),
		synchronize: true, // OK pour tests
		entities: [
			path.resolve(__dirname, "../../../database/entities/**/*.{ts,js}"),
		],
	})
	await ds.initialize()
	;(User as any).useDataSource?.(ds)
	;(Survey as any).useDataSource?.(ds)
	;(Category as any).useDataSource?.(ds)

	const schema = await buildSchema({
		resolvers: [SurveysResolver],
		authChecker: ({ context }, roles) => {
			const user = context.user
			if (!user) return false
			return roles.length === 0 || roles.includes(user.role)
		},
	})

	server = new ApolloServer({ schema })

	httpServer = await startStandaloneServer(server, {
		listen: { port: 0 },
		context: async ({ req }) => {
			const raw = (req.headers as any)["x-test-context"]
			if (!raw) return {}
			try {
				return JSON.parse(Array.isArray(raw) ? raw[0] : raw)
			} catch {
				return {}
			}
		},
	})

	return { ds, url: httpServer.url }
}

export async function stopTestServer() {
	try {
		await server?.stop()
	} catch {}

	try {
		if (ds?.isInitialized) await ds.destroy()
	} catch {}

	try {
		await container?.stop()
	} catch {}
}

export async function testClientForUser(user?: any, { ip = "127.0.0.1" } = {}) {
	return createTestClient(httpServer.url, { user, req: { ip } })
}
