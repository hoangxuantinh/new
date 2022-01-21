/* eslint-disable react/prop-types */
import { Box } from '@mui/material';
import React from 'react';
import FormEdit from './formEdit';
import {useState,useEffect} from 'react';
import userApi from '../../../../api/userApi';

const EditUser = (props) => {
    const id = props.match.params.id;
    const [user,setUser] = useState({});
    useEffect(() => {
        (async() => {
            const fetchUser = await userApi.detail(id);
            setUser(fetchUser.user);
        })();
    }, []);
    
    
    return (
        <Box>
            <FormEdit user={user} />
        </Box>
    );
};

export default EditUser;
