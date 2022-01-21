import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import MenuIcon from '@mui/icons-material/Menu';
import { Typography } from '@mui/material';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
// import { useEffect } from 'react';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Toolbar from '@mui/material/Toolbar';
import { makeStyles } from '@mui/styles';
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useHistory } from 'react-router-dom';
import { PATH } from '../../constants/Path';
import { userLogout } from '../../redux/slice/userSlice';

const useStyles = makeStyles({
    root: {
        display: 'flex',
        justifyContent: 'space-between'
    },
    link: {
        textDecoration: 'none',
        color: '#fff',
        padding: '0 8px'
    }
});

const Header = () => {
    const history = useHistory();
    const dispatch = useDispatch();
    const { userInfor } = useSelector(state => state.user);
    const isLoggined = !!userInfor?.id;
    const classes = useStyles();
    const [anchorEl, setAnchorEl] = React.useState(null);
    const open = Boolean(anchorEl);
    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };
    const changePage = () => {
        history.push('/');
    };
    const handleLogout = async () => {
        await dispatch(userLogout());
        handleClose();
        history.push('/');
    };

    return (
        <Box sx={{ flexGrow: 1 }}>
            <AppBar position="static">
                <Toolbar className={classes.root}>
                    <IconButton size="large" edge="start" color="inherit" aria-label="menu" sx={{ mr: 2 }}>
                        <MenuIcon onClick={changePage} />
                    </IconButton>
                    <Box>
                        {!isLoggined ?
                            <Link to={PATH.LOGIN} className={classes.link}> Login</Link>
                            : <Typography  onClick={handleClick}
                                sx={{ padding: '0 4px',display: 'flex',cursor: 'pointer' }}>
                                <AccountCircleIcon/> {userInfor.fullname}</Typography>}
                    </Box>
                </Toolbar>
            </AppBar>
            <Menu
                id="basic-menu"
                anchorEl={anchorEl}
                open={open}
                onClose={handleClose}
                sx={{ marginTop: '8px' }}
            >
                <MenuItem  onClick={() => {
                    history.push('/profile');
                }}>Profile</MenuItem>
                <MenuItem onClick={() => {
                    history.push(PATH.DETAIL_COURSE);
                }}>My Courses</MenuItem>
                <MenuItem onClick={handleLogout}>Logout</MenuItem>
            </Menu>
        </Box>
    );
};

export default Header;
