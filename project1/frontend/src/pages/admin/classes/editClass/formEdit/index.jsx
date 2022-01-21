/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import { yupResolver } from '@hookform/resolvers/yup';
import { Box, Button } from '@mui/material';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import { makeStyles } from '@mui/styles';
import React, { useEffect, useState } from 'react';
import { useFieldArray, useForm } from 'react-hook-form';
import { useHistory } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';
import * as yup from 'yup';
import classApi from '../../../../../api/classApi';
import UploadFile from '../../../../../components/formControl/fileUpload';
import InputField from '../../../../../components/formControl/inputField';
import { PATH } from '../../../../../constants/Path';
import InputHidden from '../../../../../components/formControl/inputHidden';


const schema = yup
    .object({
        name: yup
            .string()
            .required('Please enter yourname'),
        description: yup
            .string()
            .required('Please enter your password')
        ,
        currentNumber: yup
            .number()
            .typeError('you must specify a number')
        ,
        maxNumber: yup
            .number()
            .typeError('you must specify a number')
            .test('compare', 'Max student must greate or squal current student', function() {
                const { currentNumber,maxNumber } = this.parent;
                return maxNumber >= currentNumber;
            })
    })
    .required();


const useStyles = makeStyles({
    hover: {
        '&:hover': {
            backgroundColor: '#1de9b6 !important'
        }
    }
});
// eslint-disable-next-line react/prop-types
const FormEditClass = ({data}) => {
    const history = useHistory();
    const classes = useStyles();

    const [classTimes, setClassTimes] =  useState([]);
    const form = useForm({
        defaultValues: {
            name: '',
            avatar: '',
            description: '',
            maxNumber: '',
            currentNumber: ''
        },
        resolver: yupResolver(schema)
    });
    const { setValue } = form;
    useEffect(() => {
        if(data.name){
            setValue('name', data.name);
            setValue('avatar', data.avatar);
            setValue('description', data.description);
            setValue('maxNumber', data.maxNumber);
            setValue('currentNumber', data.currentNumber);
        }

        if(data.id){
            const nextClassTimes = [];
            data.days.forEach(day => {
                day.times.forEach(time => {
                    const newT ={
                        id: uuidv4(),
                        timeId: time.timeId,
                        dayId: day.dayId
                    };
                    nextClassTimes.push(newT);
                });
            });
            setClassTimes(nextClassTimes);
        }

    }, [data]);
    const [dateTimes,setDateTimes] =  useState({
        times: [],
        days: []
    });


    useEffect(() => {
        (async () => {
            const {dayOfWeeks, timeList} = await classApi.getFeatures();
            setDateTimes({
                times: timeList,
                days: dayOfWeeks
            });
        })();
    }, []);


    const { setError } = form;
    const handleSubmit = async (values) => {
        try {
            values.id = data.id;
            const { avatar, totalPeriod ,...rest} = values;
            const formData = new FormData();
            formData.append('avatar',values.avatar);
            formData.append('classEdit',JSON.stringify({...rest, periods: [...classTimes]}));
            await classApi.edit(data.id,formData);
            history.replace(PATH.FILE);
        } catch (error) {
            if(error.response.status === 403) {
                history.replace(PATH.FORBIDEN);
            }
            setError('hidden', {
                type: 'server',
                message: error.response.data.message
            });
        }
    };

    const handleAddClassTime = () => {
        setClassTimes([...classTimes, {id: uuidv4(), timeId: '', dayId: ''}]);
    };

    const handleRemoveClassTime = (classTimeId) => {
        setClassTimes(classTimes.filter(classTime=>classTime.id !== classTimeId));
    };

    const handleChangeClassTime = (classTimeId, name, value) => {
        const classTimeIndex = classTimes.findIndex(classTime => classTime.id === classTimeId);
        const nextClassTime = {
            ...classTimes[classTimeIndex],
            [name]: value
        };
        const nextClassTimes = [...classTimes];
        nextClassTimes.splice(classTimeIndex, 1, nextClassTime);
        setClassTimes(nextClassTimes);
    };


    const renderClassTimes = () => classTimes.map(classTime => {

        return (<Box key={classTime.id} sx={{display: 'flex',width: '70%'}}>
            <FormControl sx={{marginTop: '18px'}} fullWidth>
                <InputLabel id="demo" >Chọn thứ</InputLabel>
                <Select
                    value={classTime.dayId}
                    onChange={(e)=> handleChangeClassTime(classTime.id, 'dayId', e.target.value)}
                    sx={{width: '40%'}}
                >
                    {dateTimes.days.map((item) => (
                        <MenuItem key={item.id} value={item.id}>
                            {item.name}
                        </MenuItem>
                    ))}
                </Select>
            </FormControl>
            <FormControl sx={{margin: '18px 0'}} fullWidth>
                <InputLabel id="demo">Chọn Khung Giờ </InputLabel>
                <Select
                    value={classTime.timeId}
                    onChange={(e)=> handleChangeClassTime(classTime.id, 'timeId', e.target.value)}
                    sx={{width: '40%'}}
                    label="Chọn số khung giờ muốn thêm"
                >
                    {dateTimes.times.map((item) => (
                        <MenuItem key={item.id} value={item.id}>
                            {`${item.timeStart}-${item.timeEnd}`}
                        </MenuItem>
                    ))}
                </Select>
            </FormControl>
            <Button type="button"  onClick={() => handleRemoveClassTime(classTime.id)}>Delete</Button>
        </Box>);
    });

    const {
        control,
        formState,
        register,
        watch
    } = form;
    const { fields, append, remove } = useFieldArray({ name: 'periods', control });

    return (
        <div >
            <form onSubmit={form.handleSubmit(handleSubmit)}>
                <InputField name="name" label="Name Class" form={form} />
                <InputField name="description" label="Description" form={form} />
                <InputField name="currentNumber" label="Current Studemt" form={form} />
                <InputField name="maxNumber" label="Max Student" form={form} />
                {renderClassTimes()}
                <InputHidden name="hidden" type="hidden" form={form} d_none />
                <Button onClick={handleAddClassTime}>Thêm khung giờ</Button>
                <UploadFile name="avatar" labal="avatar"  accept="image/*"  form={form}  />

                <Button type="submit"  className={classes.hover} sx={{ bgcolor: '#42a5f5', color: 'white', marginTop: '12px' }}>
          Update
                </Button>
            </form>
        </div>
    );
};

export default FormEditClass;
