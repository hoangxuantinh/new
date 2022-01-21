import fs from 'fs';
import appRoot from 'app-root-path';

const handleDeleteFile = (fileSaveInServer) => {
    fs.unlinkSync(`${appRoot}/public/images/${fileSaveInServer}`);
};

export default handleDeleteFile;
