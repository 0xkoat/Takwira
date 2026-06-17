import multer from "multer";
import fs from "fs";
import path from "path";
import  { Request } from "express";


const uploadDir = path.resolve(__dirname, '../../uploads/profiles');

fs.mkdirSync(uploadDir, { recursive: true });

const ProfilePhotoUpload = multer.diskStorage({
    destination: (_req: Request, _file: Express.Multer.File, cb) => {
        cb(null, uploadDir);
    },
    filename: (_req: Request, file: Express.Multer.File, cb) => {
        const ext = path.extname(file.originalname) || '';
        const uniqueSuffix = `${Date.now() + '-' + Math.round(Math.random() * 1e9)}`;
        cb(null, `${Date.now()}-${file.fieldname}-${uniqueSuffix}${ext}`);
    },
});

const fileFilter = (_req: Request, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
    if (file.mimetype.startsWith('image/')) {
        cb(null, true);
    } else {
        cb(new Error('Only image files are allowed'));
    }
};

export const uploadProfilePhoto = multer({
    storage: ProfilePhotoUpload,
    fileFilter,
    limits: {
        fileSize: 1024 * 1024 * 5,
        files: 1,
    },
});



