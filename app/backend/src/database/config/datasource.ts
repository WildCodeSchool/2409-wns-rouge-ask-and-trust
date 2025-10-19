import { DataSource } from "typeorm"
import path from "path"
import dotenv from "dotenv"

const IS_TEST =
	process.env.NODE_ENV === "testing" || process.env.NODE_ENV === "test"
const IS_CI = process.env.CI === "true"
const IS_DEV = process.env.IS_DEV === "true"

if (IS_TEST && !IS_CI) {
	const envFile = path.resolve(process.cwd(), "test.env")
	dotenv.config({ path: envFile })
} else {
	dotenv.config()
}

const dataSource = new DataSource({
	type: "postgres",
	// In testing environment, create a separate database
	host: process.env.DB_HOST,
	port: parseInt(process.env.DB_PORT || "5432"),
	username: process.env.POSTGRES_USER,
	password: process.env.POSTGRES_PASSWORD,
	database: process.env.POSTGRES_DB,
	entities: [path.join(__dirname, "../entities/**/*.{ts,js}")],
	// Synchronize schema only in dev or test environment
	synchronize: IS_DEV || IS_TEST,
	dropSchema: IS_TEST,
	migrations: [path.join(__dirname, "../migrations/*.{ts,js}")],
	migrationsTableName: "migrations",
	// Run migrations only in production
	migrationsRun: !IS_DEV && !IS_TEST,
	logging: !IS_TEST,
})

export default dataSource
