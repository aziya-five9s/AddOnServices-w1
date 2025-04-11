import { Request, Response } from "express"
import { AppDataSource } from "../data-source"
import { CommonController } from "./common.controller"
import { TenantInfo } from "../entity/TenantInfo.entity"
import { ContactUs } from "../entity/ContactUs.entity"

const userData = { tenantId: "tenant-001", userId: "user-001", userName: "John Doe", userEmail: "johndoe@email.com" }
export class ContactUsController {

    // static async postContactUsData(req: Request, res: Response) {
    //     try {
    //         const filePath = await CommonController.uploadDocuments(req, res)
    //         if (!filePath || filePath.status === false) {
    //             return res.status(400).json({ success: false, message: "No file uploaded!" })
    //         }
    //         const { description, address, email, contact, tenantId } = req.body
    //         const tenantinfo = await TenantInfo.findOne({ where: { tenantId } })
    //         if (!tenantinfo) {
    //             return res.status(404).json({
    //                 success: false, message: "Tenant Not Found"
    //             })
    //         }
    //         const contactUsData = new ContactUs()
    //         contactUsData.description = description
    //         contactUsData.address = address
    //         contactUsData.email = email
    //         contactUsData.contact = JSON.parse(contact)
    //         contactUsData.tenantId = tenantId
    //         if (filePath.status) {
    //             const uploadedImages = filePath.files.map(file => ({
    //                 imagePath: file.fpath,
    //                 imgId: file.docId,
    //                 updatedAt: new Date(),
    //                 uploadedBy: userData.userName,
    //             }));

    //             // Check if total images exceed the limit (max 4)
    //             if (uploadedImages.length > 4) {
    //                 return res.status(400).json({
    //                     success: false,
    //                     message: "Number of uploaded images exceeds the maximum limit (4)",
    //                 });
    //             }
    //             // Append new images to existing ones
    //             contactUsData.images = [...uploadedImages];
    //         }
    //         else {
    //             return res.status(400).json({
    //                 success: false,
    //                 message: filePath.message,
    //             });
    //         }
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


