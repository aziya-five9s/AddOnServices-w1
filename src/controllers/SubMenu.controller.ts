import { Request, Response } from "express"
// import moment from "moment"
// import { z, ZodError } from "zod"
// // import { v4 as uuidv4 } from "uuid"
import { AppDataSource } from "../data-source"
import { SubMenu } from "../entity/SubMenu.entity"
import { AnyObject } from "../types/common"
import { CommonController } from "./common.controller"
import { TenantInfo } from "../entity/TenantInfo.entity"

const userData = { tenantId: "tenant-001", userId: "user-001", userName: "John Doe", userEmail: "johndoe@email.com" }
export class SubMenuController { 

    static async postSubMenuData(req: Request, res: Response) {
        try {
            const filePath = await CommonController.uploadDocument(req, res)
            if (!filePath || filePath.status === false) {
                return res.status(400).json({ success: false, message: "No file uploaded!" })
            }
            const { heading, tenantId } = req.body
            const tenantinfo = await TenantInfo.findOne({where: {tenantId}})
            const subMenuData = new SubMenu()
            // subMenuData.tenantId = userData.tenantId
            subMenuData.heading = heading
            subMenuData.tenant = tenantinfo
            subMenuData.tenantId =req.body.tenantId
            if (subMenuData.subMenu == null) {
                subMenuData.subMenu = []
            }
            subMenuData.subMenu =
                [...subMenuData.subMenu, { title: req.body.title, imagePath: filePath.fpath, imgId: filePath.docId, updatedAt: new Date(), uploadedBy: userData.userName }]
            await subMenuData.save()
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

    static async getSubMenuData(req: Request, res: Response) {
        try {
            const repo = AppDataSource.getRepository(SubMenu)
            // Fetch all basicDetails data, applying filters from query parameters if provided

            //relations----> means we get the overall data of tenant which was use for join
            //select=--> we use to show fields (i require few fields i take that in select)
            // const subMenuData = await repo.find({ where: { ...req.query}, relations:["tenant"], select:["heading", "subMenu"] });
            const subMenuData = await repo.find({ where: { ...req.query}, relations:["tenant"] });
            return res.status(200).json({
                success: true,
                data: subMenuData
            });
        } catch (error) {
            return res.status(500).json({
                success: false,
                message: (error instanceof Error) ? error.message : "An unknown error occurred"
            });
        }
    }

    static async deleteSubMenuData(req: Request, res: Response) {
        try {
            const id = req.params.id
            const item = await SubMenu.findOneBy({ id });
            if (!item) {
                return res.status(404).json({ message: "Item not found" });
            }
            await SubMenu.remove(item);
            return res.status(200).json({ success: true, message: `Item with id ${id} deleted successfully` });
        } catch (error) {
            return res.status(500).json({ success: false, message: "Error deleting item", error });
        }
    }

    static async updateSubMenuData(req: Request, res: Response) {
        try {
            const { heading,tenantId } = req.body
            const filePath = await CommonController.uploadDocument(req, res)
            const repo = AppDataSource.getRepository(SubMenu);
            const { id } = req.params; // Extract the basicDetails ID from request parameters
            if (!id) {
                return res.status(404).json({
                    success: false,
                    message: "Id not found",
                });
            }
            const tenantinfo = await TenantInfo.findOne({where: {tenantId}})
            // Check if the basicDetails record exists
            const existingSubMenuDetails = await repo.findOne({ where: { id } });
            if (!existingSubMenuDetails) {
                return res.status(404).json({
                    success: false,
                    message: "SubMenu data not found",
                });
               
            }
            if (filePath && filePath.status == true) {
                existingSubMenuDetails.subMenu =[{ title: req.body.title, imagePath: filePath.fpath, imgId: filePath.docId, updatedAt: new Date(), uploadedBy: userData.userName }]
            }
            existingSubMenuDetails.heading = req.body.heading
            existingSubMenuDetails.tenant = tenantinfo

            await existingSubMenuDetails.save()
            return res.status(200).json({
                success: true,
                message: "SubMenu data updated successfully",
                data: existingSubMenuDetails,
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