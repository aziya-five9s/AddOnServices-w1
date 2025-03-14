import path from "path"
import multer from "multer"
import fs from "fs"
import { v4 as uuidv4 } from "uuid"
import util from "util"

export class CommonController {
    static async uploadDocument(req, res) {
        try {
            const UPLOAD_DIR = path.resolve(__dirname, "../../src/public/uploads");

            // Ensure the upload directory exists
            if (!fs.existsSync(UPLOAD_DIR)) {
                fs.mkdirSync(UPLOAD_DIR, { recursive: true });
            }

            const docId = uuidv4();

            // Configure Multer
            const storage = multer.diskStorage({
                destination: (req, file, cb) => cb(null, UPLOAD_DIR),
                filename: (req, file, cb) => {
                    const ext = path.extname(file.originalname);
                    cb(null, `${docId}${ext}`);
                },
            });

            const upload = multer({ storage }).single("file");

            // Promisify the multer upload function
            const uploadAsync = util.promisify(upload);

            // Execute the file upload
            await uploadAsync(req, res);

            // Check if file was uploaded
            if (!req.file) {
                return { status: false, message: "No file uploaded" };
            }

            const newFilePath = req.file.path;
            const relativeFilePath = path.relative(UPLOAD_DIR, newFilePath); // => /docid.png
            const normalizedRelativePath = `/uploads/${relativeFilePath.replace(/\\/g, "/")}`; // => /uploads/docid.png

            return { status: true, fpath: relativeFilePath, docId };
        } catch (error) {
            return {
                status: false,
                message: error.message || "Something went wrong while uploading the document",
            };
        }
    }

    // static async uploadDocument(req) {
    //     try {


    //         if (!req.file) {
    //             return { status: false, message: "No file uploaded" }
    //         }
    //         // const absoluteFilePath = req.file.path
    //         const publicBaseDir = path.resolve(__dirname, "../../src/public/uploads")

    //         const ext = path.extname(req.file.originalname)
    //         const newFileName = `${req.docId}${ext}`
    //         const newFilePath = path.join(publicBaseDir, newFileName)

    //         const relativeFilePath = path.relative(publicBaseDir, newFilePath)
    //         const normalizedRelativePath = `/${relativeFilePath.replace(/\\/g, "/")}`
    //         const fpath = normalizedRelativePath.replace("/../../../../", "")
    //         //to be changed later
    //         return { status: true, fpath }
    //     } catch (error) {
    //         return {
    //             status: false,
    //             message: error.message
    //                 ? error.message
    //                 : "Something went wrong while uploading document",
    //         }
    //     }
    // }
}