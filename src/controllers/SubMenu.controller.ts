import { Request, Response } from "express"
import { AppDataSource } from "../data-source"
import { SubMenu } from "../entity/SubMenu.entity"
import { AnyObject } from "../types/common"
import { CommonController } from "./common.controller"
import { TenantInfo } from "../entity/TenantInfo.entity"
import { Raw } from "typeorm"

const userData = { tenantId: "tenant-001", userId: "user-001", userName: "John Doe", userEmail: "johndoe@email.com" }
export class SubMenuController {

    //------------------------------------------Our Authentic Flavours Section Start------------------------------------------
    // static async postSubMenuData1(req: Request, res: Response) {
    //     try {
    //         const filePath = await CommonController.uploadDocument(req, res)
    //         if (!filePath || filePath.status === false) {
    //             return res.status(400).json({ success: false, message: "No file uploaded!" })
    //         }
    //         const { heading, tenantId, title } = req.body
    //         const tenantinfo = await TenantInfo.findOne({ where: { tenantId } })
    //         if (!tenantinfo) {
    //             return res.status(404).json({
    //                 success: false, message: "Tenant Not Found"
    //             })
    //         }
    //         const submenuinfo = await SubMenu.findOne({ where: { tenantId } })
    //         const subMenuData = new SubMenu()
    //         subMenuData.heading = heading
    //         subMenuData.tenantId = tenantId
    //         // subMenuData.tenantId = tenantId
    //         if (subMenuData.subMenu == null) {
    //             subMenuData.subMenu = []
    //         }
    //         subMenuData.subMenu =
    //             [...subMenuData.subMenu, { title: title, imagePath: filePath.fpath, imgId: filePath.docId, updatedAt: new Date(), uploadedBy: userData.userName }]
    //         await subMenuData.save()
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

    static async postSubMenuData(req: Request, res: Response) {
        try {
            const filePath = await CommonController.uploadDocument(req, res);
            if (!filePath || filePath.status === false) {
                return res.status(400).json({ success: false, message: "No file uploaded!" });
            }

            const { heading, tenantId, title } = req.body;

            // Check if tenant exists
            const tenantInfo = await TenantInfo.findOne({ where: { tenantId } });

            if (!tenantInfo) {
                return res.status(404).json({
                    success: false,
                    message: "Tenant Not Found"
                });
            }

            // Check if submenu already exists for the tenant
            let subMenuInfo = await SubMenu.findOne({ where: { tenantId } });

            if (!subMenuInfo) {
                // If no submenu exists, create a new one
                subMenuInfo = new SubMenu();
                subMenuInfo.tenantId = tenantId;
                subMenuInfo.heading = heading;
                subMenuInfo.subMenu = []; // Initialize subMenu array
            }
            else {
                if (heading && heading.trim() !== "") {
                    subMenuInfo.heading = heading;
                }
            }
            if (filePath && filePath.status == true) {
                // Append new submenu entry
                subMenuInfo.subMenu.push({
                    title,
                    imagePath: filePath.fpath,
                    imgId: filePath.docId,
                    updatedAt: new Date(),
                    uploadedBy: userData.userName
                });
            }

            // Save the updated submenu
            await subMenuInfo.save();

            return res.status(200).json({
                success: true,
                message: subMenuInfo?.id ? "Submenu updated successfully" : "New submenu created successfully"
            });

        } catch (error) {
            return res.status(500).json({
                success: false,
                message: (error as Error).message
            });
        }
    }


