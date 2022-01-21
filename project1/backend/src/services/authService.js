import db from '../models/index';
import bcrypt from 'bcryptjs';
import { loginSchema, registerSchema } from '../validations/validate.schema';
import { Common } from '../utils/common';
const salt = bcrypt.genSaltSync(10);

const hashPassword = async (password) => {
  try {
    const stringHash = bcrypt.hashSync(password, salt);
    if (stringHash) return stringHash;
  } catch (error) {
    throw error;
  }
};

export const signUp = async (req) => {
  try {
    const dataFromClient = req.body || {};
    const dataThroughValidate = await registerSchema.validateAsync(dataFromClient);

    //check exist
    let isExist = await db.User.findOne({
      where: {
        fullName: dataThroughValidate.fullname,
      },
    });
    // not exist
    if (!isExist) {
      const passwordInServer = await hashPassword(dataThroughValidate.password);
      await db.User.create({
        fullName: dataThroughValidate.fullname,
        password: passwordInServer,
      });

      return Common.returnData(true, 'Create new user successfull');
    }

    return Common.returnData(
      false,
      `${dataThroughValidate.fullname} has already exist.Please enter other username`
    );
  } catch (error) {
    return Common.returnData(false, error);
  }
};

export const signIn = async (req) => {
  try {
    const dataFromClient = req.body || {};
    const dataThroughValidate = await loginSchema.validateAsync(dataFromClient);
    const user = await db.User.findOne({
      where: {
        fullName: dataThroughValidate.fullname,
      },
    });

    const userPlain = JSON.parse(JSON.stringify(user));
    delete userPlain.password;

    //  user not found
    if (!user) {
      return Common.returnData(false, 'User not found!');
    }

    //check time
    const limitTimeFail = 3; // limit times fails
    const timeout = 300; // after 300s reset block and count fail

    const preTimeLoggin = new Date(user.loginAt).getTime() / 1000;
    const checkTime = new Date().getTime() / 1000 - preTimeLoggin < timeout;

    if (!checkTime) {
      await user.update({ countFail: 0, isBlock: false });
    }

    // >3 time block
    if (user.countFail >= limitTimeFail) {
      return Common.returnData(false, 'User is blocked!');
    }

    // check match
    const isMatch = await bcrypt.compareSync(dataThroughValidate.password, user.password);
    if (isMatch) {
      return Common.returnData(true, 'Login Successfull', userPlain);
    }

    // case fail
    const countFail = parseInt(user.countFail) + 1;
    await user.update({ countFail: countFail, isBlock: countFail >= limitTimeFail, loginAt: new Date() });

    return Common.returnData(false, 'Wrong password/email!');
  } catch (error) {
    return Common.returnData(false, error);
  }
};
