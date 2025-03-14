// import * as express from "express"
import express from "express";
import {basicDetailsController} from "../controllers/basicdetails.controller"

const Router = express.Router()

Router.post("/create",basicDetailsController.postbasicDetailsData)
Router.delete("/delete/:id",basicDetailsController.deletebasicDetailsData)
Router.route("/get/:id?").get(basicDetailsController.getbasicDetailsData)
Router.route("/update/:id?").put(basicDetailsController.updatebasicDetailsData);

export { Router as basicDetailsRouter }


