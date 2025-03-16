// import * as express from "express"
import express from "express";
import {ChefMenuController} from "../controllers/chefMenu.controller"

const Router = express.Router()

Router.post("/create",ChefMenuController.postChefMenuData)
Router.delete("/delete/:id",ChefMenuController.deleteChefMenuData)
Router.route("/get/:id?").get(ChefMenuController.getChefMenuData)
Router.route("/update/:id").put(ChefMenuController.updateChefMenuData);

export { Router as chefMenuRouter }
