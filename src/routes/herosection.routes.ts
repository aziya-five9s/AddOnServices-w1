// import * as express from "express"
import express from "express";
import {basicDetailsController} from "../controllers/basicdetails.controller"

const Router = express.Router()


Router.post("/create",basicDetailsController.addHeroSectionData)
Router.delete("/delete/:userId/:id",basicDetailsController.deleteHeroSectionData)
Router.route("/get/:userId/:id?").get(basicDetailsController.getHeroSectionData)
Router.route("/update/:id?").put(basicDetailsController.updateHeroSectionData);

export { Router as heroSectionRouter }


