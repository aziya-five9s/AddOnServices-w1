import { Request, Response } from "express"
// import moment from "moment"
// import { z, ZodError } from "zod"
// // import { v4 as uuidv4 } from "uuid"
import { AppDataSource } from "../data-source"
import { TenantInfo } from "../entity/TenantInfo.entity"
import { AnyObject } from "../types/common"
import { CommonController } from "./common.controller"

const userData = { tenantId:"tenant-001", userId: "user-001", userName: "John Doe", userEmail: "johndoe@email.com" }
export class TenantInfoController {

    static async postTenantInfoData(req: Request, res: Response) {
        try {
            const filePath = await CommonController.uploadDocument(req, res)
            if (!filePath || filePath.status === false) {
                return res.status(400).json({ success: false, message: "No file uploaded!" })
            }
            const { address, contactUs, policies, followUsOn, changeoutlet,tenantName } = req.body
            const TenantInfoData = new TenantInfo()
            TenantInfoData.address = address
            TenantInfoData.tenantId = userData.tenantId
            TenantInfoData.tenantName = tenantName
            TenantInfoData.contactUs = contactUs
            TenantInfoData.policies = JSON.parse(policies)
            TenantInfoData.followUsOn = JSON.parse(followUsOn)
            TenantInfoData.logo = { docId: filePath.docId, docPath: filePath.fpath, uploadedAt: new Date(), uploadedBy: userData.userName }
            TenantInfoData.changeoutlet = JSON.parse(changeoutlet)
            await TenantInfoData.save()
            req.logo = filePath.fpath
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

    static async getTenantInfoData(req: Request, res: Response) {
        try {
            const repo = AppDataSource.getRepository(TenantInfo)
            // Fetch all TenantInfo data, applying filters from query parameters if provided
            const TenantInfoData = await repo.find({ where: { ...req.query } });
            return res.status(200).json({
                success: true,
                data: TenantInfoData
            });
        } catch (error) {
            return res.status(500).json({
                success: false,
                message: (error instanceof Error) ? error.message : "An unknown error occurred"
            });
        }
    }

    static async deleteTenantInfoData(req: Request, res: Response) {
        try {
            const id = req.params.id
            const item = await TenantInfo.findOneBy({ id });
            if (!item) {
                return res.status(404).json({ message: "Item not found" });
            }
            await TenantInfo.remove(item);
            return res.status(200).json({ success: true, message: `Item with id ${id} deleted successfully` });
        } catch (error) {
            return res.status(500).json({ success: false, message: "Error deleting item", error });
        }
    } 

    static async updateTenantInfoData(req: Request, res: Response) {
        try {
            const { address, contactUs, policies, followUsOn, changeoutlet,tenantName } = req.body
            const filePath = await CommonController.uploadDocument(req, res)
            const repo = AppDataSource.getRepository(TenantInfo);
            const { id } = req.params; // Extract the TenantInfo ID from request parameters
            if (!id) {
                return res.status(404).json({
                    success: false,
                    message: "Id not found",
                });
            }
            // Check if the TenantInfo record exists
            const existingTenantInfo = await repo.findOne({ where: { id } });
            if (!existingTenantInfo) {
                return res.status(404).json({
                    success: false,
                    message: "TenantInfo data not found",
                });
            }
            if (filePath && filePath.status == true) {
                existingTenantInfo.logo = { docId: filePath.docId, docPath: filePath.fpath, uploadedAt: new Date(), uploadedBy: userData.userName }
                req.logo = filePath.fpath
            }
            existingTenantInfo.address = address
            existingTenantInfo.contactUs = contactUs
            existingTenantInfo.tenantName = tenantName
            existingTenantInfo.policies = JSON.parse(policies)
            existingTenantInfo.followUsOn = JSON.parse(followUsOn)
            existingTenantInfo.changeoutlet = JSON.parse(changeoutlet)
            await existingTenantInfo.save()
            return res.status(200).json({
                success: true,
                message: "TenantInfo data updated successfully",
                data: existingTenantInfo,
            });
        }
        catch (error) {
            return res.status(500).json({
                success: false,
                message: error instanceof Error ? error.message : "An unknown error occurred",
            });
        }
    }

    //---------------------------------------Hero Section start--------------------------------------
    static async addHeroSectionData (req:Request, res:Response) {
        try{
            // const { title, subTitle, userId } = req.body
            const filePath = await CommonController.uploadDocument(req, res)
            if (!filePath || filePath.status === false) {
                return res.status(400).json({ success: false, message: "No file uploaded!" })
            }

            const ChefDetails = await TenantInfo.findOne({where:{tenantId: req.body.tenantId}})
            ChefDetails.heroSection  = [
                ...(ChefDetails.heroSection || []),
                {
                    title: req.body.title,
                    subTitle: req.body.subTitle,
                    imagePath: filePath.fpath,
                    imgId: filePath.docId,
                    updatedAt: new Date(),
                },
            ]

            await ChefDetails.save()
            return res.status(200).json({
                success: true, message: "Data Saved Successfully"
            })
        } catch(error){
            return res.status(500).json({
                success: false,
                message: error instanceof Error ? error.message : "An unknown error occurred",
            });
        }
    }

    static async updateHeroSectionData (req:Request, res:Response) {
        try{
            const { title, subTitle, imgId, tenantId } = req.body
            const filePath = await CommonController.uploadDocument(req, res)
            
            let fpath, docId
            if (filePath && filePath.status === true) {
                fpath = filePath.fpath
                docId = filePath.docId
            }

            const ChefDetails = await TenantInfo.findOne({where:{tenantId: req.body.tenantId}})
            
            const index = ChefDetails.heroSection?.findIndex(item => item.imgId === req.body.imgId);
        
            // If found, update the existing entry
            if (index !== -1 && index !== undefined) {
                ChefDetails.heroSection[index] = {
                    ...ChefDetails.heroSection[index],
                    title:req.body.title,
                    subTitle:req.body.subTitle,                   
                    updatedAt: new Date(),
                };
                if (filePath && filePath.status === true) {
                    ChefDetails.heroSection[index] = {
                        ...ChefDetails.heroSection[index],
                        imagePath: fpath,
                        imgId: docId
                    }
                }
            } else {
                return res.status(404).json({
                    success: false,
                    message: "Not Found",
                });
                
            }
            await ChefDetails.save()
            return res.status(201).json({
                success: true, message: "Data Updated Successfully"
            })
        } catch(error){
            return res.status(500).json({
                success: false,
                message: error instanceof Error ? error.message : "An unknown error occurred",
            });
        }
    }

    static async deleteHeroSectionData(req:Request, res:Response){
        try{
            const { tenantId, id } = req.params
            const ChefDetails = await TenantInfo.findOne({where:{tenantId: userData.tenantId}})
            // Filter out the image object by imgId
            ChefDetails.heroSection = ChefDetails.heroSection?.filter(item => item.imgId !== id) || [];

            // Save back to the database
            await ChefDetails.save();
            return res.status(201).json({
                success: true, message: "Data Deleted Successfully"
            })
        } catch(error){
            return res.status(500).json({
                success: false,
                message: error instanceof Error ? error.message : "An unknown error occurred",
            });
        }
    }

    static async getHeroSectionData(req:Request, res:Response){
        try{
            const { tenantId , id } = req.params
            const ChefDetails = await TenantInfo.findOne({where:{tenantId: tenantId}})
            
            if(id){
                const heroSection = ChefDetails?.heroSection.find((el)=> el.imgId===id)
                return res.status(200).json({
                    success: true, data: heroSection? heroSection: {}
                })
            }

            const heroSection = ChefDetails?.heroSection
            return res.status(200).json({
                success: true, data: heroSection? heroSection: {}
            })
        } catch(error){
            return res.status(500).json({
                success: false,
                message: error instanceof Error ? error.message : "An unknown error occurred",
            });
        }
    }
    //---------------------------------------Hero Section end----------------------------------------
}