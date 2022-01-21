/* eslint-disable react/prop-types */
import { Box, Button, Typography } from '@mui/material';
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
import userApi from '../../../../api/userApi';
import cartApi from '../../../../api/cartApi';

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

const UserByClass = (props) => {
    const { id } = props.match.params;
    const [ users,setUsers ] = useState([]);
    console.log(' ~ users', users);

    useEffect(() => {
        (async () => {
            const response = await userApi.getUserByClassId(+id);
            setUsers(changeData(response.data));
        })();

    }, []);
    function changeData (arr) {
        if(!Array.isArray(arr) || arr.length == 0) return [];
        return arr.map(item => ({...item , status:item?.Classes?.Registers.status,classId: item.Classes.id})
        );}
    const handleRemoveCourse = async (data) => {
        try {
            await cartApi.removeInAdmin(data);
            setUsers(users.filter(item => {
                return ((item.id === data.userId && item.classId !== data.classId) || (item.id !== data.userId));
            }));

        } catch (error) {
            console.log(error);
        }
    };
    const handleConfirmed = async (data) => {
        try {
            await cartApi.confirmed(data);
            setUsers(users.map(item => {
                return  (item.id === data.userId && item.classId === data.classId) ? {...item, status: 'confirmed' } : item;
            }));
        } catch (error) {
            console.log('res', error.response);
        }
    };
    return (
        <Box component="div" sx={{ width: '98%', margin: '18px auto' }}>
            <TableContainer component={Paper}>
                <Table sx={{ minWidth: 700, marginTop: '16px' }} aria-label="customized table">
                    <TableHead>
                        <TableRow>
                            <StyledTableCell>Fullname</StyledTableCell>
                            <StyledTableCell >Email</StyledTableCell>
                            <StyledTableCell >Address</StyledTableCell>
                            <StyledTableCell >Phone</StyledTableCell>
                            <StyledTableCell >Status</StyledTableCell>
                            <StyledTableCell >Action</StyledTableCell>

                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {users?.length > 0 ? users.map((user) => (
                            <StyledTableRow key={user.id}>
                                <StyledTableCell component="th" scope="row">
                                    {user.fullname}
                                </StyledTableCell>
                                <StyledTableCell >{user.email}</StyledTableCell>
                                <StyledTableCell >{user.phone}</StyledTableCell>
                                <StyledTableCell >{user.address}</StyledTableCell>
                                <StyledTableCell >
                                    <Button variant="contained"
                                        color={user?.status === 'pending' ? 'success' : 'error'}>
                                        {user.status}
                                    </Button>
                                </StyledTableCell>
                                <StyledTableCell sx={{ display: 'flex'}} >
                                    {user.status === 'confirmed' ? '' : (
                                        <Button variant="outlined" disabled={user.status === 'confirmed'}
                                            onClick={() => {
                                                handleConfirmed({
                                                    userId: user.id,
                                                    classId: user.classId
                                                });
                                            }}>Confirm</Button>
                                    ) } <Button variant="outlined" color="error"
                                        onClick={() => handleRemoveCourse({
                                            userId: user.id,
                                            classId: user.classId
                                        })}
                                    >
                                        Delete
                                    </Button>
                                </StyledTableCell>
                            </StyledTableRow>
                        )) : <Typography sx={{ marginTop: '12px' }} variant="h6">Chưa có học sinh nào đăng ký lớp này</Typography>}

                    </TableBody>
                </Table>
            </TableContainer>


        </Box>
    );
};

export default UserByClass;
