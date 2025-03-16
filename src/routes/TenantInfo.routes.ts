// import * as express from "express"
import express from "express";
import {TenantInfoController} from "../controllers/TenantInfo.controller"

const Router = express.Router()

Router.post("/create",TenantInfoController.postTenantInfoData)
Router.delete("/delete/:id",TenantInfoController.deleteTenantInfoData)
Router.route("/get/:id?").get(TenantInfoController.getTenantInfoData)
Router.route("/update/:id").put(TenantInfoController.updateTenantInfoData);

export { Router as TenantInfoRouter }


