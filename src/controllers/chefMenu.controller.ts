import { Request, Response } from "express"
// import moment from "moment"
// import { z, ZodError } from "zod"
// // import { v4 as uuidv4 } from "uuid"
import { AppDataSource } from "../data-source"
import { ChefMenu } from "../entity/chefMenu.entity"
import { AnyObject } from "../types/common"
import { CommonController } from "./common.controller"

const userData = { tenantId:"tenant-001", userId: "user-001", userName: "John Doe", userEmail: "johndoe@email.com" }
export class ChefMenuController {

    static async postChefMenuData(req: Request, res: Response) {
        try {
            const filePath = await CommonController.uploadDocument(req, res)
            if (!filePath || filePath.status === false) {
                return res.status(400).json({ success: false, message: "No file uploaded!" })
            }
            const { heading } = req.body
            const chefMenuData = new ChefMenu()
            chefMenuData.tenantId = userData.tenantId
            chefMenuData.heading = heading
            chefMenuData.logo = { docId: filePath.docId, docPath: filePath.fpath, uploadedAt: new Date(), uploadedBy: userData.userName }
            await chefMenuData.save()
            return res.status(200).json({
                success: true, message: "Data Saved Successfully"
            })
        }
        catch (error) {
            return res.status(500).json({
                success: false,
                message: (error as Error).message
            })
        }
    }

    static async getChefMenuData(req: Request, res: Response) {
        try {
            const repo = AppDataSource.getRepository(ChefMenu)
            // Fetch all basicDetails data, applying filters from query parameters if provided
            const basicChefmenuData = await repo.find({ where: { ...req.query } });
            return res.status(200).json({
                success: true,
                data: basicChefmenuData
            });
        } catch (error) {
            return res.status(500).json({
                success: false,
                message: (error instanceof Error) ? error.message : "An unknown error occurred"
            });
        }
    }

    static async deleteChefMenuData(req: Request, res: Response) {
        try {
            const id = req.params.id
            const item = await ChefMenu.findOneBy({ id });
            if (!item) {
                return res.status(404).json({ message: "Item not found" });
            }
            await ChefMenu.remove(item);
            return res.status(200).json({ success: true, message: `Item with id ${id} deleted successfully` });
        } catch (error) {
            return res.status(500).json({ success: false, message: "Error deleting item", error });
        }
    } 

    static async updateChefMenuData(req: Request, res: Response) {
        try {
            const {heading} = req.body
            const filePath = await CommonController.uploadDocument(req, res)
            const repo = AppDataSource.getRepository(ChefMenu);
            const { id } = req.params; // Extract the basicDetails ID from request parameters
            if (!id) {
                return res.status(404).json({
                    success: false,
                    message: "Id not found",
                });
            }
            // Check if the basicDetails record exists
            const existingChefMenuDetails = await repo.findOne({ where: { id } });
            if (!existingChefMenuDetails) {
                return res.status(404).json({
                    success: false,
                    message: "ChefMenu data not found",
                });
            }
            if (filePath && filePath.status == true) {
                existingChefMenuDetails.logo = { docId: filePath.docId, docPath: filePath.fpath, uploadedAt: new Date(), uploadedBy: userData.userName }
            }
            existingChefMenuDetails.heading = heading
          
            await existingChefMenuDetails.save()
            return res.status(200).json({
                success: true,
                message: "ChefMenu data updated successfully",
                data: existingChefMenuDetails,
            });
        }
        catch (error) {
            return res.status(500).json({
                success: false,
                message: error instanceof Error ? error.message : "An unknown error occurred",
            });
        }
    }

}