/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import { yupResolver } from '@hookform/resolvers/yup';
import { Button, Typography } from '@mui/material';
import { makeStyles } from '@mui/styles';
import { Box } from '@mui/system';
import React from 'react';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';
import userApi from '../../../api/userApi';
import authApi from '../../../api/authApi';
import UploadFile from '../../../components/formControl/fileUpload';
import InputField from '../../../components/formControl/inputField';
import PasswordField from '../../../components/formControl/passwordField';
import SelectField from '../../../components/formControl/selectField';
import { useState,useEffect } from 'react';

const schema = yup
    .object({
        fullname: yup
            .string().required('Please enter your name'),
        gender: yup
            .string().required('Please select gender'),
        email: yup
            .string().required('Please enter email')
            .email('This Field must be Email'),
        password: yup
            .string()
            .required('Please enter your password')
            .min(6, 'Please enter at leats 6 letters')
            .test('passwordRequirements', 'Password must have number,upper and lower case', (value) =>
                [/[a-z]/, /[A-Z]/, /[0-9]/].every((pattern) => pattern.test(value))
            ),
        retypePassword: yup
            .string()
            .required('Please enter your retype password')
            .oneOf([yup.ref('password')], 'Password enter not exactly'),
        address: yup
            .string()
            .required('Please enter your address'),
        phone: yup
            .number('This Field Must Be Number').required('Please Enter Your Phone'),
        avatar : yup.mixed().required('Please select avatar')
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
        marginTop: '8px',
        marginRight: '18px'
    },
    hover: {
        '&:hover': {
            backgroundColor: '#1de9b6 !important'
        }
    }
});

const FormRegister = () => {
    const [genders,setGender] =  useState([]);
    const [isSubmit,setIsSubmit] =  useState(false);
    useEffect(() => {
        (async () => {
            const data = await userApi.getProperty();
            const {genders} = data;
            setGender(genders);
        })();
    }, []);
    const classes = useStyles();
    const form = useForm({
        defaultValues: {
            fullname: '',
            email: '',
            password: '',
            retypePassword: '',
            avatar: '',
            gender: '',
            phone: '',
            address: ''
        },
        resolver: yupResolver(schema)
    });
    const { setError } = form;

    const handleSubmit = async (values) => {
        try {
            const {avatar,...rest} = values;
            console.log('🚀 ~ file: index.jsx ~ line 94 ~ handleSubmit ~ values', rest);
            const formData = new FormData();
            formData.append('avatar',values.avatar);
            formData.append('user',JSON.stringify(rest));
            // await authApi.register(formData);
            // setIsSubmit(true);
        } catch (error) {
            setError('email', {
                type: 'server',
                message: error.response.data.message
            });
        }
    };
    return (
        <>
            {isSubmit ? <p>Please verify email before login.You have 3 minutes for confirm!</p> :
                <div className={classes.root}>
                    <form onSubmit={form.handleSubmit(handleSubmit)}>
                        <InputField name="fullname" label="Fullname" form={form} />
                        <InputField name="email" label="Email" form={form} />
                        <PasswordField name="password" label="Your Password" form={form} />
                        <PasswordField name="retypePassword" label="Retype Password" form={form} />
                        <InputField name="address" label="Address" form={form} />
                        <Box sx={{ display: 'flex',justifyContent:'space-between' }}>
                            <InputField name="phone" label="Phone" form={form} />
                            <SelectField name="gender" rows={genders} label="Gender" form={form} />
                        </Box>
                        <UploadFile name="avatar" label="Avatar" form={form} />

                        <Button type="submit" className={classes.hover} sx={{ bgcolor: '#42a5f5', color: 'white' }} fullWidth>
                Create An Account
                        </Button>
                    </form>

                </div>
            }

        </>


    );
};

export default FormRegister;
