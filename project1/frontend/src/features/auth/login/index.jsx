import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import { makeStyles } from '@mui/styles';
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import Logo from '../../../assets/logo.jpg';
import { PATH } from '../../../constants/Path';
import FormLogin from '../formLogin';
import { userLogin } from '../../../redux/slice/userSlice';
import { unwrapResult } from '@reduxjs/toolkit';
import { ROLE } from '../../../constants/filter';

const useStyles = makeStyles({
    root: {
        height: '90vh'
    },
    container: {
        height: '100%'
    },
    left: {
        backgroundImage: `url(${Logo})`,
        backgroundRepeat: 'no-repeat',
        backgroundSize: 'contain',
        backgroundPosition: 'center',
        margin: '8px 0 !important'
    },
    right: {
        height: '100%'
    }
});

const Login = () => {
    const classes = useStyles();
    const history = useHistory();
    const { userInfor } = useSelector(state => state.user);
    useEffect(() => {
        if(userInfor?.id) {
            history.push(PATH.SYSTEM);
        }
    }, [userInfor,history]);
    const dispatch = useDispatch();
    const handleSubmit = async (values) => {
        try {
            const resultAction = await dispatch(userLogin(values));
            unwrapResult(resultAction);
            if(userInfor?.role === ROLE.ADMIN) {
                return history.push(PATH.SYSTEM);
            }
            history.push(PATH.HOME);
        } catch (error) {
            console.log('🚀 ~ file: index.jsx ~ line 53 ~ handleSubmit ~ error.message', error);
            throw(error.message);
        }
    };

    return (
        <>
            <Box className={classes.root}>
                <Grid container className={classes.container}>
                    <Grid item xs={7} className={classes.left}></Grid>
                    <Grid item xs={5} className={classes.right}>
                        <FormLogin submit={handleSubmit} />
                    </Grid>
                </Grid>
            </Box>
        </>
    );
};

export default Login;
