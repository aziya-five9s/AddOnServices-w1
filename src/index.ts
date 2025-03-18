import { AppDataSource } from "./data-source"
import express from "express"
import morgan from "morgan"
import dotenv from "dotenv"
import { Request, Response } from "express"
import cors from "cors"
import path from "path"
import "reflect-metadata"
import { TenantInfoRouter } from "./routes/TenantInfo.routes"
import { heroSectionRouter } from "./routes/heroSection.routes"
import {  chefMenuRouter } from "./routes/chefMenu.routes"
import {aboutSectionRouter} from "./routes/AboutSection.routes"
import {subMenuRouter} from "./routes/SubMenu.routes"

dotenv.config()

const app = express()
app.use(express.json())
const { PORT = 3000 } = process.env
app.use(morgan("dev"))
app.use(cors())


app.use("/api/tenant", TenantInfoRouter)
app.use("/api/herosection", heroSectionRouter)
app.use("/api/chefmenu", chefMenuRouter)
app.use("/api/aboutsection", aboutSectionRouter)
app.use("/api/submenu", subMenuRouter)


app.get("*", (req: Request, res: Response) => {
    res.status(505).json({ success: false, message: "Bad Request" })
})
app.use("/public", express.static(path.join(__dirname, "src/public")))

AppDataSource.initialize()
    .then(async (dataSource) => {
        console.log("Data-Sources have been Initialized!")
        await dataSource.runMigrations()
        app.listen(PORT, () => {
            console.log("Server is running on http://localhost:" + PORT)
        })
    })
    .catch((error) => {
        console.error("Error Initializing Data-Sources:", error)
        process.exit(1)
    })
