import * as authService from '../services/authService';
import { Common } from '../utils/common';

export const register = async (req, res) => {
  const response = await authService.signUp(req);
  Common.responseForClient(res, response);
};

export const login = async (req, res) => {
  const response = await authService.signIn(req);
  Common.responseForClient(res, response);
};

export const HomePage = (req, res) => {
  return res.render('home.ejs');
};
