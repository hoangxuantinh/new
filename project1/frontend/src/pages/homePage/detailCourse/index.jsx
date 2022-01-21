/* eslint-disable no-unused-vars */
import { Typography } from '@mui/material';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import { styled } from '@mui/material/styles';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import React, { useEffect, useState } from 'react';
import cartApi from '../../../api/cartApi';
import Header from '../../../components/header';
import ModalConfirmDeleteCourse from './modalDelete';

const StyledTableCell = styled(TableCell)(({ theme }) => ({
    [`&.${tableCellClasses.head}`]: {
        backgroundColor: theme.palette.common.black,
        color: theme.palette.common.white
    },
    [`&.${tableCellClasses.body}`]: {
        fontSize: 14
    }
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
    '&:nth-of-type(odd)': {
        backgroundColor: theme.palette.action.hover
    },
    // hide last border
    '&:last-child td, &:last-child th': {
        border: 0
    }
}));

const DetailCourseOfUser = (props) => {
    // eslint-disable-next-line react/prop-types
    const { id } = props.match.params;
    // const { userInfor } = useSelector(state => state.user);
    const [ showModal,setShowModal ] = useState(false);
    const [ courses, setCourses ] = useState([]);
    const [ classId, setClassId ] = useState(null);

    useEffect(() => {
        (async () => {
            try {
                const response = await cartApi.getCourseById(+id);
                console.log('🚀 ~ file: index.jsx ~ line 50 ~ response', response);
                setCourses(response.data[0].register);
            } catch (error) {
                console.log(error.response);
            }
        })();
    },[]);

    const handleCancel = async (id) => {
        try {
            const response = await cartApi.remove(id);
            setCourses(courses.filter(course => {
                return course.Class.id !== id;
            }));

        } catch (error) {
            console.log(error.response.data.message);
        }
    };
    const handleShowModal = (id) => {
        setShowModal(true);
        setClassId(id);
    };
    const handleCloseModal = () => {
        setShowModal(false);
    };

    return (
        <React.Fragment>
            <Header />
            <Box sx={{marginTop: '8px'}} >
                <Grid container  >
                    <Grid item xs={1} >
                    </Grid>
                    <Grid item xs={10}  >
                        {courses?.length !== 0 ? (
                            <>
                                <Typography variant="h6" sx={{ margin: '12px 0',textAlign:'center' }}>Danh sách các khóa học đã đăng ký</Typography>
                                <Box component="div" sx={{display: 'flex' }}>
                                    <TableContainer component={Paper}>
                                        <Table sx={{ minWidth: 700 }} aria-label="customized table">
                                            <TableHead>
                                                <TableRow>
                                                    <StyledTableCell>Lớp Học</StyledTableCell>
                                                    <StyledTableCell >Lịch Học</StyledTableCell>
                                                    <StyledTableCell >Status</StyledTableCell>
                                                    <StyledTableCell >Action</StyledTableCell>
                                                </TableRow>
                                            </TableHead>
                                            <TableBody>
                                                {courses?.map((row) => (
                                                    <StyledTableRow key={row.Class.id}>
                                                        <StyledTableCell component="th" scope="row">
                                                            {row.Class.name}
                                                        </StyledTableCell>
                                                        <StyledTableCell >{row.Class.ClassTimes?.map(item => (
                                                            <Box key={item.id}>
                                                                <Typography>{item.DayOfWeek.name}</Typography>
                                                                <Typography>{item.Time.timeStart}-{item.Time.timeEnd}</Typography>

                                                            </Box>
                                                        ))}</StyledTableCell>
                                                        <StyledTableCell >
                                                            <Button variant="contained" color={row.status === 'pending' ? 'success' : 'error'}>
                                                                {row.status}
                                                            </Button>
                                                        </StyledTableCell>
                                                        <StyledTableCell  >
                                                            <Button variant="outlined" color="error" disabled={row.status !== 'pending'} onClick={() => handleShowModal(row.Class.id)} >
                                                        Cancel
                                                            </Button>
                                                        </StyledTableCell>
                                                    </StyledTableRow>
                                                ))}
                                                {showModal && <ModalConfirmDeleteCourse close={handleCloseModal} classId={classId} handleCancel={handleCancel}/>}
                                            </TableBody>
                                        </Table>
                                    </TableContainer>

                                </Box>
                            </>

                        ) : <Typography variant="h6" sx={{ margin: '12px 0',textAlign:'center' }}>Bạn Chưa Đăng Ký KHóa Nào </Typography> }
                    </Grid>
                    <Grid item xs={1} >
                    </Grid>
                </Grid>
            </Box>


        </React.Fragment>
    );
};

export default DetailCourseOfUser;
