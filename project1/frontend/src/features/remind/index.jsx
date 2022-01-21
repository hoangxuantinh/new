/* eslint-disable react/prop-types */
import { Box } from '@mui/material';
import Button from '@mui/material/Button';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import Pagination from '@mui/material/Pagination';
import Paper from '@mui/material/Paper';
import Select from '@mui/material/Select';
import Stack from '@mui/material/Stack';
import { styled } from '@mui/material/styles';
import Tab from '@mui/material/Tab';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import TextField from '@mui/material/TextField';
import queryString from 'query-string';
import React, { useEffect, useState, useRef } from 'react';
import cartApi from '../../api/cartApi';
import { debounce } from '../../until/debounce';


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

const RegisterManage = ({ location, history }) => {
    const [paginations,setPagination] = useState({
        page: 1,
        limit: 7
    });

    const [listRegister,setListRegister] = useState([]);
    const searchTimeoutRef = useRef(null);
    useEffect(() => {
        const fetchUser = async () => {
            try{
                const { page, limit, status, search } = queryString.parse(location.search);
                const params = {
                    page: page || 1,
                    limit: limit || 6,
                    status: status || '',
                    search: search || ''
                };
                const data = await cartApi.search(queryString.stringify(params));
                const {records,pagination} = data;
                setListRegister(records);
                setPagination(pagination);
            }catch(e) {
                console.log('error',e.response);
            }
        };
        fetchUser();

    }, [location.search]);

    const handleRemoveCourse = async (data) => {
        try {
            await cartApi.removeInAdmin(data);
            setListRegister(listRegister.filter(item => {
                return ((item.userId === data.userId && item.classId !== data.classId) || (item.userId !== data.userId));
            }));

        } catch (error) {
            console.log(error);
        }
    };
    const handleConfirmed = async (data) => {
        try {
            await cartApi.confirmed(data);
            setListRegister(listRegister.map(item => {
                return  (item.userId === data.userId && item.classId === data.classId) ? {...item, status: 'confirmed'} : item;
            }));
        } catch (error) {
            console.log('res', error.response);
        }
    };
    const handleFilterChange =  (name, value) => {
        let params = queryString.parse(location.search);

        params = {
            ...params,
            page: 1,
            [name]: value
        };

        const query = queryString.stringify(params);
        history.replace(`${location.pathname}?${query}`);
    };

    return (
        <Box item xs={8}>
            <Box sx={{display: 'flex'}}>
                <Tab label="Manage Register" />
                <Box sx={{ minWidth: 130 }}>
                    <FormControl fullWidth>
                        <InputLabel id="demo-simple-select-label">Filter</InputLabel>
                        <Select
                            onChange={e => handleFilterChange('status', e.target.value)}
                        >
                            <MenuItem value="">All</MenuItem>
                            <MenuItem value="pending">Pending</MenuItem>
                            <MenuItem value="confirmed">Confirm</MenuItem>
                        </Select>
                    </FormControl>
                </Box>
                <TextField
                    label="Search..."
                    onChange={(e) => {
                        searchTimeoutRef.current = debounce(searchTimeoutRef.current, () => handleFilterChange('search', e.target.value));
                    }}
                    sx={{ marginLeft:'8px' }} />
            </Box>
            <TableContainer component={Paper}>
                <Table sx={{ minWidth: 700 }} aria-label="customized table">
                    <TableHead>
                        <TableRow>
                            <StyledTableCell sx={{ width: '200px'}}>Tên Học Sinh</StyledTableCell>
                            <StyledTableCell sx={{ width: '150px'}} >Email</StyledTableCell>
                            <StyledTableCell sx={{ width: '200px'}} >Lớp</StyledTableCell>
                            <StyledTableCell sx={{ width: '100px'}} >Phone</StyledTableCell>
                            <StyledTableCell sx={{ width: '200px'}} >Address</StyledTableCell>
                            <StyledTableCell >Status</StyledTableCell>
                            <StyledTableCell sx={{ textAlign: 'center'}} >Action</StyledTableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {listRegister?.map((row) => (
                            <StyledTableRow key={row.id}>
                                <StyledTableCell component="th" scope="row">
                                    {row.user.fullname}
                                </StyledTableCell>
                                <StyledTableCell >{row.user.email}</StyledTableCell>
                                <StyledTableCell >{row.Class?.name}</StyledTableCell>
                                <StyledTableCell >{row.user?.phone}</StyledTableCell>
                                <StyledTableCell >{row.user.address}</StyledTableCell>
                                <StyledTableCell >
                                    <Button variant="contained" size="small" color={row.status === 'pending' ? 'success' : 'error'}>
                                        {row.status}
                                    </Button>
                                </StyledTableCell>
                                <StyledTableCell sx={{ display: 'flex'}} >
                                    {row.status === 'confirmed' ? '' : (
                                        <Button variant="outlined" color="secondary" disabled={row.status === 'confirmed'}
                                            onClick={() => {
                                                handleConfirmed({ userId: row.userId,classId: row.classId});
                                            }}>Confirm</Button>
                                    ) } <Button variant="outlined" color="error"  onClick={() => handleRemoveCourse({
                                        userId: row.userId,
                                        classId: row.classId
                                    })}>
                                        Delete
                                    </Button>
                                </StyledTableCell>
                            </StyledTableRow>
                        ))}
                    </TableBody>
                </Table>
                <Stack sx={{ width:'100%' }}  spacing={2}>
                    <Pagination count={Math.ceil(paginations.total / paginations.limit)} page={paginations.page} onChange={(_, page) => handleFilterChange('page', page)}  sx={{ margin:'18px auto' }}  color="primary" />
                </Stack>
            </TableContainer>
        </Box>
    );
};

export default RegisterManage;
