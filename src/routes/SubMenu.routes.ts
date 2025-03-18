// import * as express from "express"
import express from "express";
import {SubMenuController} from "../controllers/SubMenu.controller"

const Router = express.Router()


Router.post("/create",SubMenuController.postSubMenuData)
Router.delete("/delete/:id",SubMenuController.deleteSubMenuData)
Router.route("/get/:id?").get(SubMenuController.getSubMenuData)
Router.route("/update/:id").put(SubMenuController.updateSubMenuData);

export { Router as subMenuRouter }


