// import Box from '@mui/material/Box';
// import Grid from '@mui/material/Grid';
// import { makeStyles } from '@mui/styles';
// import { unwrapResult } from '@reduxjs/toolkit';
// import React, { useEffect } from 'react';
// import { useDispatch, useSelector } from 'react-redux';
// import { useHistory } from 'react-router-dom';
// import Logo from '../../../assets/logo.jpg';
// import { PATH } from '../../../constants/Path';
// import FormLogin from '../../../features/auth/formLogin';
// import { adminLogin } from '../../../redux/slice/adminSlice';


// const useStyles = makeStyles({
//     root: {
//         height: '100vh'
//     },
//     container: {
//         height: '100%'
//     },
//     left: {
//         backgroundImage: `url(${Logo})`,
//         backgroundRepeat: 'no-repeat',
//         backgroundSize: 'contain',
//         backgroundPosition: 'center',
//         margin: '8px 0 !important'
//     },
//     right: {
//         height: '100%'
//     }
// });

// const LoginAdmin = () => {
//     const history = useHistory();
//     const { adminInfor } = useSelector(state => state.admin);

//     useEffect(() => {
//         if (adminInfor.id) {
//             history.push(PATH.SYSTEM);
//         }
//     }, [adminInfor,history]);

//     const classes = useStyles();
//     const dispatch = useDispatch();

//     const handleSubmit = async (values) => {

//         try {
//             const resultAction = await dispatch(adminLogin(values));
//             unwrapResult(resultAction);

//         } catch (error) {
//             throw(error.message);
//         }

//     };

//     return (
//         <React.Fragment>
//             <Box className={classes.root}>
//                 <Grid container className={classes.container}>
//                     <Grid item xs={7} className={classes.left}></Grid>
//                     <Grid item xs={5} className={classes.right}>
//                         <FormLogin submit={handleSubmit}  />
//                     </Grid>
//                 </Grid>
//             </Box>
//         </React.Fragment>
//     );
// };

// export default LoginAdmin;
