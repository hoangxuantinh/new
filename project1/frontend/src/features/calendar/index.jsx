/* eslint-disable react/prop-types */
import { Box } from '@mui/material';
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
import * as React from 'react';
import { useEffect, useState } from 'react';
import { NavLink, useHistory } from 'react-router-dom';
import userApi from '../../api/userApi';
import { PATH } from '../../constants/Path';
import { CONST_FILTER } from '../../constants/filter';

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

const ManageUser = (props) => {
    const { location } = props;
    const history = useHistory();
    const [paginations,setPagination] = useState({
        page: CONST_FILTER.PAGE,
        limit: CONST_FILTER.LIMIT
    });

    const [userList,setUserList] = useState([]);
    useEffect(() => {
        const fetchUser = async () => {
            const { page,limit } = queryString.parse(location.search);
            const params = {
                page: page || 1,
                limit: limit || 6
            };
            const data = await userApi.getAll(queryString.stringify(params));
            const {records,pagination} = data;
            setUserList(records.rows);
            setPagination(pagination);
        };
        fetchUser();
    }, [location.search]);
    const handleChange = (event, page) => {
        let params = queryString.parse(location.search);
        params = {
            ...params,
            page: page
        };
        const query = queryString.stringify(params);
        history.replace(`${location.pathname}?${query}`);
    };

    const handleDelete = async (id) => {
        try {
            await userApi.remove(id);
            setUserList(userList.filter(user => user.id !== id));

        } catch (error) {
            if(error.response.status === 403) {
                history.replace(PATH.FORBIDEN);
            }
        }
    };
    const changePageEdit = (id) => {
        history.push(`/system/edit/user/${id}`);
    };

    return (
        <Box component="div" sx={{ width: '98%', margin: '18px auto' }}>
            <NavLink to={PATH.ADD_USER} style={{ textDecoration: 'none',backgroundColor:'green',color: 'white',padding: '8px 16px' }}>Create New User</NavLink>
            <TableContainer component={Paper}>
                <Table sx={{ minWidth: 700, marginTop: '16px' }} aria-label="customized table">
                    <TableHead>
                        <TableRow>
                            <StyledTableCell>Fullname</StyledTableCell>
                            <StyledTableCell>Avatar</StyledTableCell>
                            <StyledTableCell >Email</StyledTableCell>
                            <StyledTableCell >Address</StyledTableCell>
                            <StyledTableCell >Phone</StyledTableCell>
                            <StyledTableCell >Role</StyledTableCell>
                            <StyledTableCell >Action</StyledTableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {userList.map((user) => (
                            <StyledTableRow key={user.id}>
                                <StyledTableCell component="th" scope="row">
                                    {user.fullname}
                                </StyledTableCell>
                                <StyledTableCell >
                                    <img src={ user.avatar ? `http://localhost:8000/images/${user?.avatar}`
                                        : 'http://www.gravatar.com/avatar/?d=mp'} style={{width: '60px',height: '50px'}} />
                                </StyledTableCell>

                                <StyledTableCell >{user.email}</StyledTableCell>
                                <StyledTableCell >{user.phone}</StyledTableCell>
                                <StyledTableCell >{user.address}</StyledTableCell>
                                <StyledTableCell >{user.role}</StyledTableCell>
                                <StyledTableCell >
                                    <ButtonGroup disableElevation variant="contained">
                                        <Button sx={{ maxWidth: '68px' }} onClick={() => changePageEdit(user.id)}>Update</Button>
                                        <Button sx={{ backgroundColor: 'red', maxWidth: '68px',marginLeft: '6px' }} onClick={() => handleDelete(user.id)}>Delete</Button>
                                    </ButtonGroup>
                                </StyledTableCell>
                            </StyledTableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
            <Stack  spacing={2}>
                <Pagination count={ Math.ceil(paginations.total / paginations.limit) } page={paginations.page} onChange={handleChange}  sx={{ margin:'18px auto' }}  color="primary" />
            </Stack>

        </Box>
    );
};

export default ManageUser;
