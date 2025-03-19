import "reflect-metadata"
import { DataSource } from "typeorm"
import * as path from "path"
import * as dotenv from "dotenv"

import { TenantInfo } from "./entity/TenantInfo.entity"
import { ChefMenu } from "./entity/chefMenu.entity"
import { SubMenu } from "./entity/SubMenu.entity"
import { ContactUs } from "./entity/ContactUs.entity"

dotenv.config()

const { DB_HOST, DB_PORT, DB_USERNAME, DB_PASSWORD, DB_DATABASE, NODE_ENV } = process.env

export const AppDataSource = new DataSource({
    type: "postgres",
    host: DB_HOST,
    port: parseInt(DB_PORT || "5432"),
    username: DB_USERNAME,
    password: DB_PASSWORD,
    database: DB_DATABASE,
    synchronize: false,
    logging: false,
    entities: [
        TenantInfo,
        ChefMenu,
        SubMenu,
        ContactUs
    ],
    migrations: [path.join(__dirname, "./migrations/*")],
    subscribers: [],
    maxQueryExecutionTime: 10000,
    ssl: false,
})
