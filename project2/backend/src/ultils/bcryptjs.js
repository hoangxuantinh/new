import bcrypt from 'bcryptjs';

const salt = bcrypt.genSaltSync(10);

export const hashPassword = (password) => {
    const stringHash = bcrypt.hashSync(password, salt);
    return stringHash;
};
