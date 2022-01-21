/* eslint-disable react/prop-types */

import React from 'react';
import { Route, Switch } from 'react-router-dom';
import './App.css';
import NotFound from './components/NotFound/index.jsx';
import { PATH } from './constants/Path';
import Login from './features/auth/login';
import Register from './features/auth/register';
import ManageUser from './features/calendar';
import ManageClass from './features/files';
import Registers from './features/remind';
import AdminLayout from './layouts/admin';
import HomeAdmin from './pages/contentAdmin/home';
import HomePage from './pages/homePage';
import AddUser from './pages/admin/user/addUser';
import EditUser from './pages/admin/user/editUser';
import ManageTimes from './pages/admin/times';
import AddClass from './pages/admin/classes/addClass';
import EditClass from './pages/admin/classes/editClass';
import ForBiden from './components/Forbiden';
import RegsiterConfirm from './pages/admin/register/RegisterConfirm';
import Profile from './pages/homePage/profile';
import RegisterCoure from './pages/homePage/registerCoure';
import DetailCourseOfUser from './pages/homePage/detailCourse';
import UserByClass from './pages/admin/user/userByClass';
import AdminInfor from './pages/admin/inforAdmin';

function App() {

    return (
        <Switch>
            <Route exact path={PATH.HOME} component={HomePage} />
            <Route path={PATH.LOGIN} component={Login} />
            <Route exact path={PATH.REGISTER} component={Register} />
            <Route exact path={PATH.PROFILE} component={Profile} />
            <Route exact path={PATH.REGISTER_COURSE} component={RegisterCoure} />
            <Route exact path={PATH.DETAIL_COURSE} component={DetailCourseOfUser} />

            {/* admin */}
            <Route exact path={PATH.REGISTER_CONFIRM} component={RegsiterConfirm} />
            <LayoutStructer exact path={PATH.SYSTEM} layout={AdminLayout} component={HomeAdmin} />
            <LayoutStructer exact path={PATH.ADMIN_INFOR} layout={AdminLayout} component={AdminInfor} />

            <LayoutStructer exact path={PATH.CALENDAR} layout={AdminLayout} component={ManageUser} />
            <LayoutStructer path={PATH.ADD_USER} layout={AdminLayout} component={AddUser} />
            <LayoutStructer path={PATH.EDIT_USER} layout={AdminLayout} component={EditUser} />

            <LayoutStructer  path={PATH.MANAGE_TIME} layout={AdminLayout} component={ManageTimes} />
            {/* CLASS */}
            <LayoutStructer path={PATH.FILE} layout={AdminLayout} component={ManageClass} />
            <LayoutStructer path={PATH.USER_BY_CLASS} layout={AdminLayout} component={UserByClass} />
            <LayoutStructer path={PATH.ADD_CLASS} layout={AdminLayout} component={AddClass} />
            <LayoutStructer path={PATH.EDIT_CLASS} layout={AdminLayout} component={EditClass} />

            {/* Register */}
            <LayoutStructer path={PATH.REMIND} layout={AdminLayout} component={Registers} />
            <Route component={ForBiden} path={PATH.FORBIDEN} />
            <Route component={NotFound} path={PATH.NOT_FOUND} />
        </Switch>
    );
}

function LayoutStructer({ component: Component, layout: Layout, ...rest }) {
    return (
        <Route
            {...rest}
            render={(props) => (
                <Layout {...props}>
                    <Component {...props} />
                </Layout>
            )}
        />
    );
}

export default App;
