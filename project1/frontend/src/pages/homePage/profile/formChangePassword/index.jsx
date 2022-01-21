/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import { yupResolver } from '@hookform/resolvers/yup';
import { Button } from '@mui/material';
import { makeStyles } from '@mui/styles';
import React from 'react';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';
import PasswordFiedl from '../../../../components/formControl/passwordField';
import authApi from '../../../../api/authApi';
import { useSnackbar } from 'notistack';

const schema = yup
    .object({
        password: yup
            .string()
            .required('Please enter your password')
            .min(6, 'Please enter at leats 6 letters')
            .test('passwordRequirements', 'Password must have number,upper and lower case', (value) =>
                [/[a-z]/, /[A-Z]/, /[0-9]/].every((pattern) => pattern.test(value))
            ),
        newPassword: yup
            .string()
            .required('Please enter new password')
            .min(6, 'Please enter at leats 6 letters')
            .test('passwordRequirements', 'Password must have number,upper and lower case', (value) =>
                [/[a-z]/, /[A-Z]/, /[0-9]/].every((pattern) => pattern.test(value))
            ),
        retypePassword: yup
            .string()
            .required('Please enter your retype password')
            .oneOf([yup.ref('newPassword')], 'Password enter not exactly')
    })
    .required();

const useStyles = makeStyles({
    root: {
        marginTop: '16px',
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
const FormChangePassWord = ({handleShow}) => {
    const classes = useStyles();
    const { enqueueSnackbar, closeSnackbar } = useSnackbar();
    const form = useForm({
        defaultValues: {
            password: '',
            newPassword: '',
            retypePassword: ''
        },
        resolver: yupResolver(schema)
    });
    const { setValue } = form;

    const { setError } = form;
    const handleSubmit = async (values) => {
        try {
            const response = await authApi.changePassword(values);
            handleShow();
            enqueueSnackbar('Change Password Success',{ variant: 'success' });
        } catch (error) {
            setError('password', {
                type: 'server',
                message: error.response.data.message
            });
        }
    };
    return (
        <div className={classes.root}>
            <form onSubmit={form.handleSubmit(handleSubmit)}>
                <PasswordFiedl name="password" label="Old Password"   form={form} />
                <PasswordFiedl name="newPassword" label="New Password"  form={form} />
                <PasswordFiedl name="retypePassword" label="Retype New Password"  form={form} />
                <Button type="submit"  className={classes.hover} sx={{ bgcolor: '#42a5f5', color: 'white' }} >
                       Change Password
                </Button>
            </form>
        </div>
    );
};

export default FormChangePassWord;
