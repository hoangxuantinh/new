/* eslint-disable react/prop-types */
import { Box } from '@mui/material';
import React from 'react';
import FormEditClass from './formEdit';
import {useState,useEffect} from 'react';
import classApi from '../../../../api/classApi';


const EditClass = (props) => {
    const id = props.match.params.id;
    const [record,setRecord] = useState({});
    useEffect(() => {
        (async() => {
            const fetchClass = await classApi.getOne(id);
            setRecord(fetchClass.data[0]);
        })();
    }, []);

    return (
        <Box>
            <FormEditClass data={record} />
        </Box>
    );
};

export default EditClass;
