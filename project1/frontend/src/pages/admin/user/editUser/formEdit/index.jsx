/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import { yupResolver } from '@hookform/resolvers/yup';
import { Button } from '@mui/material';
import { makeStyles } from '@mui/styles';
import { Box } from '@mui/system';
import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import  { PATH } from '../../../../../constants/Path';
import { useHistory } from 'react-router-dom';
import * as yup from 'yup';
import userApi from '../../../../../api/userApi';
import UploadFile from '../../../../../components/formControl/fileUpload';
import InputField from '../../../../../components/formControl/inputField';
import SelectFiedl from '../../../../../components/formControl/selectField';


const schema = yup
    .object({
        fullname: yup
            .string()
            .required('Please enter yourname')
            .test('should enter two word', 'Please enter at least 2 words', (value) => {
                const arr = value.split(' ');
                return arr.length >= 2 && arr[1] !== '';
            }),
        address: yup
            .string()
            .required('Please enter your address'),
        phone: yup
            .string()
            .required('Please enter your phone'),
        gender: yup
            .string()
            .required('Please select gender'),
        role: yup
            .string()
            .required('Please select role')
    })
    .required();

const useStyles = makeStyles({
    root: {
        marginTop: '24px',
        marginRight: '18px',
        textAlign: 'center'
    },
    avatar: {
        width: '100%',
        margin: '0 auto'
    },
    hover: {
        '&:hover': {
            backgroundColor: '#1de9b6 !important'
        }
    }
});
const FormEdit = ({user}) => {



    const history = useHistory();
    const classes = useStyles();


    const form = useForm({
        defaultValues: {
            fullname: '',
            email: '',
            phone: '',
            address: '',
            gender: '',
            role: ''
        },
        resolver: yupResolver(schema)
    });
    const { setValue } = form;


    useEffect(() => {
        if(user.fullname){
            setValue('fullname', user.fullname);
            setValue('email', user.email);
            setValue('address', user.address);
            setValue('phone', user.phone);
            setValue('gender', user.gender);
            setValue('role', user.role);
        }

    }, [user]);

    const [roleList,setRoleList] =  useState([]);
    const [genders,setGender] =  useState([]);
    useEffect(() => {
        (async () => {
            const data = await userApi.getProperty();
            const {genders,roles} = data;
            setGender(genders);
            setRoleList(roles);
        })();
    }, []);

    const { setError } = form;
    const handleSubmit = async (values) => {
        try {
            const {avatar,...rest} = values;
            const formData = new FormData();
            formData.append('avatar',values?.avatar);
            formData.append('user',JSON.stringify(rest));
            await userApi.edit({id:rest.id,formData});
            history.replace(PATH.CALENDAR);

        } catch (error) {
            if(error.response.status === 403) {
                history.replace(PATH.FORBIDEN);
            }
            setError('avatar', {
                type: 'server',
                message: error.response.data.message
            });
        }

    };
    return (
        <div className={classes.root}>
            <form onSubmit={form.handleSubmit(handleSubmit)}>
                <InputField name="fullname" label="Fullname"   form={form} />
                <InputField name="address" label="Address"  form={form} />
                <InputField name="phone" label="Phone"  form={form} />
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <SelectFiedl name="gender" rows={genders}  label="Gender" form={form} />
                    <SelectFiedl name="role" rows={roleList}  label="Role" form={form} />
                </Box>
                <UploadFile name="avatar" labal="avatar"  accept="image/*"  form={form}  />
                <Button type="submit"  className={classes.hover} sx={{ bgcolor: '#42a5f5', color: 'white' }} fullWidth>
                    Update
                </Button>
            </form>
        </div>
    );
};

export default FormEdit;
