/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import { FormHelperText } from '@mui/material';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import PropTypes from 'prop-types';
import * as React from 'react';
import { Controller } from 'react-hook-form';
import { useTheme } from '@mui/material/styles';
import { useFieldArray } from 'react-hook-form';

SelectMutiple.propTypes = {
    form: PropTypes.object.isRequired,
    name: PropTypes.string.isRequired,
    label: PropTypes.string
};
function getStyles(name, personName, theme) {
    return {
        fontWeight:
        personName.indexOf(name) === -1
            ? theme.typography.fontWeightRegular
            : theme.typography.fontWeightMedium
    };
}

function SelectMutiple(props) {
    const { name, form,  label,rows } = props;
    const { control } = form;
    const { fields, append, remove } = useFieldArray({
        control,
        name: name
    });

    const theme = useTheme();
    const [personName, setPersonName] = React.useState([]);
    const handleChange = (event) => {
        const {
            target: { value }
        } = event;
        setPersonName(
            // On autofill we get a the stringified value.
            typeof value === 'string' ? value.split(',') : value
        );
    };
    const ITEM_HEIGHT = 48;
    const ITEM_PADDING_TOP = 8;
    const MenuProps = {
        PaperProps: {
            style: {
                maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
                width: 250
            }
        }
    };
    const { formState } = form;
    const { errors } = formState;
    const hasError = errors[name];
   

    function getStyles(name, personName, theme) {
        return {
            fontWeight:
            personName.indexOf(name) === -1
                ? theme.typography.fontWeightRegular
                : theme.typography.fontWeightMedium
        };
    }

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
                            id={value}
                            sx={{width: '190px'}}
                            value={personName}
                            multiple
                            onChange={(e) => {
                                handleChange(e);
                                onChange(e.target.value);
                            }}
                        >
                            {rows.map((record) => (
                                <MenuItem
                                    key={record.id}
                                    value={record.id}
                                    style={getStyles(name, personName, theme)}
                                >
                                    {record.name ? record.name : `${record.timeStart}-${record.timeEnd}`}
                                </MenuItem>
                            ))}
          
                        </Select>
                    )}
                />
                <FormHelperText error={!!hasError}>{errors[name]?.message}</FormHelperText>
            </FormControl>
        </>
    );
}

export default SelectMutiple;
