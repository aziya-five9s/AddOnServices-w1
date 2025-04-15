import { Request, Response } from "express"
import { AppDataSource } from "../data-source"
import { AnyObject } from "../types/common"
import { CommonController } from "./common.controller"
import { Gallery } from "../entity/GallerySection.entity"
import { TenantInfo } from "../entity/TenantInfo.entity"

const userData = { tenantId: "tenant-001", userId: "user-001", userName: "John Doe", userEmail: "johndoe@email.com" }
export class GalleryController {


    static async postGalleryData(req: Request, res: Response) {
        try {
            // Upload images
            const filePath = await CommonController.uploadDocuments(req, res);
            if (!filePath || filePath.status === false) {
                return res.status(400).json({ success: false, message: "No file uploaded!" });
            }

            const { tenantId, meals, title, } = req.body;
            const tenantinfo = await TenantInfo.findOne({ where: { tenantId } })

            if (!tenantinfo) {
                return res.status(404).json({
                    success: false, message: "Tenant Not Found"
                })
            }
            
            const repo = new Gallery()
            // Format uploaded images
            const uploadedImages = filePath.files.map((file, index) => ({
                title: title[index],
                imagePath: file.fpath,
                imgId: file.docId,
                uploadedAt: new Date(),
                uploadedBy: userData.userName
            }));

            repo.tenantId = tenantId
            repo.morningMeal = uploadedImages
            await repo.save();
            return res.status(200).json({ success: true, message: "Gallery added successfully" });
        }
        catch (error) {
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

    //original
    // static async updateGalleryData(req: Request, res: Response) {
    //     try {
    //         const { id } = req.params;

    //         const repo = AppDataSource.getRepository(Gallery);
    //         const existingGalleryDetails = await repo.findOne({ where: { id } });


    //         if (!existingGalleryDetails) {
    //             return res.status(404).json({
    //                 success: false,
    //                 message: "Gallery data not found",
    //             });
    //         }
    //         // Upload new images
    //         const fileUploadResult = await CommonController.uploadDocuments(req, res);

    //         const { titles, morningMeal, afternoonMeal, eveningMeal } = req.body;

    //         const title = req.body?.title ? JSON.parse(req.body.title) : []

    //         let uploadedImages
    //         if (fileUploadResult.status) {
    //             uploadedImages = fileUploadResult.files.map((file, index) => ({
    //                 // title: req.body.title[index],
    //                 title: req.body.title,
    //                 imagePath: file.fpath,
    //                 imgId: file.docId,
    //                 uploadedAt: new Date(),
    //                 uploadedBy: userData.userName
    //             }));
    //         }
    //         else {
    //             return res.status(400).json({
    //                 success: false,
    //                 message: fileUploadResult.message,
    //             });
    //         }

    //         if (req.body.morningMeal == true || req.body.morningMeal == "true") {
    //             // Ensure the images field exists
    //             if (!existingGalleryDetails.morningMeal) {
    //                 existingGalleryDetails.morningMeal = [];
    //             }
    //             //   Append new images to existing ones
    //             existingGalleryDetails.morningMeal = [...existingGalleryDetails.morningMeal, ...uploadedImages];

    //         }

    //         if (req.body.afternoonMeal == true || req.body.afternoonMeal == "true") {
    //             // Ensure the images field exists
    //             if (!existingGalleryDetails.afternoonMeal) {
    //                 existingGalleryDetails.afternoonMeal = [];
    //             }
    //             //   Append new images to existing ones
    //             existingGalleryDetails.afternoonMeal = [...existingGalleryDetails.afternoonMeal, ...uploadedImages];

    //         }
    //         if (req.body.eveningMeal == true || req.body.eveningMeal == "true") {
    //             // Ensure the images field exists
    //             if (!existingGalleryDetails.eveningMeal) {
    //                 existingGalleryDetails.eveningMeal = [];
    //             }
    //             //   Append new images to existing ones
    //             existingGalleryDetails.eveningMeal = [...existingGalleryDetails.eveningMeal, ...uploadedImages];

    //         }

    //         // Save the updated record
    //         await existingGalleryDetails.save();

    //         return res.status(200).json({
    //             success: true,
    //             message: "Gallery data updated successfully"
    //         });
    //     } catch (error) {
    //         return res.status(500).json({
    //             success: false,
    //             message: error instanceof Error ? error.message : "An unknown error occurred",
    //         });
    //     }
    // }


    //new code
    // static async updateGalleryData(req: Request, res: Response) {
    //     try {
    //         const { id } = req.params;

    //         const repo = AppDataSource.getRepository(Gallery);
    //         const existingGalleryDetails = await repo.findOne({ where: { id } });

    //         // const { titles,morningMeal, afternoonMeal, eveningMeal } = req.body;

    //         // const title = req.body?.title ? JSON.parse(req.body.title) : []

    //         //code changed
    //         if (!existingGalleryDetails) {
    //             return res.status(404).json({
    //                 success: false,
    //                 message: "Gallery data not found",
    //             });
    //         }
    //         // Upload new images
    //         const fileUploadResult = await CommonController.uploadDocuments(req, res);
    //         const { morningMeal, afternoonMeal, eveningMeal, title: titleString } = req.body;
    //         const title = titleString ? JSON.parse(titleString) : [];


    //         let uploadedImages
    //         if (fileUploadResult.status) {
    //             uploadedImages = fileUploadResult.files.map((file, index) => ({
    //                 // title: req.body.title[index],
    //                 title: title,
    //                 imagePath: file.fpath,
    //                 imgId: file.docId,
    //                 uploadedAt: new Date(),
    //                 uploadedBy: userData.userName
    //             }));
    //         }
    //         else {
    //             return res.status(400).json({
    //                 success: false,
    //                 message: fileUploadResult.message,
    //             });
    //         }

    //         if (morningMeal == true || morningMeal == "true") {
    //             // Ensure the images field exists
    //             if (!existingGalleryDetails.morningMeal) {
    //                 existingGalleryDetails.morningMeal = [];
    //             }
    //             //   Append new images to existing ones
    //             existingGalleryDetails.morningMeal = [...existingGalleryDetails.morningMeal, ...uploadedImages];

    //         }

    //         if (afternoonMeal == true || afternoonMeal == "true") {
    //             // Ensure the images field exists
    //             if (!existingGalleryDetails.afternoonMeal) {
    //                 existingGalleryDetails.afternoonMeal = [];
    //             }
    //             //   Append new images to existing ones
    //             existingGalleryDetails.afternoonMeal = [...existingGalleryDetails.afternoonMeal, ...uploadedImages];

    //         }
    //         if (eveningMeal == true || eveningMeal == "true") {
    //             // Ensure the images field exists
    //             if (!existingGalleryDetails.eveningMeal) {
    //                 existingGalleryDetails.eveningMeal = [];
    //             }
    //             //   Append new images to existing ones
    //             existingGalleryDetails.eveningMeal = [...existingGalleryDetails.eveningMeal, ...uploadedImages];

    //         }

    //         // Save the updated record
    //         await existingGalleryDetails.save();

    //         return res.status(200).json({
    //             success: true,
    //             message: "Gallery data updated successfully"
    //         });
    //     } catch (error) {
    //         return res.status(500).json({
    //             success: false,
    //             message: error instanceof Error ? error.message : "An unknown error occurred",
    //         });
    //     }
    // }



    //working but issue for afternoon meal and evening meal imgid
    // static async updateGalleryData(req: Request, res: Response) {
    //     try {
    //         const { id } = req.params;
    
    //         const repo = AppDataSource.getRepository(Gallery);
    //         const existingGalleryDetails = await repo.findOne({ where: { id } });
    
    //         if (!existingGalleryDetails) {
    //             return res.status(404).json({
    //                 success: false,
    //                 message: "Gallery data not found",
    //             });
    //         }
    
    //         // Upload new file if provided
    //         let uploadedFileData = null;
    //         const fileUploadResult = await CommonController.uploadDocuments(req, res);
    //         const { morningMeal, afternoonMeal, eveningMeal, title: titleString, imgId } = req.body;
    //         const title = titleString ? JSON.parse(titleString) : [];
    
    //         if (!imgId) {
    //             return res.status(400).json({
    //                 success: false,
    //                 message: "imgId is required to update specific image data",
    //             });
    //         }
    
    //         if (fileUploadResult.status && fileUploadResult.files.length > 0) {
    //             const file = fileUploadResult.files[0];
    //             uploadedFileData = {
    //                 imagePath: file.fpath,
    //                 uploadedAt: new Date(),
    //                 uploadedBy: userData.userName
    //             };
    //         }
    
    //         // Function to update a specific image in the array
    //         const updateImageInArray = (imagesArray: any[] = []) => {
    //             return imagesArray.map((img) => {
    //                 if (img.imgId === imgId) {
    //                     return {
    //                         ...img,
    //                         ...(title.length > 0 && { title: title[0] }),
    //                         ...(uploadedFileData && uploadedFileData)
    //                     };
    //                 }
    //                 return img;
    //             });
    //         };
    
    //         // Update image in the correct meal array
    //         if (morningMeal === true || morningMeal === "true") {
    //             existingGalleryDetails.morningMeal = updateImageInArray(existingGalleryDetails.morningMeal);
    //         }
    
    //         if (afternoonMeal === true || afternoonMeal === "true") {
    //             existingGalleryDetails.afternoonMeal = updateImageInArray(existingGalleryDetails.afternoonMeal);
    //         }
    
    //         if (eveningMeal === true || eveningMeal === "true") {
    //             existingGalleryDetails.eveningMeal = updateImageInArray(existingGalleryDetails.eveningMeal);
    //         }
    
    //         // Save the updated gallery
    //         await existingGalleryDetails.save();
    
    //         return res.status(200).json({
    //             success: true,
    //             message: "Gallery image updated successfully",
    //         });
    
    //     } catch (error) {
    //         return res.status(500).json({
    //             success: false,
    //             message: error instanceof Error ? error.message : "An unknown error occurred",
    //         });
    //     }
    // }


    static async updateGalleryData(req: Request, res: Response) {
        try {
            const { id } = req.params;
    
            const repo = AppDataSource.getRepository(Gallery);
            const existingGalleryDetails = await repo.findOne({ where: { id } });
    
            if (!existingGalleryDetails) {
                return res.status(404).json({
                    success: false,
                    message: "Gallery data not found",
                });
            }
    
            const fileUploadResult = await CommonController.uploadDocuments(req, res);
            const { morningMeal, afternoonMeal, eveningMeal, title: titleString, imgId } = req.body;
            const title = titleString ? JSON.parse(titleString) : [];
    
            const userData = {
                userName: "admin" // Replace with actual user session if needed
            };
    
            let uploadedFileData = null;
    
            if (fileUploadResult.status && fileUploadResult.files.length > 0) {
                const file = fileUploadResult.files[0];
                uploadedFileData = {
                    imagePath: file.fpath,
                    uploadedAt: new Date(),
                    uploadedBy: userData.userName
                };
            }
    
            // New image object to insert or update
            const newImageObject = {
                imgId: imgId || Date.now().toString(), // Generate imgId if not provided
                ...(title.length > 0 && { title: title[0] }),
                ...(uploadedFileData && uploadedFileData)
            };
    
            // Function to update existing or add new image
            const updateOrInsertImage = (imagesArray: any[] = []) => {
                const arr = Array.isArray(imagesArray) ? [...imagesArray] : [];
    
                const index = imgId ? arr.findIndex(img => img.imgId === imgId) : -1;
    
                if (index !== -1) {
                    arr[index] = { ...arr[index], ...newImageObject };
                } else {
                    arr.push(newImageObject);
                }
    
                return arr;
            };
    
            // Ensure arrays are always initialized
            existingGalleryDetails.morningMeal = existingGalleryDetails.morningMeal || [];
            existingGalleryDetails.afternoonMeal = existingGalleryDetails.afternoonMeal || [];
            existingGalleryDetails.eveningMeal = existingGalleryDetails.eveningMeal || [];
    
            // Apply updates
            if (morningMeal === true || morningMeal === "true") {
                existingGalleryDetails.morningMeal = updateOrInsertImage(existingGalleryDetails.morningMeal);
            }
    
            if (afternoonMeal === true || afternoonMeal === "true") {
                existingGalleryDetails.afternoonMeal = updateOrInsertImage(existingGalleryDetails.afternoonMeal);
            }
    
            if (eveningMeal === true || eveningMeal === "true") {
                existingGalleryDetails.eveningMeal = updateOrInsertImage(existingGalleryDetails.eveningMeal);
            }
    
            await repo.save(existingGalleryDetails);
    
            return res.status(200).json({
                success: true,
                message: "Gallery image updated successfully",
            });
    
        } catch (error) {
            return res.status(500).json({
                success: false,
                message: error instanceof Error ? error.message : "An unknown error occurred",
            });
        }
    }
    
    
    
 
    


    
    
    
    

    static async updateGalleryImage(req: Request, res: Response) {
        try {
            const { id } = req.params;

            // Upload new file if provided
            const filePath = await CommonController.uploadDocument(req, res);
            const updatedImage = filePath?.status
                ? { imagePath: filePath.fpath, imgId: filePath.docId }
                : {};

            const { imgId, title } = req.body;
            // const title = req.body.title;
            // const imgId = req.body.imgId;
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
                            title: title,
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

