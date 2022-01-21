import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import { makeStyles } from '@mui/styles';
import React from 'react';
import Logo from '../../../assets/logo.jpg';
import FormRegister from '../formRegister';
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
    }
});

const Register = () => {
    const classes = useStyles();

    return (
        <React.Fragment>
            {/* <Header /> */}
            <Box className={classes.root}>
                <Grid container className={classes.container}>
                    <Grid item xs={7} className={classes.left}></Grid>
                    <Grid item xs={5}>
                        <FormRegister />
                    </Grid>
                </Grid>
            </Box>
        </React.Fragment>
    );
};

export default Register;
