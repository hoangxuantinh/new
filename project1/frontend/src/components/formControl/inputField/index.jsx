/* eslint-disable react/prop-types */
import { TextField } from '@mui/material';
import PropTypes from 'prop-types';
import React from 'react';
import { Controller } from 'react-hook-form';
import { FormHelperText } from '@mui/material';

const InputField = (props) => {
    const { name, form, label,type} = props;
    const { formState } = form;
    const { errors } = formState;
    const hasError = errors[name];
 
    return (
        <>
            <Controller
                name={name}
                control={form.control}
                render={({ field: {onChange ,  name, value }, fieldState: { invalid, error } }) => (
                    <TextField
                        fullWidth
                        margin="normal"
                        name={name}
                        variant="outlined"
                        type={type}
                        onChange={onChange}
                        value={value}
                        label={label}
                        error={invalid}
                        helpertext={error?.message}
                    />
                )}
            />
            <FormHelperText error={!!hasError}>{errors[name]?.message}</FormHelperText>

        </>
    );
};

InputField.propTypes = {
    form: PropTypes.object.isRequired,
    label: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired
};

export default InputField;
