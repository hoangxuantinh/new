import { Typography } from '@mui/material';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Toolbar from '@mui/material/Toolbar';
import { makeStyles } from '@mui/styles';
import React from 'react';
import logo from '../../assets/f8.png';


const useStyles = makeStyles({
    root: {
        display: 'flex',
        marginTop: '48px'
    },
    appBar: {
        width:'1186px',
        margin: '0 auto',
        backgroundColor: '#fafafa',
        marginTop: '24px',
        padding: '0 12px'
    },
    logo: {
        backgroundImage: `url(${logo})`,
        backgroundRepeat: 'no-repeat',
        backgroundSize: 'contain',
        backgroundPosition: 'center',
        display: 'block',
        minWidth: '40px',
        minHeight: '40px',
        borderRadius: '8px',
        marginRight: '12px'
    }

});

const Footer = () => {
    const classes = useStyles();
    return (
        <Box sx={{ flexGrow: 1 }} className={classes.root}>
            <AppBar position="static" sx={{ backgroundColor: '#fafafa' }}>
                <Toolbar  className={classes.appBar}>
                    <Grid container spacing={2}>
                        <Grid item={true} xs={4} sx={{ padding: '24px 48px' }}>
                            <Box component="div" sx={{ display:'flex',alignItems: 'center' }}>
                                <Box className={classes.logo}></Box>
                                <Typography sx={{ color:'black', fontWeight: 'bold' }}>Học Lập Trình Để Đi Làm</Typography>
                            </Box>
                            <Box component="div" sx={{ display:'flex',alignItems: 'center' }}>
                                <Typography sx={{ color:'#333',minWidth: 50,fontWeight:'500' }}>Email:</Typography>
                                <Typography sx={{ color:'#333',fontWeight:'500' }}>Contact@gmail.com</Typography>
                            </Box>
                        </Grid>
                        <Grid xs={4} item={true} >
                            <Box component="div" sx={{ display:'flex',alignItems: 'center',marginTop:'8px' }}>
                                <Typography sx={{ color:'black', fontWeight: 'bold' }}>Về F8</Typography>
                            </Box>
                            <Box component="div" sx={{ display:'flex',alignItems: 'center',marginTop: '8px' }}>
                                <Typography sx={{ color:'#333',minWidth: 50,fontWeight:'500' }}>Email:</Typography>
                                <Typography sx={{ color:'#333',fontWeight:'500' }}>Contact@gmail.com</Typography>
                            </Box>
                        </Grid>
                        <Grid xs={4} item={true} >
                            <Box component="div" sx={{ display:'flex',alignItems: 'center',marginTop: '8px' }}>
                                <Typography sx={{ color:'black', fontWeight: 'bold' }}>Hỗ trợ</Typography>
                            </Box>
                            <Box component="div" sx={{ display:'flex',alignItems: 'center',marginTop: '8px' }}>
                                <Typography sx={{ color:'#333',minWidth: 50,fontWeight:'500' }}>Email:</Typography>
                                <Typography sx={{ color:'#333',fontWeight:'500' }}>Contact@gmail.com</Typography>
                            </Box>
                        </Grid>

                    </Grid>
                </Toolbar>
            </AppBar>
        </Box>
    );
};

export default Footer;
