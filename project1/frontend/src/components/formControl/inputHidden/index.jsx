/* eslint-disable react/prop-types */
import { TextField } from '@mui/material';
import PropTypes from 'prop-types';
import React from 'react';
import { Controller } from 'react-hook-form';
import { FormHelperText } from '@mui/material';

const InputHidden = (props) => {
    const { name, form,type, label} = props;
    const { formState } = form;
    const { errors } = formState;
    const hasError = errors[name];

    return (
        <>
            <Controller
                name={name}
                control={form.control}
                render={({ field: {onChange ,  name, value }, fieldState: { invalid } }) => (
                    <TextField
                        type={type}
                        name={name}
                        sx={{ height: '0px', display: props.d_none ? 'none' : 'inherit' }}
                        label={label}
                        onChange={onChange}
                        value={value}
                        error={invalid}
                    />
                )}
            />
            <FormHelperText error={!!hasError}>{errors[name]?.message}</FormHelperText>

        </>
    );
};

InputHidden.propTypes = {
    form: PropTypes.object.isRequired,
    label: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired
};

export default InputHidden;
