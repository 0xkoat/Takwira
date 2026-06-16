import multer from "multer";
import fs from "fs";
import path from "path";

const uploadDir = path.resolve(__dirname, '../../uploads/stadiums');

fs.mkdirSync(uploadDir, { recursive: true });

const stadiumImagesStorage = multer.diskStorage({
    destination: (_req, _file, cb) => {
        cb(null, uploadDir);
    },
    filename: (_req, file, cb) => {
        const ext = path.extname(file.originalname) || '';
        const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
        cb(null, `${file.fieldname}-${uniqueSuffix}${ext}`);
    },
});

const fileFilter = (_req: Express.Request, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
    if (file.mimetype.startsWith('image/')) {
        cb(null, true);
    } else {
        cb(new Error('Only image files are allowed'));
    }
};

export const uploadStadiumImages = multer({
    storage: stadiumImagesStorage,
    fileFilter,
    limits: {
        fileSize: 5 * 1024 * 1024, 
        files: 10, 
    },
});

export const getLocalStadiumImagePath = (imageUrl: string) => {
    const filename = path.basename(imageUrl);
    return path.resolve(uploadDir, filename);
};

export const deleteLocalStadiumImage = async (imageUrl?: string | null) => {
    if (!imageUrl || !imageUrl.startsWith('/uploads/stadiums/')) {
        return;
    }

    const filePath = getLocalStadiumImagePath(imageUrl);
    try {
        await fs.promises.unlink(filePath);
    } catch (error) {
        
    }
};
