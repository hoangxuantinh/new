/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import { FormHelperText } from '@mui/material';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import PropTypes from 'prop-types';
import { React } from 'react';
import { Controller } from 'react-hook-form';

PasswordField.propTypes = {
    form: PropTypes.object.isRequired,
    name: PropTypes.string.isRequired,
    label: PropTypes.string,
    disable: PropTypes.bool
};

function PasswordField(props) {


    const { name, form,  label,rows } = props;

    const { formState } = form;
    const { errors } = formState;
    const hasError = errors[name];

    return (
        <>
            <FormControl margin="normal" error={hasError} fullWidth variant="outlined">
                <InputLabel htmlFor={name}>{label}</InputLabel>
                <Controller
                    label={label}
                    name={name}
                    control={form.control}
                    render={({ field: { onChange, name, value }, fieldState: { invalid, error } }) => (
                        <Select
                            labelId="demo-simple-select-label"
                            id={value}
                            sx={{width: '50%'}}
                            value={value}
                            onChange={onChange}
                            selected='fdfgfgfg'
                        >
                            {rows && rows.length > 0 && rows.map(record => (
                                <MenuItem key={record} value={record}>{record}</MenuItem>
                            ))}

                        </Select>
                    )}
                />
                <FormHelperText error={!!hasError}>{errors[name]?.message}</FormHelperText>
            </FormControl>
        </>
    );
}

export default PasswordField;
