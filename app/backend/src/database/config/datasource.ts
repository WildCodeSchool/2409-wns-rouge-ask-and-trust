import { DataSource } from "typeorm"
import path from "path"

const dataSource = new DataSource({
	type: "postgres",
	host: process.env.DB_HOST,
	port: parseInt(process.env.DB_PORT || "5432"),
	username: process.env.POSTGRES_USER,
	password: process.env.POSTGRES_PASSWORD,
	database: process.env.POSTGRES_DB,
	entities: [path.join(__dirname, "../entities/**/*.{ts,js}")],
	synchronize: process.env.IS_DEV === "true", // in prod environment, IS_DEV is false and Typeorm runs migrations scripts.
	migrations: [path.join(__dirname, "../migrations/*.{ts,js}")],
	migrationsTableName: "migrations",
	logging: true,
	migrationsRun: true, // Active the migrations
})

export default dataSource
