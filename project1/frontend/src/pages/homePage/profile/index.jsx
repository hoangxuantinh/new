/* eslint-disable no-unused-vars */
import React, { useEffect } from 'react';
import Header from '../../../components/header';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import { Typography } from '@mui/material';
import { useSelector } from 'react-redux';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import { useState } from 'react';
import FormEditUserPage from './formEditUser';
import FormChangePassWord from './formChangePassword';
import userApi from '../../../api/userApi';
import authApi from '../../../api/authApi';

const ProfilePage = () => {
    const { userInfor } = useSelector(state => state.user);
    const { id } = userInfor;
    // eslint-disable-next-line no-unused-vars
    const [isEdit,setIsEdit] = useState(false);
    const [show,setShow] = useState(true);
    const [changePassword,setChangePassword] = useState(false);
    const handleEdit = () => {
        setIsEdit(true);
        setChangePassword(false);
        setShow(false);
    };
    const handleShow = () => {
        setShow(true);
        setIsEdit(false);
        setChangePassword(false);
    };
    const handleChangePassword = () => {
        setChangePassword(true);
        setShow(false);
        setIsEdit(false);
    };

    const [user, setUser] = useState({});
    useEffect(() => {
        (async () => {
            try {
                const response = await userApi.detail(+id);
                setUser(response.user);
            } catch (error) {
                console.log(error.response);
            }

        })();
    },[]);

    const handleChangeProfile = async (values) => {
        const response = await authApi.changeProfile(values);
        setUser(response.userInfor);
        handleShow();
    };

    return (
        <React.Fragment>
            <Header />
            <Box >
                <Grid container  >
                    <Grid item xs={3} >
                    </Grid>
                    <Grid item xs={6} >
                        {isEdit && (
                            <>
                                <FormEditUserPage user={user} changeProfile={handleChangeProfile}/>
                                <Button variant="outlined" onClick={handleShow}>Hủy</Button>
                            </>
                        )}
                        {show && (
                            <>
                                <Typography variant="h6" sx={{ marginTop: '12px',textAlign:'center' }}>Thông Tin Cá Nhân</Typography>
                                <Box sx={{display:'flex',marginTop:'28px'}}><Typography  sx={{fontWeight: 'bold', minWidth:'110px'}}>Họ Và Tên:</Typography> <Typography sx={{fontWeight: 'bold'}}>{user.fullname}</Typography> </Box>
                                <Box sx={{display:'flex',marginTop:'12px'}}><Typography  sx={{fontWeight: 'bold', minWidth:'110px'}}>Email:</Typography> <Typography sx={{fontWeight: 'bold'}}>{user.email}</Typography> </Box>
                                <Box sx={{display:'flex',marginTop:'12px'}}><Typography  sx={{fontWeight: 'bold', minWidth:'110px'}}>Địa Chỉ:</Typography> <Typography sx={{fontWeight: 'bold'}}>{user.address}</Typography> </Box>
                                <Box sx={{display:'flex',marginTop:'12px'}}><Typography  sx={{fontWeight: 'bold', minWidth:'110px'}}>Số Điện Thoại:</Typography> <Typography sx={{fontWeight: 'bold'}}>{user.phone}</Typography> </Box>
                                <Box sx={{display:'flex',marginTop:'12px'}}><Typography  sx={{fontWeight: 'bold', minWidth:'110px'}}>Gender:</Typography> <Typography sx={{fontWeight: 'bold'}}>{user.gender}</Typography> </Box>
                                <Box sx={{display:'flex',marginTop:'12px'}}><Typography  sx={{fontWeight: 'bold', minWidth:'110px'}}>Avatar:</Typography> <img src={`http://localhost:8000/images/${user.avatar}`} style={{width: '230px',height:'120px'}} alt="avatar" ></img></Box>
                                <Stack spacing={2} sx={{marginTop: '18px'}} direction="row">
                                    <Button variant="contained" onClick={handleEdit}>Cập Nhật Tài Khoản</Button>
                                    <Button variant="outlined" onClick={handleChangePassword}>Đổi Mật Khẩu</Button>
                                </Stack>
                            </>

                        )}
                        {changePassword && (
                            <>
                                <FormChangePassWord handleShow={handleShow} />
                                <Button variant="outlined" onClick={handleShow}>Hủy</Button>
                            </>
                        )}



                    </Grid>
                    <Grid item xs={3} >
                    </Grid>
                </Grid>
            </Box>


        </React.Fragment>
    );
};

export default ProfilePage;
