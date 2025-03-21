// import * as express from "express"
import express from "express";
import {TenantInfoController} from "../controllers/TenantInfo.controller"

const Router = express.Router()



Router.post("/create/:tenantId",TenantInfoController.addHeroSectionData)
Router.delete("/delete/:id/:imgid",TenantInfoController.deleteHeroSectionData)
Router.route("/get/:tenantId/:id?").get(TenantInfoController.getHeroSectionData)
Router.route("/update/:id").put(TenantInfoController.updateHeroSectionData);

export { Router as heroSectionRouter }


