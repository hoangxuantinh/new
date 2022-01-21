import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import { FormHelperText } from '@mui/material';
import FormControl from '@mui/material/FormControl';
import IconButton from '@mui/material/IconButton';
import InputAdornment from '@mui/material/InputAdornment';
import InputLabel from '@mui/material/InputLabel';
import OutlinedInput from '@mui/material/OutlinedInput';
import PropTypes from 'prop-types';
import { React, useState } from 'react';
import { Controller } from 'react-hook-form';

PasswordField.propTypes = {
    form: PropTypes.object.isRequired,
    name: PropTypes.string.isRequired,
    label: PropTypes.string,
    disable: PropTypes.bool
};

function PasswordField(props) {
    const { name, form, disable, label } = props;
    const [showPassword, setShowPassword] = useState(false);
    const handleClickShowPassword = () => {
        setShowPassword((x) => !x);
    };
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
                        <OutlinedInput
                            id={name}
                            type={showPassword ? 'text' : 'password'}
                            name={name}
                            value={value}
                            label={label}
                            error={invalid}
                            disable={disable}
                            onChange={onChange}
                            helpertext={error?.message}
                            endAdornment={
                                <InputAdornment position="end">
                                    <IconButton aria-label="toggle password visibility" onClick={handleClickShowPassword} edge="end">
                                        {showPassword ? <Visibility /> : <VisibilityOff />}
                                    </IconButton>
                                </InputAdornment>
                            }
                        />
                    )}
                />
                <FormHelperText error={!!hasError}>{errors[name]?.message}</FormHelperText>
            </FormControl>
        </>
    );
}

export default PasswordField;
