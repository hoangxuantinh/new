import appRoot from 'app-root-path';
import FormData from 'form-data';
import fs from 'fs';
import db from '../../models/index';

export const initDataUser = () => {
    const initData = {
        fullname: 'xuan tinh',
        email: 'hxt28499@gmail.com',
        password: '123456tT',
        retypePassword: '123456tT',
        gender: 'male',
        phone: '0327403079',
        address: 'nghe an',
        role: 'user'
    };
    const formData = new FormData();
    formData.append('user', JSON.stringify(initData));
    formData.append('avatar', fs.createReadStream(`${appRoot}/src/tests/avatar/avatar-1639293591501-993198529.jpg`));
    return formData;
};

export const initDataUserInAdmin = () => {
    const initData = {
        fullname: 'xuan tinh',
        email: 'hxt284999@gmail.com',
        password: '123456tT',
        gender: 'male',
        phone: '0327403079',
        address: 'nghe an',
        role: 'user'
    };
    const formData = new FormData();
    formData.append('user', JSON.stringify(initData));
    formData.append('avatar', fs.createReadStream(`${appRoot}/src/tests/avatar/avatar-1639293591501-993198529.jpg`));
    return formData;
};

export const initDataAdmin = () => {
    const initData = {
        fullname: 'xuan tinh',
        email: 'hxt28499@gmail.com',
        password: '123456tT',
        retypePassword: '123456tT',
        gender: 'male',
        phone: '0327403079',
        address: 'nghe an',
        role: 'admin'
    };
    const formData = new FormData();
    formData.append('user', JSON.stringify(initData));
    formData.append('avatar', fs.createReadStream(`${appRoot}/src/tests/avatar/avatar-1639293591501-993198529.jpg`));
    return formData;
};

export const initDataInvalid = (initData = {}) => {
    const formData = new FormData();
    formData.append('user', JSON.stringify(initData));
    formData.append('avatar', fs.createReadStream(`${appRoot}/src/tests/avatar/avatar-1639293591501-993198529.jpg`));
    return formData;
};

export const initDataInvalidForChangeProfile = (initData = {}) => {
    const formData = new FormData();
    formData.append('inforUser', JSON.stringify(initData));
    formData.append('avatar', fs.createReadStream(`${appRoot}/src/tests/avatar/avatar-1639293591501-993198529.jpg`));
    return formData;
};

export const initDataForCreatClass = () => {
    const initData = {
        name: 'JavaScript Cơ Bản',
        description: 'Nắm vững kiến thức cơ bản Js',
        currentNumber: 0,
        maxNumber: 8,
        periods: [{ timeId: 1, dayId: 1 }]
    };
    const formData = new FormData();
    formData.append('newClass', JSON.stringify(initData));
    formData.append('avatar', fs.createReadStream(`${appRoot}/src/tests/avatar/avatar-1639293591501-993198529.jpg`));
    return formData;
};

export const initDataForEditClass = async () => {
    const { id } = await db.Class.findOne({
        where: {
            name: 'JavaScript Cơ Bản'
        }
    });
    const initData = {
        id,
        name: 'JavaScript Nâng Cao',
        description: 'Nắm vững kiến thức Nâng Cao Js',
        currentNumber: 0,
        maxNumber: 8,
        periods: [{ timeId: 1, dayId: 1 }]
    };
    const formData = new FormData();
    formData.append('classEdit', JSON.stringify(initData));
    return formData;
};

export const initDataInvalidForCreateClass = (initData = {}) => {
    const formData = new FormData();
    formData.append('newClass', JSON.stringify(initData));
    formData.append('avatar', fs.createReadStream(`${appRoot}/src/tests/avatar/avatar-1639293591501-993198529.jpg`));
    return formData;
};

export const initDataInvalidForEditClass = (initData = {}) => {
    const formData = new FormData();
    formData.append('classEdit', JSON.stringify(initData));
    return formData;
};
