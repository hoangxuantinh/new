import userRouter from './user.router';
import classRouter from './class.router';
import registerRouter from './register.router';
import timeRouter from './time.router';
import authRouter from './auth.router';

const routeMain = (app) => {
    userRouter(app);
    classRouter(app);
    authRouter(app);
    registerRouter(app);
    timeRouter(app);
};
export default routeMain;
