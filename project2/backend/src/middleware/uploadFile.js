import multer from 'multer';
import appRoot from 'app-root-path';
import fs from 'fs-extra';

const storage = multer.diskStorage({
    destination(req, file, cb) {
        const path = `${appRoot}/public/images/`;
        fs.ensureDir(path, (err) => {
            if (err) return console.log(err);
        });
        cb(null, path);
    },
    filename(req, file, cb) {
        const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1E9)}`;
        const fileExtention = file.originalname.split('.')[1];
        cb(null, `${file.fieldname}-${uniqueSuffix}.${fileExtention}`);
    }
});

export const upload = multer({ storage });
