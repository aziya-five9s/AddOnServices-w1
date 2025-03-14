import { AppDataSource } from "./data-source"
import express from "express"
import morgan from "morgan"
import dotenv from "dotenv"
import { Request, Response } from "express"
import cors from "cors"
import path from "path"
import "reflect-metadata"
import { basicDetailsRouter } from "./routes/basicdetails.routes"
import { heroSectionRouter } from "./routes/herosection.routes"

dotenv.config()

const app = express()
app.use(express.json())
const { PORT = 3000 } = process.env
app.use(morgan("dev"))
app.use(cors())


app.use("/api/basicDetails", basicDetailsRouter)
app.use("/api/heroSection", heroSectionRouter)


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
