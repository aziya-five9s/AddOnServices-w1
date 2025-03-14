import { Request, Response } from "express"
// import moment from "moment"
// import { z, ZodError } from "zod"
// // import { v4 as uuidv4 } from "uuid"
import { AppDataSource } from "../data-source"
import { BasicDetails } from "../entity/basicdetails.entity"
import { AnyObject } from "../types/common"
import { CommonController } from "./common.controller"

const userData = { userId: "staticUserId", userName: "staticUserName", userEmail: "static@email.com" }
export class basicDetailsController {

    static async postbasicDetailsData(req: Request, res: Response) {
        try {
            const filePath = await CommonController.uploadDocument(req, res)
            if (!filePath || filePath.status === false) {
                return res.status(400).json({ success: false, message: "No file uploaded!" })
            }
            const { address, contactUs, policies, followUsOn, changeoutlet } = req.body
            const basicDetailsData = new BasicDetails()
            basicDetailsData.address = address
            basicDetailsData.userId = userData.userId
            basicDetailsData.contactUs = contactUs
            basicDetailsData.policies = JSON.parse(policies)
            basicDetailsData.followUsOn = JSON.parse(followUsOn)
            basicDetailsData.logo = { docId: filePath.docId, docPath: filePath.fpath, uploadedAt: new Date(), uploadedBy: userData.userName }
            basicDetailsData.changeoutlet = JSON.parse(changeoutlet)
            await basicDetailsData.save()
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

    static async getbasicDetailsData(req: Request, res: Response) {
        try {
            const repo = AppDataSource.getRepository(BasicDetails)
            // Fetch all basicDetails data, applying filters from query parameters if provided
            const basicDetailsData = await repo.find({ where: { ...req.query } });
            return res.status(200).json({
                success: true,
                data: basicDetailsData
            });
        } catch (error) {
            return res.status(500).json({
                success: false,
                message: (error instanceof Error) ? error.message : "An unknown error occurred"
            });
        }
    }

    static async deletebasicDetailsData(req: Request, res: Response) {
        try {
            const id = req.params.id
            const item = await BasicDetails.findOneBy({ id });
            if (!item) {
                return res.status(404).json({ message: "Item not found" });
            }
            await BasicDetails.remove(item);
            return res.status(200).json({ success: true, message: `Item with id ${id} deleted successfully` });
        } catch (error) {
            return res.status(500).json({ success: false, message: "Error deleting item", error });
        }
    } 

    static async updatebasicDetailsData(req: Request, res: Response) {
        try {
            const { address, contactUs, policies, followUsOn, changeoutlet } = req.body
            const filePath = await CommonController.uploadDocument(req, res)
            const repo = AppDataSource.getRepository(BasicDetails);
            const { id } = req.params; // Extract the basicDetails ID from request parameters
            if (!id) {
                return res.status(404).json({
                    success: false,
                    message: "Id not found",
                });
            }
            // Check if the basicDetails record exists
            const existingbasicDetails = await repo.findOne({ where: { id } });
            if (!existingbasicDetails) {
                return res.status(404).json({
                    success: false,
                    message: "basicDetails data not found",
                });
            }
            if (filePath && filePath.status == true) {
                existingbasicDetails.logo = { docId: filePath.docId, docPath: filePath.fpath, uploadedAt: new Date(), uploadedBy: userData.userName }
                req.logo = filePath.fpath
            }
            existingbasicDetails.address = address
            existingbasicDetails.contactUs = contactUs
            existingbasicDetails.policies = JSON.parse(policies)
            existingbasicDetails.followUsOn = JSON.parse(followUsOn)
            existingbasicDetails.changeoutlet = JSON.parse(changeoutlet)
            await existingbasicDetails.save()
            return res.status(200).json({
                success: true,
                message: "basicDetails data updated successfully",
                data: existingbasicDetails,
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

            const ChefDetails = await BasicDetails.findOne({where:{userId: req.body.userId}})
            ChefDetails.heroSection  = [
                ...(ChefDetails.heroSection || []),
                {
                    // sNo: ChefDetails.heroSection ?.length + 1 || 1,
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
            const { title, subTitle, imgId, userId } = req.body
            const filePath = await CommonController.uploadDocument(req, res)
           
            let fpath, docId
            if (filePath && filePath.status === true) {
                fpath = filePath.fpath
                docId = filePath.docId
            }

            const ChefDetails = await BasicDetails.findOne({where:{userId: userId}})
            
            const index = ChefDetails.heroSection?.findIndex(item => item.imgId === imgId);
            

            // If found, update the existing entry
            if (index !== -1 && index !== undefined) {
                ChefDetails.heroSection[index] = {
                    ...ChefDetails.heroSection[index],
                    title,
                    subTitle,                   
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
                // If not found, add a new entry
                ChefDetails.heroSection = [
                    ...(ChefDetails.heroSection || []),
                    {
                        // sNo: (ChefDetails.heroSection?.length || 0) + 1, // Auto-increment sNo
                        title,
                        subTitle,
                        imagePath: fpath,
                        imgId: docId,
                        updatedAt: new Date(),
                    },
                ];
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
            const { userId, id } = req.params
            const ChefDetails = await BasicDetails.findOne({where:{userId: userData.userId}})
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
            const { userId , id } = req.params
            const ChefDetails = await BasicDetails.findOne({where:{userId: userId}})
            if(id){
                const heroSection = ChefDetails.heroSection.find((el)=> el.imgId===id)
                return res.status(200).json({
                    success: true, data: heroSection? heroSection: {}
                })
            }
            const heroSection = ChefDetails.heroSection
            return res.status(200).json({
                success: true, data: heroSection
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