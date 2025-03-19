// import * as express from "express"
import express from "express";
import {TenantInfoController} from "../controllers/TenantInfo.controller"

const Router = express.Router()

Router.post("/create/:id",TenantInfoController.addUpdateAboutSectionData)
Router.delete("/delete/:id",TenantInfoController.deleteAboutSectionData)


Router.route("/get/:id").get(TenantInfoController.getAboutSectionData)
// Router.route("/update/:id").put(TenantInfoController.updateAboutSectionData);

export { Router as aboutSectionRouter }

