import multer from "multer";
import path from "path";
import fs from "fs";


// Create upload directory if doesn't exist (optional)
const uploadPath = "uploads/tasks";
if(!fs.existsSync(uploadPath)){
    fs.mkdirSync(uploadPath, { recursive: true})
}


//set up multer disk storage engine
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadPath);
    },
    filename: (req, file, cb) => {
        const safeName = file.originalname.replace(/\s+/g, "_"); // replace spaces with underscores
        cb(null, Date.now() + "-" + safeName);
    }
})


const upload = multer({
    storage,
    limits:{
        fileSize: 10 * 1024 * 1024 // limit file size to 10MB
    }
})

export default upload;

