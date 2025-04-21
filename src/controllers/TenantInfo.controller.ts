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
            const filePath = await CommonController.uploadDocument(req, res)
            if (!filePath || filePath.status === false) {
                return res.status(400).json({ success: false, message: "No file uploaded!" })
            }
            const { address, contactUs, policies, followUsOn, tenantName, tenantId } = req.body


            //not working
            const tenantInfo = await TenantInfo.findOne({
                // select: ["tenantId", "tenantName"], // Selecting required fields
                where: [
                    // { tenantId: Raw((alias) => `${alias} = :tenantId`, { tenantId }) }, // Match tenantId exactly
                    { tenantName: Raw((alias) => `LOWER(${alias}) = LOWER(:tenantName)`, { tenantName }) } // Case-insensitive match for tenantName
                ]
            });


            //aziya 
            // const tenantInfo1 = await TenantInfo.findOne({
            //     // select: ["tenantId", "tenantName"], // Selecting required fields
            //     where:{tenantId:tenantId}
            // });
            //aziya check it
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

            // Check if data exists
            if (!TenantInfoData.length) {
                return res.status(404).json({
                    success: false,
                    message: "Invalid tenant ID"
                });
            }
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
            // if (address !== undefined && address !== null && address !=="") {
            //     existingTenantInfo.address = address;
            // }

            if (address !== undefined) existingTenantInfo.address = address;
            if (contactUs !== undefined) existingTenantInfo.contactUs = contactUs;
            if (tenantName !== undefined) existingTenantInfo.tenantName = tenantName;
            if (policies !== undefined) existingTenantInfo.policies = JSON.parse(policies);
            if (followUsOn !== undefined) existingTenantInfo.followUsOn = JSON.parse(followUsOn);
            if (changeoutlet !== undefined) existingTenantInfo.changeoutlet = JSON.parse(changeoutlet);

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
            const { title, subTitle } = req.body
            const ChefDetails = await TenantInfo.findOne({ where: { tenantId: tenantId } })

            if (ChefDetails == undefined) {
                return res.status(409).json({
                    success: false, message: "Tenant Not Found"
                })
            }
            ChefDetails.heroSection = [
                ...(ChefDetails.heroSection || []),
                {
                    title: title,
                    subTitle: subTitle,
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

    //doubt self code
    static async updateHeroSectionData(req: Request, res: Response) {
        try {
            const { id } = req.params
            const filePath = await CommonController.uploadDocument(req, res)
            let fpath, docId
            if (filePath && filePath.status === true) {
                fpath = filePath.fpath
                docId = filePath.docId
            }
            const { title, subTitle, imgId } = req.body
            const ChefDetails = await TenantInfo.findOne({ where: { id } })
            const index = ChefDetails.heroSection?.findIndex(item => item.imgId === imgId);
            if (index !== -1 && index !== undefined) {
                ChefDetails.heroSection[index] = {
                    ...ChefDetails.heroSection[index],

                    title: title !== undefined && title !== "" ? title : ChefDetails.heroSection[index].title,
                    subTitle: subTitle !== undefined && subTitle !== "" ? subTitle : ChefDetails.heroSection[index].subTitle,

                    // title: title,
                    // subTitle: subTitle,
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

    // static async deleteHeroSectionDataorg(req: Request, res: Response) {
    //     try {
    //         const { imgid, id } = req.params
    //         const ChefDetails = await TenantInfo.findOne({ where: { id } })
    //         // Filter out the image object by imgId
    //         ChefDetails.heroSection = ChefDetails.heroSection?.filter(item => item.imgId !== imgid) || [];

    //         // Save back to the database
    //         await ChefDetails.save();
    //         return res.status(201).json({
    //             success: true, message: "Data Deleted Successfully"
    //         })
    //     } catch (error) {
    //         return res.status(500).json({
    //             success: false,
    //             message: error instanceof Error ? error.message : "An unknown error occurred",
    //         });
    //     }
    // }

    static async deleteHeroSectionData(req: Request, res: Response) {
        try {
            const { imgid, id } = req.params;
            const ChefDetails = await TenantInfo.findOne({ where: { id } });

            if (!ChefDetails) {
                return res.status(404).json({
                    success: false,
                    message: "Tenant not found",
                });
            }

            // Check if the imgId exists in heroSection
            const originalLength = ChefDetails.heroSection?.length || 0;
            const filteredHeroSection = ChefDetails.heroSection?.filter(item => item.imgId !== imgid) || [];

            if (filteredHeroSection.length === originalLength) {
                return res.status(404).json({
                    success: false,
                    message: "Image ID not found in heroSection",
                });
            }

            // Save the updated array
            ChefDetails.heroSection = filteredHeroSection;
            await ChefDetails.save();

            return res.status(201).json({
                success: true,
                message: "Data Deleted Successfully"
            });

        } catch (error) {
            return res.status(500).json({
                success: false,
                message: error instanceof Error ? error.message : "An unknown error occurred",
            });
        }
    }



    //original code
    // static async getHeroSectionData(req: Request, res: Response) {
    //     try {
    //         // const { tenantId, id} = req.params
    //         const { tenantId, id, imgId } = req.params
    //         const ChefDetails = await TenantInfo.findOne({ where: { tenantId: tenantId } })
    //         if (id) {
    //             const heroSection = ChefDetails?.heroSection.find((el) => el.imgId === id)
    //             // const heroSection = ChefDetails?.heroSection.find((el) => el.imgId === imgId)
    //             return res.status(200).json({
    //                 success: true, data: heroSection ? heroSection : {}
    //             })
    //         }

    //         const heroSection = ChefDetails?.heroSection
    //         return res.status(200).json({
    //             success: true, data: heroSection ? heroSection : {}
    //         })
    //     } catch (error) {
    //         return res.status(500).json({
    //             success: false,
    //             message: error instanceof Error ? error.message : "An unknown error occurred",
    //         });
    //     }
    // }

    static async getHeroSectionData(req: Request, res: Response) {
        try {
            // const { tenantId, id} = req.params
            const { tenantId, id, imgId } = req.params
            const ChefDetails = await TenantInfo.findOne({ where: { tenantId: tenantId } })
            if (ChefDetails) {
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
            }
            else {
                return res.status(500).json({
                    success: false,
                    message: "Tenant doesnot Exist"
                })
            }
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
            const { tenantId, title, description } = req.body
            const AboutSectionDetails = await TenantInfo.findOne({ where: { id, tenantId: tenantId } })
            if (AboutSectionDetails == undefined) {
                return res.status(409).json({
                    success: false, message: "Tenant Not Found"
                })
            }
            AboutSectionDetails.aboutSection =
            {
                title: title,
                description: description,
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