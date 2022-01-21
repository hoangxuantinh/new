/* eslint-disable no-unused-vars */
import { Box, Typography } from '@mui/material';
import Button from '@mui/material/Button';
import ButtonGroup from '@mui/material/ButtonGroup';
import Pagination from '@mui/material/Pagination';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import { styled } from '@mui/material/styles';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import queryString from 'query-string';
import React, { useEffect, useState } from 'react';
import { Link, useHistory } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';
import classApi from '../../api/classApi';
import { PATH } from '../../constants/Path';
import { CONST_FILTER } from '../../constants/filter';
import ModalConfirmDeleteClass from '../../pages/admin/classes/modalConfirm';

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

const FileUpload = () => {
    const history = useHistory();
    const [open,setOpen] = useState(false);
    const [id,setId] = useState('');

    const handleOpen = (id) => {
        setOpen(true);
        setId(id);
    };
    const handleClose = () => {
        setOpen(false);
    };
    const [paginations,setPagination] = useState({
        page: CONST_FILTER.PAGE,
        limit: CONST_FILTER.LIMIT
    });
    const [filter,setFilter] = useState({
        page: CONST_FILTER.PAGE,
        limit: 4 || CONST_FILTER.LIMIT,
        total: CONST_FILTER.TOTAL
    });

    const [classList,setclassList] = useState([]);
    useEffect(() => {
        const fetchUser = async () => {
            const params = queryString.stringify(filter);
            const data = await classApi.pagination(params);
            const { records, pagination } = data;
            setclassList(records);
            setPagination(pagination);
        };
        fetchUser();
    }, [filter]);
    const handlePageChange = (e,page) => {
        setFilter({
            ...filter,
            page: page
        });
    };
    const changePage = (id) => {
        history.replace(`/system/class/edit/${id}`);
    };

    const handleDelete = async (id) => {
        try {
            await classApi.remove(id);
            setclassList(classList.filter(element => element.id !== id));
            setOpen(false);
        } catch (error) {
            if(error.response.status === 403) {
                history.replace(PATH.FORBIDEN);
            }
        }
    };

    return (
        <Box item >
            <Link to='/system/class/add' style={{ backgroundColor: 'green',padding: '12px 16px',margin: '8px 0',color:'white',textDecoration:'none',fontWeight:'bold',lineHeight:'32px' }} >
            Create New Class</Link>
            <TableContainer component={Paper} sx={{ margin: '12px 0' }} >
                <Table sx={{ minWidth: 700 }} aria-label="customized table">
                    <TableHead>
                        <TableRow>
                            <StyledTableCell sx={{width:'17%'}}>Class Name</StyledTableCell>
                            <StyledTableCell sx={{width:'18%'}} >Description</StyledTableCell>
                            <StyledTableCell sx={{width:'8%',textAlign:'center'}} >Avatar</StyledTableCell>
                            <StyledTableCell sx={{textAlign:'center'}} >Current </StyledTableCell>
                            <StyledTableCell >Max </StyledTableCell>
                            <StyledTableCell  >Time Learn</StyledTableCell>
                            <StyledTableCell >Action</StyledTableCell>
                            <StyledTableCell >Thông Tin</StyledTableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {classList.map((element) => (
                            <StyledTableRow key={element.id}>
                                <StyledTableCell component="th" >
                                    {element.name}
                                </StyledTableCell>
                                <StyledTableCell >{element.description}</StyledTableCell>
                                <StyledTableCell >
                                    <img src={ `http://localhost:8000/images/${element.avatar}`} style={{width: '130px',height: '70px'}} />
                                </StyledTableCell>
                                <StyledTableCell sx={{textAlign:'center'}} >{element.currentNumber}</StyledTableCell>
                                <StyledTableCell  >{element.maxNumber}</StyledTableCell>
                                <StyledTableCell >
                                    {element.days.map((day) => (
                                        <Box key={uuidv4()} >{day.dayName} {day.times.map((time) => (
                                            <Typography key={uuidv4()}>{`${time.timeStart}-${time.timeEnd}`}</Typography>
                                        ))}</Box>
                                    ))}
                                </StyledTableCell>
                                <StyledTableCell >
                                    <ButtonGroup disableElevation variant="contained">
                                        <Button sx={{ maxWidth: '68px' }} onClick={() => changePage(element.id)} >Update</Button>
                                        <Button sx={{ backgroundColor: 'red', maxWidth: '68px',marginLeft: '6px' }}
                                            onClick={() => handleOpen(element.id)} >Delete</Button>
                                    </ButtonGroup>
                                </StyledTableCell>
                                <StyledTableCell >
                                    <Button sx={{ maxWidth: '108px' }} onClick={() => {
                                        history.push(`/system/user-of-class/${element.id}`);
                                    }} >Danh Sách Lớp</Button>
                                </StyledTableCell>
                            </StyledTableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
            <Stack  spacing={2}>
                <Pagination count={Math.ceil(paginations.total / paginations.limit)} page={paginations.page} onChange={handlePageChange} sx={{ margin:'18px auto' }}  color="primary" />
            </Stack>
            {open && <ModalConfirmDeleteClass open={open} idClass={id} close={handleClose} handleDelete={handleDelete}/>}
        </Box>
    );
};

export default FileUpload;
