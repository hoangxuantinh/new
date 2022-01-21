/* eslint-disable react/prop-types */
import React from 'react';
import { LockOutlined } from '@mui/icons-material';
import { Avatar, Button, Typography } from '@mui/material';
import InputField from '../../../components/formControl/inputField';
import PasswordField from '../../../components/formControl/passwordField';
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from 'react-hook-form';
import { PATH } from '../../../constants/Path';
import { Link } from 'react-router-dom';
import { makeStyles } from '@mui/styles';
import * as yup from 'yup';


const schema = yup
    .object({
        email: yup
            .string()
            .required('Please enter your email')
            .email('This field must be Email'),
        password: yup
            .string()
            .required('Please enter your password')
            .min(6, 'Please enter at leats 6 letters')
            .test('passwordRequirements', 'Password must have number,upper and lower case', (value) =>
                [/[a-z]/, /[A-Z]/, /[0-9]/].every((pattern) => pattern.test(value))
            )
    })
    .required();

const useStyles = makeStyles({
    root: {
        marginTop: '68px',
        marginRight: '18px',
        textAlign: 'center'
    },
    avatar: {
        width: '100%',
        margin: '0 auto'
    },
    link: {
        marginTop: '12px ',
        display: 'block'
    },
    hover: {
        '&:hover': {
            backgroundColor: '#1de9b6 !important'
        }
    }
});

const FormLogin = ({submit}) => {
    const classes = useStyles();
    const form = useForm({
        defaultValues: {
            email: '',
            password: ''
        },
        resolver: yupResolver(schema)
    });
    const { setError } = form;

    const handleSubmit = async (values) => {
        try {
            if (!submit) return;
            await submit(values);
        }
        catch (error) {
            // error from server
            setError('password', {
                type: 'server',
                message: error
            });
        }
    };
    return (
        <div className={classes.root}>
            <Avatar className={classes.avatar}>
                <LockOutlined></LockOutlined>
            </Avatar>
            <Typography component="h1" variant="h5">
        Login
            </Typography>
            <form onSubmit={form.handleSubmit(handleSubmit)}>
                <InputField name="email" label="Email" form={form} />
                <PasswordField name="password" label="Your Password" form={form} />
                <Button type="submit" sx={{ bgcolor: '#42a5f5', color: 'white' }} className={classes.hover} fullWidth>
          Sign In
                </Button>
                <Link to={PATH.REGISTER} className={classes.link}>
          Dont have an account? Sign Up
                </Link>
            </form>
        </div>
    );
};

export default FormLogin;
