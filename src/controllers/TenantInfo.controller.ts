import { Request, Response } from "express"
import { AppDataSource } from "../data-source"
import { TenantInfo } from "../entity/TenantInfo.entity"
import { CommonController } from "./common.controller"
import { Raw } from "typeorm"

const userData = { tenantId: "tenant-001", userId: "user-001", userName: "John Doe", userEmail: "johndoe@email.com" }
export class TenantInfoController {


    //---------------------------------------Footer,Header Sections start--------------------------------------

  
    static async postTenantInfoData(req: Request, res: Response) {
        try {
            // const { address, contactUs, policies, followUsOn, changeoutlet, tenantName } = req.body
            const filePath = await CommonController.uploadDocument(req, res)
            if (!filePath || filePath.status === false) {
                return res.status(400).json({ success: false, message: "No file uploaded!" })
            }
            const { address, contactUs, policies, followUsOn, changeoutlet, tenantName,tenantId } = req.body

            const tenantInfo = await TenantInfo.findOne({
                // select: ["tenantId", "tenantName"], // Selecting required fields
                where: [
                    { tenantId: Raw((alias) => `${alias} = :tenantId`, { tenantId }) }, // Match tenantId exactly
                    { tenantName: Raw((alias) => `LOWER(${alias}) = LOWER(:tenantName)`, { tenantName }) } // Case-insensitive match for tenantName
                ]
            });
            
            if (tenantInfo) {
                return res.status(409).json({
                    success: false, message: "Tenant already exist"
                })
            }

            const TenantInfoData = new TenantInfo()
            TenantInfoData.address = address
            TenantInfoData.tenantId = tenantId
            TenantInfoData.tenantName = tenantName
            TenantInfoData.contactUs = contactUs
            TenantInfoData.policies = JSON.parse(policies)
            TenantInfoData.followUsOn = JSON.parse(followUsOn)
            TenantInfoData.logo = { docId: filePath.docId, docPath: filePath.fpath, uploadedAt: new Date(), uploadedBy: userData.userName }
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
            const { id } = req.params
            const repo = AppDataSource.getRepository(TenantInfo)
            // Fetch all TenantInfo data, applying filters from query parameters if provided
            const TenantInfoData = await repo.find({ where: { id, ...req.query } });
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
            const filePath = await CommonController.uploadDocument(req, res)
            const repo = AppDataSource.getRepository(TenantInfo);
            const { id } = req.params; // Extract the TenantInfo ID from request parameters
            const { address, contactUs, policies, followUsOn, changeoutlet, tenantName } = req.body
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

            if (req.body.address !== undefined) existingTenantInfo.address = req.body.address;
            if (req.body.contactUs !== undefined) existingTenantInfo.contactUs = req.body.contactUs;
            if (req.body.tenantName !== undefined) existingTenantInfo.tenantName = req.body.tenantName;
            if (req.body.policies !== undefined) existingTenantInfo.policies = JSON.parse(req.body.policies);
            if (req.body.followUsOn !== undefined) existingTenantInfo.followUsOn = JSON.parse(req.body.followUsOn);
            if (req.body.changeoutlet !== undefined) existingTenantInfo.changeoutlet = JSON.parse(req.body.changeoutlet);

            await existingTenantInfo.save()
            return res.status(200).json({
                success: true,
                message: "TenantInfo data updated successfully",
                // data: existingTenantInfo,
            });
        }
        catch (error) {
            return res.status(500).json({
                success: false,
                message: error instanceof Error ? error.message : "An unknown error occurred",
            });
        }
    }
    //---------------------------------------Footer,Header Sections End--------------------------------------

