/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import Grid from '@mui/material/Grid';
import { Box } from '@mui/system';
import SideBar from '../../components/sideBar';
import { useHistory } from 'react-router-dom';
import { PATH } from '../../constants/Path';
import { useEffect } from 'react';
import React from 'react';
import { makeStyles } from '@mui/styles';
import { useSelector,useDispatch } from 'react-redux';
import { getLogin } from '../../redux/slice/userSlice';
import { ROLE } from '../../constants/filter';


const useStyles = makeStyles({
    root: {
        height: '100vh'
    },
    right: {
        height: '100%'
    }
});

const AdminLayout = (props) => {
    const dispatch = useDispatch();
    const history = useHistory();
    useEffect(() => {
        (async () => {
            const response = await dispatch(getLogin());
            const { payload } = response;
            if (payload?.role === ROLE.ADMIN) {
                return;
            }
            history.push(PATH.HOME);
        })();
    }, []);

    const classes = useStyles();
    return (
        <Box>
            <Grid container className={classes.root} spacing={2}>
                <Grid item xs={2} className={classes.right}>
                    <SideBar />
                </Grid>
                <Grid item xs={10}>
                    {props.children}
                </Grid>
            </Grid>
        </Box>
    );
};

export default AdminLayout;
