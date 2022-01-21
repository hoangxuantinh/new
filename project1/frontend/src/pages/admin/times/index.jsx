import { Box } from '@mui/material';
import Button from '@mui/material/Button';
import ButtonGroup from '@mui/material/ButtonGroup';
import Paper from '@mui/material/Paper';
import { styled } from '@mui/material/styles';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import * as React from 'react';
import { useEffect, useState } from 'react';
import timeApi from '../../../api/timeApi';
import ModalAddTime from './modalAdd';


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
    '&:last-child td, &:last-child th': {
        border: 0
    }
}));

const ManageTimes = () => {
    const [open,setOpen] = useState(false);
    const handleOpen = () => {
        setOpen(true);
    };
    const handleClose = () => {
        setOpen(false);
    };
    const [timeList,setTimeList] = useState([]);
    const [ edit,setEdit ] = useState(false);
    useEffect(() => {
        const fetchTimes = async () => {
            const {times} = await timeApi.getAll();
            setTimeList(times);
        };
        fetchTimes();
    }, []);
    const handleDeleteTime = async (id) => {
        try {
            await timeApi.remove(+id);
            setTimeList(timeList.filter(item => item.id !== id));
        } catch (error) {
            console.log(error.response.message);
        }
    };
    const handleSubmit = async (values) => {
        try {
            await timeApi.add(values);
            handleClose();
            setTimeList([...timeList,{timeStart: values?.timeStart,timeEnd: values?.timeEnd}]);

        } catch (error) {
            throw error.response.data.message;
        }
    };
    const [timeCurrent,setTimeCurrent] = useState({timeStart: '',timeEnd: ''});

    const hanleEdit = async (id) => {
        try {
            const response =  await timeApi.getOne(id);
            setTimeCurrent(response.time);
            handleOpen();
            setEdit(true);
        } catch (error) {
            console.log(error.response);
        }
    };
    const handleUpdateTime = async (values) => {
        try {
            await timeApi.edit(values);
            setTimeList(timeList.map(item => {
                return item.id == values.id ? {...item,id:values.id,timeStart: values.timeStart,timeEnd: values.timeEnd} : item;
            }));
            handleClose();
        } catch (e) {
            console.log(e.response);
        }
    };

    return (
        <>
            <Box component="div" sx={{ width: '98%', margin: '18px auto' }}>
                <Button  onClick={handleOpen} style={{ textDecoration: 'none',backgroundColor:'green',color: 'white',padding: '8px 16px' }}>Create New Period</Button>
                <TableContainer component={Paper}>
                    <Table sx={{ minWidth: 700, marginTop: '16px' }} aria-label="customized table">
                        <TableHead>
                            <TableRow>
                                <StyledTableCell>#</StyledTableCell>
                                <StyledTableCell >Time Start</StyledTableCell>
                                <StyledTableCell >Time End</StyledTableCell>
                                <StyledTableCell >Action</StyledTableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {timeList.length > 0 && timeList.map((time,index ) => (
                                <StyledTableRow  key={Math.random() * 100}>
                                    <StyledTableCell component="th" scope="row">
                                        {index}
                                    </StyledTableCell>
                                    <StyledTableCell >{time?.timeStart}</StyledTableCell>
                                    <StyledTableCell >{time?.timeEnd}</StyledTableCell>
                                    <StyledTableCell >
                                        <ButtonGroup disableElevation variant="contained">
                                            <Button sx={{ maxWidth: '68px' }} onClick={() => hanleEdit(time.id)} >Update</Button>
                                            <Button onClick={() => handleDeleteTime(time.id)}
                                                sx={{ backgroundColor: 'red', maxWidth: '68px',marginLeft: '6px' }} >Delete</Button>
                                        </ButtonGroup>
                                    </StyledTableCell>
                                </StyledTableRow>
                            ))}

                        </TableBody>
                    </Table>
                </TableContainer>

                {open && <ModalAddTime submit={handleSubmit} setEdit={setEdit} update={handleUpdateTime} open={open} timeCurrent={timeCurrent} edit={edit} close={handleClose}/>}

            </Box>

        </>

    );
};

export default ManageTimes;
