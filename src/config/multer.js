import multer from 'multer';
import path from 'path';
import fs from 'fs';
import crypto from 'crypto';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const baseUploadDir = path.join(__dirname, '..', 'uploads');

const fileFilter = (req, file, cb) => {
    const allowedMimeTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];

    if (allowedMimeTypes.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(new Error('Invalid file type. Only JPEG, PNG, GIF, and WEBP are allowed.'), false);
    }
};

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        const userId = req.user?.id || req.body.userId;

        if (!userId) {
            return cb(new Error('User ID is required to determine upload directory.'));
        }

        const userUploadDir = path.join(baseUploadDir, String(userId));

        if (!fs.existsSync(userUploadDir)) {
            fs.mkdirSync(userUploadDir, { recursive: true });
        }

        cb(null, userUploadDir);
    },
    filename: (req, file, cb) => {
        const ext = path.extname(file.originalname);

        const hash = crypto.createHash('sha256')
            .update(`${file.originalname}-${Date.now()}-${req.params.id}`)
            .digest('hex');

        // const uniqueName = `${file.fieldname}-${Date.now()}-${Math.round(Math.random() * 1e9)}${ext}`;

        cb(null, `${hash}${ext}`);
    }
});

export const upload = multer({
    storage,
    fileFilter,
    limits: {
        fileSize: 5 * 1024 * 1024 // 5 MB
    }
});








// Amazon S3
// Solo como guía para el futuro
// npm install aws-sdk multer-s3

// import multer from 'multer';
// import multerS3 from 'multer-s3';
// import aws from 'aws-sdk';

// aws.config.update({
//   accessKeyId: process.env.AWS_ACCESS_KEY,
//   secretAccessKey: process.env.AWS_SECRET_KEY,
//   region: process.env.AWS_REGION
// });

// const s3 = new aws.S3();

// const upload = multer({
//   storage: multerS3({
//     s3: s3,
//     bucket: 'nombre-de-tu-bucket',
//     acl: 'public-read',
//     key: function (req, file, cb) {
//       const ext = file.originalname.split('.').pop();
//       const filename = `avatars/${Date.now()}-${Math.round(Math.random() * 1E9)}.${ext}`;
//       cb(null, filename);
//     }
//   }),
//   fileFilter,
//   limits: { fileSize: 5 * 1024 * 1024 }
// });
