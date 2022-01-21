/* eslint-disable react/prop-types */
/* eslint-disable no-new-object */
import PropTypes from 'prop-types';
import { FormHelperText } from '@mui/material';

import React from 'react';
import { Controller } from 'react-hook-form';
import Input from '@mui/material/Input';

import {useState} from 'react';
import Box from '@mui/material/Box';

const InputField = (props) => {
    const { name, form, label, disable ,accept} = props;
    const { formState } = form;
    const { errors } = formState;
    const hasError = errors[name];
    const [urlImage,setUrlImage] = useState('');
   
    return (
        <Box sx={{display: 'flex'}}>
            <Controller
                name={name}
                control={form.control}
                sx={{ diplay:'flex' }}
                render={({ field: {onChange, name}, fieldState: { invalid, error } }) => (
                    <Input
                        sx={{ marginTop: '12px' }}
                        margin="normal"
                        name={name}
                        type="file"
                        onChange={(e) => {
                            const file = e.target.files[0];
                            const preView = URL.createObjectURL(file);
                            setUrlImage(preView);
                            onChange(file);
                        }}
                        accept={accept}
                        label={label}
                        // value={null}
                        disable={disable}
                        error={invalid}
                        helpertext={error?.message}
                    />
            
                )}
            />
            <FormHelperText error={!!hasError}>{errors[name]?.message}</FormHelperText>
            {urlImage && <img src={urlImage} alt="" style={{ width:'200px',height:'130px' }} />} 
        </Box>
    );
};

InputField.propTypes = {
    form: PropTypes.object.isRequired,
    label: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    disable: PropTypes.bool
};

export default InputField;
