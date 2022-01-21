import multer from 'multer';
import appRoot from 'app-root-path';

const storage = multer.diskStorage({
    destination(req, file, cb) {
        cb(null, `${appRoot}/public/images/`);
    },
    filename(req, file, cb) {
        const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1E9)}`;
        const fileExtention = file.originalname.split('.')[1];
        cb(null, `${file.fieldname}-${uniqueSuffix}.${fileExtention}`);
    }
});

export const upload = multer({ storage });