    //---------------------------------------Hero Section start--------------------------------------
    static async addHeroSectionData(req: Request, res: Response) {
        try {
            const tenantId = req.params.tenantId
            const filePath = await CommonController.uploadDocument(req, res)
            if (!filePath || filePath.status === false) {
                return res.status(400).json({ success: false, message: "No file uploaded!" })
            }

            const ChefDetails = await TenantInfo.findOne({ where: { tenantId: tenantId } })

            if(ChefDetails==undefined){
                return res.status(409).json({
                    success: false, message: "Tenant Not Found"
                })
            }
            ChefDetails.heroSection = [
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
        } catch (error) {
            return res.status(500).json({
                success: false,
                message: error instanceof Error ? error.message : "An unknown error occurred",
            });
        }
    }

    static async updateHeroSectionData(req: Request, res: Response) {
        try {
            const { id } = req.params
            const { title, subTitle, imgId, tenantId } = req.body
            const filePath = await CommonController.uploadDocument(req, res)
            let fpath, docId
            if (filePath && filePath.status === true) {
                fpath = filePath.fpath
                docId = filePath.docId
            }
            const ChefDetails = await TenantInfo.findOne({ where: { id } })
            const index = ChefDetails.heroSection?.findIndex(item => item.imgId === req.body.imgId);
            // If found, update the existing entry
            if (index !== -1 && index !== undefined) {
                ChefDetails.heroSection[index] = {
                    ...ChefDetails.heroSection[index],
                    title: req.body.title,
                    subTitle: req.body.subTitle,
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
        } catch (error) {
            return res.status(500).json({
                success: false,
                message: error instanceof Error ? error.message : "An unknown error occurred",
            });
        }
    }

    static async deleteHeroSectionData(req: Request, res: Response) {
        try {
            const { imgid, id } = req.params
            const ChefDetails = await TenantInfo.findOne({ where: { id } })
            // Filter out the image object by imgId
            ChefDetails.heroSection = ChefDetails.heroSection?.filter(item => item.imgId !== imgid) || [];

            // Save back to the database
            await ChefDetails.save();
            return res.status(201).json({
                success: true, message: "Data Deleted Successfully"
            })
        } catch (error) {
            return res.status(500).json({
                success: false,
                message: error instanceof Error ? error.message : "An unknown error occurred",
            });
        }
    }

    static async getHeroSectionData(req: Request, res: Response) {
        try {
            // const { tenantId, id} = req.params
            const { tenantId, id ,imgId} = req.params
            const ChefDetails = await TenantInfo.findOne({ where: { tenantId: tenantId } })

            if (id) {
                const heroSection = ChefDetails?.heroSection.find((el) => el.imgId === id)
                // const heroSection = ChefDetails?.heroSection.find((el) => el.imgId === imgId)
                return res.status(200).json({
                    success: true, data: heroSection ? heroSection : {}
                })
            }

            const heroSection = ChefDetails?.heroSection
            return res.status(200).json({
                success: true, data: heroSection ? heroSection : {}
            })
        } catch (error) {
            return res.status(500).json({
                success: false,
                message: error instanceof Error ? error.message : "An unknown error occurred",
            });
        }
    }
    //---------------------------------------Hero Section End----------------------------------------


    //---------------------------------------About Section Start----------------------------------------


    static async addUpdateAboutSectionData(req: Request, res: Response) {
        try {

            const { id } = req.params
            const filePath = await CommonController.uploadDocument(req, res)
            if (!filePath || filePath.status === false) {
                return res.status(400).json({ success: false, message: "No file uploaded!" })
            }

            const AboutSectionDetails = await TenantInfo.findOne({ where: { id, tenantId: req.body.tenantId } })
           
            if(AboutSectionDetails==undefined){
                return res.status(409).json({
                    success: false, message: "Tenant Not Found"
                })
            }
         
            AboutSectionDetails.aboutSection =
            {
                title:req.body.title,
                description: req.body.description,
                imagePath: filePath.fpath,
                imgId: filePath.docId,
                uploadedBy: userData.userName,
                uploadedAt: new Date()
            },
                await AboutSectionDetails.save()
            return res.status(200).json({
                success: true, message: "Data Saved Successfully"
            })
        } catch (error) {
            return res.status(500).json({
                success: false,
                message: error instanceof Error ? error.message : "An unknown error occurred",
            });
        }
    }

    static async deleteAboutSectionData(req: Request, res: Response) {
        try {
            const { id } = req.params
            const TenantInfoDetails = await TenantInfo.findOne({ where: { id } })
            TenantInfoDetails.aboutSection = null;

            await TenantInfoDetails.save();
            return res.status(201).json({
                success: true, message: "Data Deleted Successfully"
            })
        } catch (error) {
            return res.status(500).json({
                success: false,
                message: error instanceof Error ? error.message : "An unknown error occurred",
            });
        }
    }

    static async getAboutSectionData(req: Request, res: Response) {
        try {
            const id = req.params.id;

            // Find the tenant information by tenantId
            const tenantInfo = await TenantInfo.findOne({ where: { id } });

            if (!tenantInfo) {
                return res.status(404).json({ success: false, message: "Tenant not found!" });
            }

            // Extract the aboutSection field
            return res.status(200).json({
                success: true,
                message: "About section retrieved successfully",
                aboutSection: tenantInfo.aboutSection || {},
            });
        } catch (error) {
            return res.status(500).json({
                success: false,
                message: error instanceof Error ? error.message : "An unknown error occurred",
            });
        }
    }





    //---------------------------------------About Section End----------------------------------------
}