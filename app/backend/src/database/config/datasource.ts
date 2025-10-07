import { DataSource } from "typeorm"
import path from "path"
import dotenv from "dotenv"

// const isTest =
// 	process.env.NODE_ENV === "testing" || process.env.NODE_ENV === "test"
// const envFile = isTest
// 	? path.resolve(process.cwd(), "test.env")
// 	: path.resolve(process.cwd(), ".env")

// dotenv.config({ path: envFile })
const isTest =
	process.env.NODE_ENV === "testing" || process.env.NODE_ENV === "test"

if (isTest && process.env.CI !== "true") {
	const envFile = path.resolve(process.cwd(), "test.env")
	dotenv.config({ path: envFile })
} else {
	dotenv.config()
}

const dataSource = new DataSource({
	type: "postgres",
	host: process.env.DB_HOST, // db_test in ci, localhost when local testing
	port: parseInt(process.env.DB_PORT || "5432"),
	username: process.env.POSTGRES_USER,
	password: process.env.POSTGRES_PASSWORD,
	database: process.env.POSTGRES_DB,
	entities: [path.join(__dirname, "../entities/**/*.{ts,js}")],
	synchronize: process.env.IS_DEV === "true" || isTest, // in prod environment, IS_DEV is false and Typeorm runs migrations scripts.
	dropSchema: isTest,
	migrations: [path.join(__dirname, "../migrations/*.{ts,js}")],
	migrationsTableName: "migrations",
	logging: !isTest,
	migrationsRun: !isTest && process.env.IS_DEV !== "true", // Run migrations only in production (IS_DEV=false)
})

export default dataSource
