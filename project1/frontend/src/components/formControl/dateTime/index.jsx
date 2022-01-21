/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import { TextField } from '@mui/material';
import Stack from '@mui/material/Stack';
import React from 'react';
import { Controller } from 'react-hook-form';
import { FormHelperText } from '@mui/material';

const TimeField = (props) => {
    const { name, form, label , current } = props;
    const { formState } = form;
    const { errors } = formState;
    const hasError = errors[name];

    return (
        <>
            <Controller
                name={name}
                control={form.control}
                render={({ field: {onChange ,  name, value }, fieldState: { invalid, error } }) => (
                    <Stack component="form" noValidate spacing={3}>
                        <TextField
                            id="time"
                            defaultValue={current}
                            type="time"
                            label={label}
                            onChange={(e) => {
                                onChange(e.target.value);
                            }}
                            InputLabelProps={{
                                shrink: true
                            }}
                            inputProps={{
                                step: 300 // 5 min
                            }}
                            sx={{ width: 350,marginTop: '8px' }}
                            error={invalid}
                            helpertext={error?.message}
                        />
                    </Stack>
                )}

            />
            <FormHelperText error={!!hasError}>{errors[name]?.message}</FormHelperText>

        </>
    );
};



export default TimeField;
