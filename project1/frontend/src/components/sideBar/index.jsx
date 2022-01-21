import AccessTimeIcon from '@mui/icons-material/AccessTime';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import CloudDownloadIcon from '@mui/icons-material/CloudDownload';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import NotificationsActiveIcon from '@mui/icons-material/NotificationsActive';
import { Typography } from '@mui/material';
import { makeStyles } from '@mui/styles';
import { Box } from '@mui/system';
import React from 'react';
import { useSelector,useDispatch } from 'react-redux';
import { userLogout } from '../../redux/slice/userSlice';
import { NavLink } from 'react-router-dom';
import { PATH } from '../../constants/Path';
import { useHistory } from 'react-router-dom';
const useStyles = makeStyles({
    root: {
        position: 'fixed',
        top: 0,
        bottom: 0,
        width: '16%',
        backgroundColor: '#333',
        paddingTop: '4px'
    },
    li: {
        padding: '8px 8px',
        width: '73%',
        backgroundColor: 'white',
        display: 'flex',
        margin: '12px auto',
        listStyle: 'none',
        textAlign: 'center',
        cursor: 'pointer',
        borderRadius: '8px',
        '&:hover': {
            backgroundColor: 'rgb(7, 177, 77, 0.42)'
        },
        '&:hover a': {
            color: 'white'
        }
    },
    link: {
        color: 'black',
        textDecoration: 'none',
        width: '100%',
        textAlign: 'center',
        display: 'flex',
        alignItems: 'center'
    }
});

const SideBar = () => {
    const { userInfor } = useSelector(state => state.user);
    const isLoggined = !!userInfor?.id;
    const classes = useStyles();
    const dispatch = useDispatch();
    const history = useHistory();

    const handleLogout = async () => {
        await dispatch(userLogout());
        history.push(PATH.HOME);
    };
    const adminInfor = () => {
        history.push(`/system/user/${userInfor.id}`);
    };
    return (
        <Box className={classes.root}>
            <li className={classes.li}>
                {!isLoggined ? '' : (
                    <>
                        <AccountCircleIcon />
                        <Typography sx={{ color: 'blue' }} variant="body2" onClick={adminInfor}>
                            {userInfor.fullname}
                        </Typography>

                    </>
                )}
            </li>
            <li className={classes.li}>
                <NavLink className={classes.link} to={PATH.CALENDAR}>
                    <CalendarTodayIcon sx={{ marginRight: '4px', color: 'black' }} />
                        Manage User
                </NavLink>
            </li>
            <li className={classes.li}>
                <NavLink className={classes.link} to={PATH.FILE}>
                    <CloudDownloadIcon sx={{ marginRight: '4px', color: 'black' }} /> Manage Class
                </NavLink>
            </li>
            <li className={classes.li}>
                <NavLink className={classes.link} to={PATH.REMIND}>
                    <NotificationsActiveIcon sx={{ marginRight: '4px', color: 'black' }} /> Registers
                </NavLink>
            </li>
            <li className={classes.li}>
                <NavLink className={classes.link} to={PATH.MANAGE_TIME}>
                    <AccessTimeIcon sx={{ marginRight: '4px', color: 'black' }} /> Manage Times
                </NavLink>
            </li>
            <li className={classes.li} onClick={() => handleLogout()}>
                <NavLink className={classes.link} to="#">
                    <ExitToAppIcon sx={{ marginRight: '4px', color: 'black' }} />
          Logout
                </NavLink>
            </li>
        </Box>
    );
};

export default SideBar;
