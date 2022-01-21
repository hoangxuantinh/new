/* eslint-disable no-unused-vars */
import { yupResolver } from '@hookform/resolvers/yup';
import { Button } from '@mui/material';
import { makeStyles } from '@mui/styles';
import { Box } from '@mui/system';
import React from 'react';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';
import InputField from '../../../../../components/formControl/inputField';
import PasswordField from '../../../../../components/formControl/passwordField';
import SelectFiedl from '../../../../../components/formControl/selectField';
import UploadFile from '../../../../../components/formControl/fileUpload';
import {useState,useEffect} from 'react';
import userApi from '../../../../../api/userApi';
import { useHistory } from 'react-router-dom';
import { PATH } from '../../../../../constants/Path';

const schema = yup
    .object({
        fullname: yup
            .string()
            .required('Please enter yourname')
            .test('should enter two word', 'Please enter at least 2 words', (value) => {
                const arr = value.split(' ');
                return arr.length >= 2 && arr[1] !== '';
            }),
        password: yup
            .string()
            .required('Please enter your password')
            .min(6, 'Please enter at leats 6 letters')
            .test('passwordRequirements', 'Password must have number,upper and lower case', (value) =>
                [/[a-z]/, /[A-Z]/, /[0-9]/].every((pattern) => pattern.test(value))
            ), email: yup
            .string()
            .required('Please enter your email')
            .email('This field must be email!'),
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
            .required('Please select role'), 
        avatar : yup.mixed().required('Please select avatar')
            .test(
                'fileSize',
                'File size too large, max file size is 1 Mb',
                (file) => file && file.size <= 1100000
            )
            .test(
                'fileType',
                'Incorrect file type',
                (file) =>
                    file && ['image/png', 'image/jpg', 'image/jpeg'].includes(file.type)
            )
      
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
const FormAddUser = (props) => {
    const history = useHistory();
    const classes = useStyles();
    const form = useForm({
        defaultValues: {
            fullname: '',
            password: '',
            email: '',
            address: '',
            phone: '',
            avatar: '',
            gender: '',
            role:''
        },
        resolver: yupResolver(schema)
    });

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
            formData.append('avatar',values.avatar);
            formData.append('user',JSON.stringify(rest));
            await userApi.add(formData);
            history.replace(PATH.CALENDAR);
      
        } catch (error) {
            if(error.response.status === 403) {
                history.replace(PATH.FORBIDEN);
            }
            setError('email', {
                type: 'server',
                message: error.response.data.message
            });
        }
   
    };
   
    return (
        <div className={classes.root}>
      
            <form onSubmit={form.handleSubmit(handleSubmit)}>
                <InputField name="fullname" label="Full name" form={form} />
                <InputField name="email" label="Email" form={form} />
                <PasswordField name="password" label="Your Password" form={form} /> 
                <InputField name="address" label="Address" form={form} />
                <InputField name="phone" label="Phone" form={form} />
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <SelectFiedl name="gender" rows={genders} label="Gender" form={form} />
                    <SelectFiedl name="role" rows={roleList}  label="Role" form={form} />
                </Box>
                <UploadFile name="avatar" labal="avatar"  accept="image/*"  form={form}  />

                <Button type="submit"  className={classes.hover} sx={{ bgcolor: '#42a5f5', color: 'white' }} fullWidth>
          Create An Account
                </Button>
            </form>
        </div>
    );
};

export default FormAddUser;
