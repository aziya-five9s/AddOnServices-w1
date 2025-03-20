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
import { Gallery } from "../entity/GallerySection.entity"

const userData = { tenantId: "tenant-001", userId: "user-001", userName: "John Doe", userEmail: "johndoe@email.com" }
export class GalleryController {


    static async postGalleryData(req: Request, res: Response) {
        try {
            // Upload images
            const filePath = await CommonController.uploadDocuments(req, res);
            if (!filePath || filePath.status === false) {
                return res.status(400).json({ success: false, message: "No file uploaded!" });
            }
            const repo = new Gallery()
            const { tenantId, meals } = req.body;

            // Format uploaded images
            const uploadedImages = filePath.files.map((file, index) => ({
                title: req.body.title[index],
                imagePath: file.fpath,
                imgId: file.docId,
                uploadedAt: new Date(),
                uploadedBy: userData.userName
            }));

            repo.tenantId = req.body.tenantId
            repo.morningMeal = uploadedImages


            await repo.save();
            return res.status(200).json({ success: true, message: "Gallery added successfully" });
        } catch (error) {
            return res.status(500).json({
                success: false,
                message: (error as Error).message,
            });
        }
    }

    static async getGalleryData(req: Request, res: Response) {
        try {
            const repo = AppDataSource.getRepository(Gallery)
            const galleryData = await repo.find({ where: { ...req.query } });
            return res.status(200).json({
                success: true,
                data: galleryData
            });
        } catch (error) {
            return res.status(500).json({
                success: false,
                message: (error instanceof Error) ? error.message : "An unknown error occurred"
            });
        }
    }

