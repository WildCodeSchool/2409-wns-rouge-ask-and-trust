import dotenv from "dotenv"
import { DataSource } from "typeorm"
// import { Payment } from '../entities/payment';
// import { Answers } from '../entities/survey/answers';
// import { Category } from '../entities/survey/category';
// import { Questions } from '../entities/survey/questions';
// import { Survey } from '../entities/survey/survey';
// import { User } from '../entities/user';
import path from "path"

dotenv.config({ path: "../../.env.test" })

export const testDataSource = new DataSource({
	type: "postgres",
	host: process.env.POSTGRES_HOST || "localhost",
	port: Number(process.env.POSTGRES_PORT) || 5432,
	username: process.env.POSTGRES_USER,
	password: process.env.POSTGRES_PASSWORD,
	database: process.env.POSTGRES_DB,
	synchronize: true,
	dropSchema: true,
	logging: false,
	entities: [path.join(__dirname, "../entities/**/*.{ts,js}")],
	// entities: [User, Payment, Survey, Questions, Category, Answers],
})

export default testDataSource