    static async getSubMenuData(req: Request, res: Response) {
        try {
            const repo = AppDataSource.getRepository(SubMenu)
            // Fetch all basicDetails data, applying filters from query parameters if provided

            //relations----> means we get the overall data of tenant which was use for join
            //select=--> we use to show fields (i require few fields i take that in select)
            // const subMenuData = await repo.find({ where: { ...req.query}, relations:["tenant"], select:["heading", "subMenu"] });
            const subMenuData = await repo.find({ where: { ...req.query }, relations: ["tenant"] });
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

    //code self


    // static async deleteSubMenuData(req: Request, res: Response) {
    //     try {
    //         const id = req.params.id
    //         const imgId = req.params.imgId
    //         const item = await SubMenu.findOneBy({ id });
    //         if (!item) {
    //             return res.status(404).json({ message: "Item not found" });
    //         }
    //         await SubMenu.remove(item);
    //         return res.status(200).json({ success: true, message: `Item with id ${id} deleted successfully` });
    //     } catch (error) {
    //         return res.status(500).json({ success: false, message: "Error deleting item", error });
    //     }
    // }

// doubt new
    static async deleteSubMenuData(req: Request, res: Response) {
        try {
            const { id, imgId } = req.params;
            const item = await SubMenu.findOneBy({ id });
    
            if (!item) {
                return res.status(404).json({ success: false, message: "SubMenu item not found" });
            }
    
            const updatedSubMenu = item.subMenu.filter((el) => el.imgId !== imgId);
    
            if (updatedSubMenu.length === item.subMenu.length) {
                return res.status(404).json({ success: false, message: `Image with imgId ${imgId} not found` });
            }
    
            item.subMenu = updatedSubMenu;
            await item.save();
    
            return res.status(200).json({
                success: true,
                message: `Image with imgId ${imgId} deleted successfully`,
                data: item
            });
    
        } catch (error) {
            return res.status(500).json({
                success: false,
                message: "Error deleting image",
                error: error instanceof Error ? error.message : error
            });
        }
    }
    

   // code self
    // static async updateSubMenuData1(req: Request, res: Response) {
    //     try {
    //         const filePath = await CommonController.uploadDocument(req, res)
    //         const repo = AppDataSource.getRepository(SubMenu);
    //         const { heading, tenantId,title ,imgId} = req.body
    //         const { id } = req.params; // Extract the basicDetails ID from request parameters
    //         if (!id) {
    //             return res.status(404).json({
    //                 success: false,
    //                 message: "Id not found",
    //             });
    //         }
    //         const tenantinfo = await TenantInfo.findOne({ where: { tenantId } })
    //         // Check if the basicDetails record exists
    //         const existingSubMenuDetails = await repo.findOne({ where: { id } });

    //         if (!existingSubMenuDetails) {
    //             return res.status(404).json({
    //                 success: false,
    //                 message: "SubMenu data not found",
    //             });

    //         }
    //         const imageInfo = existingSubMenuDetails.subMenu.find((el)=>el.imgId==imgId)

    //         if (imageInfo && filePath && filePath.status == true) {
    //             existingSubMenuDetails.subMenu = [{ title: title, imagePath: filePath.fpath, imgId: filePath.docId, updatedAt: new Date(), uploadedBy: userData.userName }]
    //         }

    //         existingSubMenuDetails.heading = heading
    //         existingSubMenuDetails.tenant = tenantinfo

    //         await existingSubMenuDetails.save()
    //         return res.status(200).json({
    //             success: true,
    //             message: "SubMenu data updated successfully",
    //             data: existingSubMenuDetails,
    //         });
    //     }
    //     catch (error) {
    //         return res.status(500).json({
    //             success: false,
    //             message: error instanceof Error ? error.message : "An unknown error occurred",
    //         });
    //     }
    // }


 //doubt new
    static async updateSubMenuData(req: Request, res: Response) {
        try {
            const filePath = await CommonController.uploadDocument(req, res);
            const repo = AppDataSource.getRepository(SubMenu);
            const { heading, tenantId, title, imgId } = req.body;
            const { id } = req.params;
    
            if (!id) {
                return res.status(404).json({
                    success: false,
                    message: "Id not found",
                });
            }
    
            const tenantinfo = await TenantInfo.findOne({ where: { tenantId } });
            const existingSubMenuDetails = await repo.findOne({ where: { id } });
    
            if (!existingSubMenuDetails) {
                return res.status(404).json({
                    success: false,
                    message: "SubMenu data not found",
                });
            }
            const imageInfoIndex = existingSubMenuDetails.subMenu.findIndex((el) => el.imgId == imgId);
    
            if (imageInfoIndex !== -1) {
                existingSubMenuDetails.subMenu[imageInfoIndex] = {
                    ...existingSubMenuDetails.subMenu[imageInfoIndex],
                    title: title !== undefined && title !== "" ? title : existingSubMenuDetails.subMenu[imageInfoIndex].title,
                    updatedAt: new Date(),
                    uploadedBy: userData.userName
                };
    
                if (filePath && filePath.status == true) {
                    existingSubMenuDetails.subMenu[imageInfoIndex] = {
                        ...existingSubMenuDetails.subMenu[imageInfoIndex],
                        imagePath: filePath.fpath,
                        imgId: filePath.docId,
                    };
                }
            } else {
                existingSubMenuDetails.subMenu.push({
                    title: title,
                    imagePath: filePath?.fpath || null,
                    imgId: filePath?.docId || imgId,
                    updatedAt: new Date(),
                    uploadedBy:userData.userName,
                });
            }
            existingSubMenuDetails.heading = heading !== undefined && heading !== "" ? heading : existingSubMenuDetails.heading;
            existingSubMenuDetails.tenant = tenantinfo;
    
            await existingSubMenuDetails.save();
    
            return res.status(200).json({
                success: true,
                message: "SubMenu data updated successfully",
                data: existingSubMenuDetails,
            });
    
        } catch (error) {
            return res.status(500).json({
                success: false,
                message: error instanceof Error ? error.message : "An unknown error occurred",
            });
        }
    }
    
}