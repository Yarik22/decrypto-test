import { DataSource, DataSourceOptions } from "typeorm";
import * as dotenv from 'dotenv';
dotenv.config();

export const dataSourceOptions : DataSourceOptions = {
    type:"postgres",
    url:process.env.DB_URL,
    // host:process.env.DB_HOST,
    // port: Number(process.env.DB_PORT),
    // username: process.env.DB_USERNAME,
    // password: String(process.env.DB_PASSWORD),
    // database: process.env.DB_DATABASE,
    // synchronize: true,
    entities: ['dist/**/*.entity.js'],
    migrations: ['dist/db/migrations/*.js'],
};
const dataSource = new DataSource(dataSourceOptions);
export default dataSource;
