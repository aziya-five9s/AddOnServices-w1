import { Request, Response } from "express"
// import moment from "moment"
// import { z, ZodError } from "zod"
// // import { v4 as uuidv4 } from "uuid"
import { AppDataSource } from "../data-source"
import { SubMenu } from "../entity/SubMenu.entity"
import { AnyObject } from "../types/common"
import { CommonController } from "./common.controller"
import { TenantInfo } from "../entity/TenantInfo.entity"
import { ContactUs } from "../entity/ContactUs.entity"

const userData = { tenantId: "tenant-001", userId: "user-001", userName: "John Doe", userEmail: "johndoe@email.com" }
export class ContactUsController {

    static async postContactUsData(req: Request, res: Response) {
        try {
            // const filePath = await CommonController.uploadDocument(req, res)
            const filePath = await CommonController.uploadDocuments(req, res)
            if (!filePath || filePath.status === false) {
                return res.status(400).json({ success: false, message: "No file uploaded!" })
            }
            const { description, address, email, contact, tenantId } = req.body
            // const tenantinfo = await TenantInfo.findOne({ where: { tenantId } })
            const contactUsData = new ContactUs()
            // subMenuData.tenantId = userData.tenantId
            contactUsData.description = description
            contactUsData.address = address
            contactUsData.email = email
            contactUsData.contact = JSON.parse(contact)
            // contactUsData.tenantId = req.body.tenantId
            contactUsData.tenantId = tenantId
            // if (contactUsData.images == null) {
            //     contactUsData.images = []
            // }
            // contactUsData.images =
            //     [...contactUsData.images, { imagePath: filePath.fpath, imgId: filePath.docId, updatedAt: new Date(), uploadedBy: userData.userName }]
            if (filePath.status) {
                const uploadedImages = filePath.files.map(file => ({
                    imagePath: file.fpath,
                    imgId: file.docId,
                    updatedAt: new Date(),
                    uploadedBy: userData.userName,
                }));
    
                // Check if total images exceed the limit (max 4)
                if ( uploadedImages.length > 4) {
                    return res.status(400).json({
                        success: false,
                        message: "Number of uploaded images exceeds the maximum limit (4)",
                    });
                }
    
                // Append new images to existing ones
                contactUsData.images = [ ...uploadedImages];
            }
            else{
                return res.status(400).json({
                    success: false,
                    message: filePath.message,
                });
            }



            await contactUsData.save()
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


    // static async newpostContactUsData(req: Request, res: Response) {
    //     try {
    //         const id=req.params.id
    //         const filePath = await CommonController.uploadDocument(req, res)
    //         if (!filePath || filePath.status === false) {
    //             return res.status(400).json({ success: false, message: "No file uploaded!" })
    //         }
    //         const { description, address, email, contact, tenantId } = req.body
    //         // const tenantinfo = await TenantInfo.findOne({ where: { tenantId } })
    //         const tenantinfo = await TenantInfo.findOne({ where: { id } })
    //         const contactUsData = new ContactUs()
    //         // subMenuData.tenantId = userData.tenantId
    //         contactUsData.description = description
    //         contactUsData.address = address
    //         contactUsData.email = email
    //         contactUsData.contact = JSON.parse(contact)
    //         contactUsData.tenantId = req.body.tenantId
    //         if (contactUsData.images == null) {
    //             contactUsData.images = []
    //         }

    //         // Add new image
    //         const newImage = {
    //             imagePath: filePath.fpath,
    //             imgId: filePath.docId,
    //             updatedAt: new Date(),
    //             uploadedBy: userData.userName
    //         };
    //         if (contactUsData.images.length >= 2) {
    //             return res.status(400).json({
    //                 success: false,
    //                 message: "You can only upload up to 2 images."
    //             });
    //         }

    //         // Add the image if limit is not exceeded
    //         contactUsData.images.push(newImage);


    //         // contactUsData.images =
    //         //     [...contactUsData.images, { imagePath: filePath.fpath, imgId: filePath.docId, updatedAt: new Date(), uploadedBy: userData.userName }]
    //         await contactUsData.save()
    //         return res.status(200).json({
    //             success: true, message: "Data Saved Successfully"
    //         })
    //     }
    //     catch (error) {
    //         return res.status(500).json({
    //             success: false,
    //             message: (error as Error).message
    //         })
    //     }
    // }

    static async getContactUsData(req: Request, res: Response) {
        try {
            const { id } = req.params
            const repo = AppDataSource.getRepository(ContactUs)
            const contactUsData = await repo.find({ where: { id } });
            return res.status(200).json({
                success: true,
                data: contactUsData
            });
        } catch (error) {
            return res.status(500).json({
                success: false,
                message: (error instanceof Error) ? error.message : "An unknown error occurred"
            });
        }
    }

    static async deleteContactUsData(req: Request, res: Response) {
        try {
            const id = req.params.id
            const item = await ContactUs.findOneBy({ id });
            if (!item) {
                return res.status(404).json({ message: "Item not found" });
            }
            await ContactUs.remove(item);
            return res.status(200).json({ success: true, message: `Item with id ${id} deleted successfully` });
        } catch (error) {
            return res.status(500).json({ success: false, message: "Error deleting item", error });
        }
    }

    // static async updateContactUsData(req: Request, res: Response) {
    //     try {
    //         const { id } = req.params; // Extract the basicDetails ID from request parameters
    //         const { description, address, email, contact, images, tenantId } = req.body
    //         const repo = AppDataSource.getRepository(ContactUs);
    //         const existingContactUsDetails = await repo.findOne({ where: { id } });
    //         if (!existingContactUsDetails) {
    //             return res.status(404).json({
    //                 success: false,
    //                 message: "ContactUs data not found",
    //             });
    //         }
    //         if (existingContactUsDetails.images.length <= 4) {
    //             // const filePath = await CommonController.uploadDocument(req, res)
    //             const filePath = await CommonController.uploadDocuments(req, res)
    //             if (filePath && filePath.status == true) {
    //                 // existingContactUsDetails.images = [{ imagePath: filePath.fpath, imgId: filePath.docId, updatedAt: new Date(), uploadedBy: userData.userName }]
    //             }
    //         }
    //         else{
    //             return res.status(400).json({
    //                 success: false,
    //                 message: "Number of uploaded images exceeds the maximum limit",
    //             });
    //         }
            
    //         if (!id) {
    //             return res.status(404).json({
    //                 success: false,
    //                 message: "Id not found",
    //             });
    //         }
    //         // const tenantinfo = await TenantInfo.findOne({ where: { tenantId } })
    //         // Check if the basicDetails record exists
    //         if (req.body.description !== undefined) existingContactUsDetails.description = req.body.description;
    //         if (req.body.address !== undefined) existingContactUsDetails.address = req.body.address;
    //         if (req.body.email !== undefined) existingContactUsDetails.email = req.body.email;
    //         if (req.body.contact !== undefined) existingContactUsDetails.contact = JSON.parse(req.body.contact);

    //         await existingContactUsDetails.save()
    //         return res.status(200).json({
    //             success: true,
    //             message: "ContactUs data updated successfully",
    //             data: existingContactUsDetails,
    //         });
    //     }
    //     catch (error) {
    //         return res.status(500).json({
    //             success: false,
    //             message: error instanceof Error ? error.message : "An unknown error occurred",
    //         });
    //     }
    // }


    static async updateContactUsData(req: Request, res: Response) {
        try {
            const { id } = req.params; // Extract ContactUs ID from request parameters
            const { description, address, email, contact, tenantId } = req.body;
    
            const repo = AppDataSource.getRepository(ContactUs);
            const existingContactUsDetails = await repo.findOne({ where: { id } });
    
            if (!existingContactUsDetails) {
                return res.status(404).json({
                    success: false,
                    message: "ContactUs data not found",
                });
            }
    
            // Ensure the images field exists
            if (!existingContactUsDetails.images) {
                existingContactUsDetails.images = [];
            }
    
            // Upload new images
            const fileUploadResult = await CommonController.uploadDocuments(req, res);
            if (fileUploadResult.status) {
                const uploadedImages = fileUploadResult.files.map(file => ({
                    imagePath: file.fpath,
                    imgId: file.docId,
                    updatedAt: new Date(),
                    uploadedBy: userData.userName,
                }));
    
                // Check if total images exceed the limit (max 4)
                if (existingContactUsDetails.images.length + uploadedImages.length > 4) {
                    return res.status(400).json({
                        success: false,
                        message: "Number of uploaded images exceeds the maximum limit (4)",
                    });
                }
    
                // Append new images to existing ones
                existingContactUsDetails.images = [...existingContactUsDetails.images, ...uploadedImages];
            }
            else{
                return res.status(400).json({
                    success: false,
                    message: fileUploadResult.message,
                });
            }
    
            // Update other fields if provided
            if (description !== undefined) existingContactUsDetails.description = description;
            if (address !== undefined) existingContactUsDetails.address = address;
            if (email !== undefined) existingContactUsDetails.email = email;
            if (contact !== undefined) existingContactUsDetails.contact = JSON.parse(contact);
    
            // Save the updated record
            await existingContactUsDetails.save();
    
            return res.status(200).json({
                success: true,
                message: "ContactUs data updated successfully",
                data: existingContactUsDetails,
            });
        } catch (error) {
            return res.status(500).json({
                success: false,
                message: error instanceof Error ? error.message : "An unknown error occurred",
            });
        }
    }
    

}