
// import * as express from "express"
import express from "express";
import {GalleryController} from "../controllers/Gallery.controller"

const Router = express.Router()


Router.post("/create",GalleryController.postGalleryData)
// Router.post("/create/:id",ContactUsController.postContactUsData)
Router.delete("/delete/:id",GalleryController.deleteGalleryData)
Router.route("/get").get(GalleryController.getGalleryData)
Router.route("/update/:id").put(GalleryController.updateGalleryData);
Router.route("/updateimage/:id").put(GalleryController.updateGalleryImage);

export { Router as galleryRouter }
