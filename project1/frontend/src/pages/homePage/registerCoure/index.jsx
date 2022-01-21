/* eslint-disable no-unused-vars */
import { Typography } from '@mui/material';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import classApi from '../../../api/classApi';
import Header from '../../../components/header';
import cartApi from '../../../api/cartApi';
import TextareaAutosize from '@mui/material/TextareaAutosize';
import { PATH } from '../../../constants/Path';
import { useHistory } from 'react-router-dom';
import Snackbar from '@mui/material/Snackbar';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';


const CourseDetail = (props) => {
    // eslint-disable-next-line react/prop-types
    const { id } = props.match.params;
    const { userInfor } = useSelector(state => state.user);
    const history = useHistory();
    const [ classInfo, setClassInfor ] = useState({});
    const [ disable, setDisable ] = useState(false);
    const [ showBtnAdd, setShowBtnAdd ] = useState(true);
    const [ maxSize, setMaxSise ] = useState(false);
    useEffect(() => {
        (async () => {
            try {
                const response = await classApi.getOne(+id);
                setClassInfor(response.data[0]);
                if(response.data[0].currentNumber === response.data[0].maxNumber) {
                    setMaxSise(true);
                    setShowBtnAdd(false);
                    setDisable(true);
                }
            } catch (error) {
                console.log(error.response);
            }
        })();
    },[]);
    const [open, setOpen] = React.useState(false);

    useEffect(() => {
        (async () => {
            if(!userInfor?.id) return;
            const { data } =  await cartApi.checkIsRegister();
            data.forEach(item => {
                if(item.id === +id) {
                    setDisable(true);
                }
            });
        })();
    },[]);
    const [data ,setData] = useState({
        userId: userInfor?.id,
        classId: +id
    });
    const handleOnChange = (e) => {
        setData({
            ...data,
            description: e.target.value
        });
    };

    const handleRegister = async () => {
        try {
            if(!userInfor?.id) {
                setOpen(true);
                return;
            }
            const response = await cartApi.add(data);
            history.push(PATH.DETAIL_COURSE);

        } catch (error) {
            console.log(error);
        }
    };

    const handleClick = () => {
        setOpen(true);
    };

    const handleClose = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }

        setOpen(false);
    };

    const action = (
        <React.Fragment>
            <IconButton
                size="small"
                aria-label="close"
                color="inherit"
                onClick={handleClose}
            >
                <CloseIcon fontSize="small" />
            </IconButton>
        </React.Fragment>
    );
    return (
        <React.Fragment>
            <Header />
            <Box sx={{marginTop: '8px'}} >
                <Grid container  >
                    <Grid item xs={4} sx={{ display: 'flex',alignItems: 'center',justifyContent:'center' }} >
                        <img src={ classInfo.avatar ? `http://localhost:8000/images/${classInfo?.avatar}`
                            : 'http://www.gravatar.com/avatar/?d=mp'} style={{  width: '300px' , height: '160px ' }} />
                    </Grid>
                    <Grid item xs={5}  >
                        <Typography variant="h6" sx={{ margin: '12px 0',textAlign:'center' }}>Thông Tin Lớp Học</Typography>
                        <Box component="div" sx={{display: 'flex'}}>
                            <Box >
                                <Typography  sx={{fontWeight: 'bold', minWidth:'110px'}}>Tên Lớp Học: {classInfo.name}</Typography>
                                <Typography  sx={{fontWeight: 'bold', minWidth:'110px'}}>Mô Tả: {classInfo.description}</Typography>
                                <Typography  sx={{fontWeight: 'bold', minWidth:'110px'}}>Số Lượng Tối Đa: {classInfo.maxNumber}</Typography>
                                <Typography  sx={{fontWeight: 'bold', minWidth:'110px'}}>Số Lượng Hiện Tại: {classInfo.currentNumber}</Typography>
                                <Box>
                                    <Typography sx={{ fontWeight: 'bold' }}>Thời Gian Học</Typography>
                                    {classInfo.days?.map((day) => (
                                        <Box sx={{ display: 'flex',fontWeight: 'bold' }} key={Math.random() * 100} >{day.dayName} : {day.times.map(time => (
                                            <Typography key={Math.random() * 100}  sx={{fontWeight: 'bold', marginLeft:'12px'}}>{time.timeStart}-{time.timeEnd}</Typography>
                                        ))} </Box>
                                    ))}
                                </Box>
                                <Box >
                                    <Typography sx={{fontWeight: 'bold'}}>Thêm Mô Tả:</Typography>
                                    <TextareaAutosize
                                        minRows={5}
                                        style={{ width: 350 }}
                                        onChange={handleOnChange}
                                    />
                                </Box>

                            </Box>
                        </Box>
                    </Grid>
                    <Grid item xs={3} sx={{ display: 'flex',alignItems: 'center',justifyContent:'start' }} >
                        {showBtnAdd && (
                            <Button variant="contained" disabled={disable} color="success" onClick={handleRegister} >{!disable ? 'Đăng Ký Học' : 'Đã Đăng Ký'}</Button>
                        )}
                        {maxSize && (
                            <Button variant="contained" disabled={disable} color="success" >Lớp Đã Đầy</Button>
                        )}


                    </Grid>
                </Grid>
                <Snackbar
                    open={open}
                    autoHideDuration={1000}
                    onClose={handleClose}
                    message="Please login before register"
                    action={action}
                    sx={{ color: 'white' }}
                    anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
                />
            </Box>


        </React.Fragment>
    );
};

export default CourseDetail;
