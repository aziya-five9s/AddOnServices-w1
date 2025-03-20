import { AppDataSource } from "./data-source"
import express from "express"
import morgan from "morgan"
import dotenv from "dotenv"
import { Request, Response } from "express"
import cors from "cors"
import path from "path"
import "reflect-metadata"
import { TenantInfoRouter } from "./routes/TenantInfo.routes"
import { heroSectionRouter } from "./routes/herosection.routes"
import {  chefMenuRouter } from "./routes/ChefMenu.routes"
import {aboutSectionRouter} from "./routes/AboutSection.routes"
import {subMenuRouter} from "./routes/SubMenu.routes"
import { contactUsRouter } from "./routes/ContactUs.routes"
import bodyParser from "body-parser"
import { galleryRouter } from "./routes/GallerySection.routes"

dotenv.config()

const app = express()
app.use(express.json())
app.use(express.urlencoded({ extended: true }));
const { PORT = 3000 } = process.env
app.use(morgan("dev"))
app.use(cors())


app.use("/api/tenant", TenantInfoRouter)
app.use("/api/herosection", heroSectionRouter)
app.use("/api/chefmenu", chefMenuRouter)
app.use("/api/aboutsection", aboutSectionRouter)
app.use("/api/submenu", subMenuRouter)
app.use("/api/contactus", contactUsRouter)
app.use("/api/gallery", galleryRouter)


// app.use(bodyParser.json());
// app.use(bodyParser.urlencoded({ extended: true }));


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
