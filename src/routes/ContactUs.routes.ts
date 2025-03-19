
// import * as express from "express"
import express from "express";
import {ContactUsController} from "../controllers/ContactUs.controller"

const Router = express.Router()


Router.post("/create",ContactUsController.postContactUsData)
// Router.post("/create/:id",ContactUsController.postContactUsData)
Router.delete("/delete/:id",ContactUsController.deleteContactUsData)
Router.route("/get/:id?").get(ContactUsController.getContactUsData)
Router.route("/update/:id").put(ContactUsController.updateContactUsData);

export { Router as contactUsRouter }