    static async deleteGalleryData(req: Request, res: Response) {
        try {
            const id = req.params.id
            const item = await Gallery.findOneBy({ id });
            if (!item) {
                return res.status(404).json({ message: "Item not found" });
            }
            await Gallery.remove(item);
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


    static async updateGalleryData(req: Request, res: Response) {
        try {
            const { id } = req.params;
            const title = req.body?.title ? JSON.parse(req.body.title) : []
            const { morningMeal, afternoonMeal, eveningMeal } = req.body;
            const repo = AppDataSource.getRepository(Gallery);
            const existingGalleryDetails = await repo.findOne({ where: { id } });
            
            if (!existingGalleryDetails) {
                return res.status(404).json({
                    success: false,
                    message: "Gallery data not found",
                });
            }
            // Upload new images
            const fileUploadResult = await CommonController.uploadDocuments(req, res);
            let uploadedImages
            if (fileUploadResult.status) {
                uploadedImages = fileUploadResult.files.map((file, index) => ({
                    title: title[index],
                    imagePath: file.fpath,
                    imgId: file.docId,
                    uploadedAt: new Date(),
                    uploadedBy: userData.userName
                }));
            }
            else {
                return res.status(400).json({
                    success: false,
                    message: fileUploadResult.message,
                });
            }

            if (req.body.morningMeal == true || req.body.morningMeal == "true") {
                // Ensure the images field exists
                if (!existingGalleryDetails.morningMeal) {
                    existingGalleryDetails.morningMeal = [];
                }
                //   Append new images to existing ones
                existingGalleryDetails.morningMeal = [...existingGalleryDetails.morningMeal, ...uploadedImages];

            }

            if (req.body.afternoonMeal == true || req.body.afternoonMeal == "true") {
                // Ensure the images field exists
                if (!existingGalleryDetails.afternoonMeal) {
                    existingGalleryDetails.afternoonMeal = [];
                }
                //   Append new images to existing ones
                existingGalleryDetails.afternoonMeal = [...existingGalleryDetails.afternoonMeal, ...uploadedImages];

            }
            if (req.body.eveningMeal == true || req.body.eveningMeal == "true") {
                // Ensure the images field exists
                if (!existingGalleryDetails.eveningMeal) {
                    existingGalleryDetails.eveningMeal = [];
                }
                //   Append new images to existing ones
                existingGalleryDetails.eveningMeal = [...existingGalleryDetails.eveningMeal, ...uploadedImages];

            }

            // Save the updated record
            await existingGalleryDetails.save();

            return res.status(200).json({
                success: true,
                message: "Gallery data updated successfully"
            });
        } catch (error) {
            return res.status(500).json({
                success: false,
                message: error instanceof Error ? error.message : "An unknown error occurred",
            });
        }
    }



    // static async updateImageData(req: Request, res: Response) {
    //     try {
    //         const { id } = req.params
    //         const filePath = await CommonController.uploadDocument(req, res)
    //         let fpath, docId
    //         if (filePath && filePath.status === true) {
    //             fpath = filePath.fpath
    //             docId = filePath.docId
    //         }
    //         const galleryDetails = await Gallery.findOne({ where: { id } })
    //         let index = galleryDetails.morningMeal?.findIndex(item => item.imgId === req.body.imgId)
    //         if (index !== -1 && index !== undefined) {
    //             galleryDetails.morningMeal[index] = {
    //                 ...galleryDetails.morningMeal[index],
    //                 title: req.body.title,
    //                 uploadedAt: new Date(),
    //                 uploadedBy:userData.userName
    //             };
    //             if (filePath && filePath.status === true) {
    //                 galleryDetails.morningMeal[index] = {
    //                     ...galleryDetails.morningMeal[index],
    //                     imagePath: fpath,
    //                     imgId: docId
    //                 }
    //             }
    //         }
    //         if (index == -1) {
    //             index = galleryDetails.afternoonMeal?.findIndex(item => item.imgId === req.body.imgId)
    //         }
    //         if (index !== -1 && index !== undefined) {
    //             galleryDetails.afternoonMeal[index] = {
    //                 ...galleryDetails.afternoonMeal[index],
    //                 title: req.body.title,
    //                 uploadedAt: new Date(),
    //                 uploadedBy:userData.userName
    //             };
    //             if (filePath && filePath.status === true) {
    //                 galleryDetails.afternoonMeal[index] = {
    //                     ...galleryDetails.afternoonMeal[index],
    //                     imagePath: fpath,
    //                     imgId: docId
    //                 }
    //             }
    //         }
    //         if (index == -1) {
    //             index = galleryDetails.eveningMeal?.findIndex(item => item.imgId === req.body.imgId)
    //         }
    //         if (index !== -1 && index !== undefined) {
    //             galleryDetails.eveningMeal[index] = {
    //                 ...galleryDetails.eveningMeal[index],
    //                 title: req.body.title,
    //                 uploadedAt: new Date(),
    //                 uploadedBy:userData.userName
    //             };
    //             if (filePath && filePath.status === true) {
    //                 galleryDetails.eveningMeal[index] = {
    //                     ...galleryDetails.eveningMeal[index],
    //                     imagePath: fpath,
    //                     imgId: docId
    //                 }
    //             }
    //         }

    //         if (index == -1) {
    //             return res.status(404).json({
    //                 success: false,
    //                 message: "Not Found",
    //             });

    //         }
    //         await galleryDetails.save()
    //         return res.status(201).json({
    //             success: true, message: "Data Updated Successfully"
    //         })
    //     } catch (error) {
    //         return res.status(500).json({
    //             success: false,
    //             message: error instanceof Error ? error.message : "An unknown error occurred",
    //         });
    //     }
    // }
    static async updateGalleryImage(req: Request, res: Response) {
        try {
            const { id } = req.params;
            const { imgId, title } = req.body;
    
            // Upload new file if provided
            const filePath = await CommonController.uploadDocument(req, res);
            const updatedImage = filePath?.status
                ? { imagePath: filePath.fpath, imgId: filePath.docId }
                : {};
    
            // Find the gallery entry
            const galleryDetails = await Gallery.findOne({ where: { id } });
            if (!galleryDetails) {
                return res.status(404).json({ success: false, message: "Gallery not found" });
            }
    
            // Meals to check
            const mealTypes = ["morningMeal", "afternoonMeal", "eveningMeal"];
            let isUpdated = false;
    
            for (const mealType of mealTypes) {
                if (galleryDetails[mealType]) {
                    const index = galleryDetails[mealType].findIndex(item => item.imgId === imgId);
                    if (index !== -1) {
                        galleryDetails[mealType][index] = {
                            ...galleryDetails[mealType][index],
                            title,
                            uploadedAt: new Date(),
                            uploadedBy: userData.userName,
                            ...updatedImage, // Merge updated image if provided
                        };
                        isUpdated = true;
                        break; // Exit loop after updating
                    }
                }
            }
    
            if (!isUpdated) {
                return res.status(404).json({ success: false, message: "Image not found in any meal category" });
            }
    
            await galleryDetails.save();
            return res.status(200).json({ success: true, message: "Data Updated Successfully" });
        } catch (error) {
            return res.status(500).json({
                success: false,
                message: error instanceof Error ? error.message : "An unknown error occurred",
            });
        }
    }
    
}