    static async postContactUsData(req: Request, res: Response) {
        try {
            const filePath = await CommonController.uploadDocuments(req, res)
            if (!filePath || filePath.status === false) {
                return res.status(400).json({ success: false, message: "No file uploaded!" })
            }
            const { description, address, email, contact, tenantId } = req.body
            const tenantinfo = await TenantInfo.findOne({ where: { tenantId } })
            const contactinfo = await ContactUs.findOne({ where: { tenantId } })
            if (!tenantinfo) {
                return res.status(404).json({
                    success: false, message: "Tenant Not Found"
                })
            }
            if(contactinfo){
                return res.status(404).json({
                    success: false, message: "Contact already exists for this tenant"
                })
            }
            const contactUsData = new ContactUs()
            contactUsData.description = description
            contactUsData.address = address
            contactUsData.email = email
            contactUsData.contact = JSON.parse(contact)
            contactUsData.tenantId = tenantId
            if (filePath.status) {
                const uploadedImages = filePath.files.map(file => ({
                    imagePath: file.fpath,
                    imgId: file.docId,
                    updatedAt: new Date(),
                    uploadedBy: userData.userName,
                }));

                // Check if total images exceed the limit (max 4)
                if (uploadedImages.length > 4) {
                    return res.status(400).json({
                        success: false,
                        message: "Number of uploaded images exceeds the maximum limit (4)",
                    });
                }
                // Append new images to existing ones
                contactUsData.images = [...uploadedImages];
            }
            else {
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
    static async getContactUsData(req: Request, res: Response) {
        try {
            const { id } = req.params
            const repo = AppDataSource.getRepository(ContactUs)
            const contactUsData = await repo.find({ where: { id } });

            if (!contactUsData.length) {
                return res.status(404).json({
                    success: false,
                    message: "Invalid tenant ID"
                });
            }
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

    // code origi
    // static async updateContactUsData(req: Request, res: Response) {
    //     try {
    //         const { id } = req.params;

    //         const repo = AppDataSource.getRepository(ContactUs);
    //         const existingContactUsDetails = await repo.findOne({ where: { id } });
    //         const fileUploadResult = await CommonController.uploadDocuments(req, res);
    //         const { description, address, email, contact, tenantId } = req.body;

    //         if (!existingContactUsDetails) {
    //             return res.status(404).json({
    //                 success: false,
    //                 message: "ContactUs data not found",
    //             });
    //         }
    //         // Ensure the images field exists
    //         if (!existingContactUsDetails.images) {
    //             existingContactUsDetails.images = [];
    //         }
    //         //new
    //         if (fileUploadResult.status && existingContactUsDetails.images.length < 4) {
    //             const uploadedImages = fileUploadResult.files.map(file => ({
    //                 imagePath: file.fpath,
    //                 imgId: file.docId,
    //                 updatedAt: new Date(),
    //                 uploadedBy: userData.userName,
    //             }))
    //             // Append new images to existing ones
    //             existingContactUsDetails.images = [...existingContactUsDetails.images, ...uploadedImages];
    //         }

            
    //         // Check if total images exceed the limit (max 4)
    //         if (existingContactUsDetails.images.length > 4) {
    //             return res.status(400).json({
    //                 success: false,
    //                 message: "Number of uploaded images exceeds the maximum limit (4)",
    //             });
    //         }

    //         // Update other fields if provided
    //         if (description !== undefined) existingContactUsDetails.description = description;
    //         if (address !== undefined) existingContactUsDetails.address = address;
    //         if (email !== undefined) existingContactUsDetails.email = email;
    //         if (contact !== undefined) existingContactUsDetails.contact = JSON.parse(contact);

    //         // Save the updated record
    //         await existingContactUsDetails.save();

    //         return res.status(200).json({
    //             success: true,
    //             message: "ContactUs data updated successfully",
    //             data: existingContactUsDetails,
    //         });
    //     } catch (error) {
    //         return res.status(500).json({
    //             success: false,
    //             message: error instanceof Error ? error.message : "An unknown error occurred",
    //         });
    //     }
    // }


    static async updateContactUsData(req: Request, res: Response) {
        try {
            const { id } = req.params;
            const repo = AppDataSource.getRepository(ContactUs);
    
            // Fetch existing data
            const existingContactUsDetails = await repo.findOne({ where: { id } });
            if (!existingContactUsDetails) {
                return res.status(404).json({
                    success: false,
                    message: "ContactUs data not found",
                });
            }
    
            // Ensure images field exists
            if (!existingContactUsDetails.images) {
                existingContactUsDetails.images = [];
            }
    
            // Upload files
            const fileUploadResult = await CommonController.uploadDocuments(req, res);
            const { description, address, email, contact, tenantId } = req.body;
    
            if (fileUploadResult.status) {
                const newImages = fileUploadResult.files.map(file => ({
                    imagePath: file.fpath,
                    imgId: file.docId,
                    updatedAt: new Date(),
                    uploadedBy: userData?.userName || "Unknown", // Ensure userData exists
                }));
    
                // Validate total image count
                const totalImages = existingContactUsDetails.images.length + newImages.length;
                if (totalImages > 4) {
                    return res.status(400).json({
                        success: false,
                        message: `You can upload a maximum of 4 images. Current attempt exceeds the limit.`,
                    });
                }
    
                // Append new images
                existingContactUsDetails.images = [...existingContactUsDetails.images, ...newImages];
            }
    
            // Update other fields if provided
            if (description !== undefined) existingContactUsDetails.description = description;
            if (address !== undefined) existingContactUsDetails.address = address;
            if (email !== undefined) existingContactUsDetails.email = email;
            if (contact !== undefined) existingContactUsDetails.contact = JSON.parse(contact);
    
            // Save the updated record
            await repo.save(existingContactUsDetails);
    
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
    





    // static async updateContactUsData(req: Request, res: Response) {
    //     try {
    //         const { id } = req.params;
    //         const repo = AppDataSource.getRepository(ContactUs);
    //         const existingContactUsDetails = await repo.findOne({ where: { id } });

    //         if (!existingContactUsDetails) {
    //             return res.status(404).json({
    //                 success: false,
    //                 message: "ContactUs data not found",
    //             });
    //         }
    //         if (!existingContactUsDetails.images) {
    //             existingContactUsDetails.images = [];
    //         }

    //         let uploadedImages = [];
    //         const fileUploadResult = await CommonController.uploadDocuments(req, res);
    //         const { description, address, email, contact } = req.body;

    //         if (fileUploadResult.status && Array.isArray(fileUploadResult.files) && fileUploadResult.files.length > 0) {
    //             uploadedImages = fileUploadResult.files.map(file => ({
    //                 imagePath: file.fpath,
    //                 imgId: file.docId,
    //                 updatedAt: new Date(),
    //                 uploadedBy: userData.userName,
    //             }));

    //             if (existingContactUsDetails.images.length + uploadedImages.length > 4) {
    //                 return res.status(400).json({
    //                     success: false,
    //                     message: "Number of uploaded images exceeds the maximum limit (4)",
    //                 });
    //             }

    //             existingContactUsDetails.images = [...existingContactUsDetails.images, ...uploadedImages];
    //         } else if (!fileUploadResult.status && fileUploadResult.files && fileUploadResult.files.length > 0) {
    //             return res.status(400).json({
    //                 success: false,
    //                 message: fileUploadResult.message,
    //             });
    //         }

    //         existingContactUsDetails.description = description !== undefined ? description : existingContactUsDetails.description;
    //         existingContactUsDetails.address = address !== undefined ? address : existingContactUsDetails.address;
    //         existingContactUsDetails.email = email !== undefined ? email : existingContactUsDetails.email;
    //         existingContactUsDetails.contact = contact !== undefined ? JSON.parse(contact) : existingContactUsDetails.contact;

    //         await existingContactUsDetails.save();

    //         return res.status(200).json({
    //             success: true,
    //             message: "ContactUs data updated successfully",
    //             data: existingContactUsDetails,
    //         });
    //     } catch (error) {
    //         return res.status(500).json({
    //             success: false,
    //             message: error instanceof Error ? error.message : "An unknown error occurred",
    //         });
    //     }
    // }


    static async updateContactImage(req: Request, res: Response) {
        try {
            const { id } = req.params;
            const repo = AppDataSource.getRepository(ContactUs);
            const existingContactUsDetails = await repo.findOne({ where: { id } });

            if (!existingContactUsDetails) {
                return res.status(404).json({
                    success: false,
                    message: "ContactUs data not found",
                });
            }

            if (!existingContactUsDetails.images) {
                existingContactUsDetails.images = [];
            }

            let isUpdated = false;
            const fileUploadResult = await CommonController.uploadDocuments(req, res);
            const { imgId } = req.body;

            if (fileUploadResult.status && Array.isArray(fileUploadResult.files) && fileUploadResult.files.length > 0) {
                const updatedImage = {
                    imagePath: fileUploadResult.files[0].fpath,
                    imgId: fileUploadResult.files[0].docId,
                    updatedAt: new Date(),
                    uploadedBy: userData.userName,
                };

                const index = existingContactUsDetails.images.findIndex(img => img.imgId === imgId);
                if (index !== -1) {
                    existingContactUsDetails.images[index] = { ...existingContactUsDetails.images[index], ...updatedImage };
                    isUpdated = true;
                } else {
                    return res.status(404).json({
                        success: false,
                        message: "Image not found in ContactUs data",
                    });
                }
            } else if (!fileUploadResult.status && fileUploadResult.files && fileUploadResult.files.length > 0) {
                return res.status(400).json({
                    success: false,
                    message: fileUploadResult.message,
                });
            }

            if (!isUpdated) {
                return res.status(400).json({ success: false, message: "No image updated" });
            }

            await existingContactUsDetails.save();

            return res.status(200).json({
                success: true,
                message: "Image updated successfully",
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