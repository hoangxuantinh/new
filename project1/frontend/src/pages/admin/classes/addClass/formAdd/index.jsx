/* eslint-disable indent */
/* eslint-disable react/jsx-key */
/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import { yupResolver } from '@hookform/resolvers/yup';
import { Box, Button } from '@mui/material';
import { makeStyles } from '@mui/styles';
import  React from 'react';
import { useEffect, useState} from 'react';
import { useForm,useFieldArray } from 'react-hook-form';
import { useHistory } from 'react-router-dom';
import * as yup from 'yup';
import classApi from '../../../../../api/classApi';
import UploadFile from '../../../../../components/formControl/fileUpload';
import InputField from '../../../../../components/formControl/inputField';
import {PATH} from '../../../../../constants/Path';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';

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
        ,
        avatar : yup.mixed().required('Please select avatar')
            .test(
                'fileType',
                'Incorrect file type',
                (file) =>
                    file && ['image/png', 'image/jpg', 'image/jpeg'].includes(file.type)
            )
    })
    .required();

const useStyles = makeStyles({
    hover: {
        '&:hover': {
            backgroundColor: '#1de9b6 !important'
        }
    }
});
const FormAddClass = (props) => {
    const history = useHistory();
    const classes = useStyles();
    const form = useForm({
        defaultValues: {
            name: '',
            avatar: '',
            description: '',
            maxNumber: '',
            currentNumber: '',
            periods: ''
        },
        resolver: yupResolver(schema)
    });

    const [timeList,setTimeList] =  useState([]);
    const [day,setDay] =  useState([]);
    useEffect(() => {
        (async () => {
            const {dayOfWeeks,timeList} = await classApi.getFeatures();
            setTimeList(timeList);
            setDay(dayOfWeeks);
        })();
    }, []);

    const { setError } = form;
    const handleSubmit = async (values) => {
        try {
            const { avatar,totalPeriod,...rest } = values;
            const formData = new FormData();
            formData.append('avatar',values.avatar);
            formData.append('newClass',JSON.stringify(rest));
            await classApi.add(formData);
            history.replace(PATH.FILE);

        } catch (error) {
            console.log('🚀 ~ file: index.jsx ~ line 95 ~ handleSubmit ~ error', error.response.data.message);
            if(error.response.status === 403) {
                history.replace(PATH.FORBIDEN);
            }
            setError('name', {
                type: 'server',
                message: error.response.data.message
            });
        }

    };
    const {
      control,
      formState,
      register,
      watch
    } = form;
    const { errors } = formState;
    const { fields, append, remove } = useFieldArray({ name: 'periods', control });
    const totalPeriod = watch('totalPeriod');

    useEffect(() => {
      const currentVal = parseInt(totalPeriod || 0);
      const prevVal = fields.length;
      if (currentVal > prevVal) {
        for (let i = prevVal; i < currentVal; i++) {
          append({});
        }
      } else {
        for (let i = prevVal; i > currentVal; i--) {
          remove(i - 1);
        }
      }
    }, [totalPeriod]);
    return (
        <div >
            <form onSubmit={form.handleSubmit(handleSubmit)}>
                <InputField name="name" label="Name Class" form={form} />
                <InputField name="description" label="Description" form={form} />
                <InputField name="currentNumber" label="Current Studemt" form={form} />
                <InputField name="maxNumber" label="Max Student" form={form} />
                <UploadFile name="avatar" labal="avatar"  accept="image/*"  form={form}  />
                <FormControl sx={{marginTop: '18px'}} fullWidth>
                     <InputLabel id="demo">Chọn Số Khung Giờ Muốn Thêm </InputLabel>
                      <Select
                        name="totalPeriod"
                        {...register('totalPeriod')}
                        label="Chọn số khung giờ muốn thêm"
                      >
                        {[1, 2, 3, 4, 5].map((i) => (
                          <MenuItem key={i} value={i}>
                            {i}
                          </MenuItem>
                        ))}
                      </Select>
                  </FormControl>
              {fields.map((item, i) => (
                <Box key={i} sx={{display: 'flex',width: '70%'}}>
                  <FormControl sx={{marginTop: '18px'}} fullWidth>
                     <InputLabel id="demo" >Chọn thứ</InputLabel>
                      <Select
                         name={`periods[${i}]dayId`}
                      {...register(`periods.${i}.dayId`)}
                      sx={{width: '40%'}}
                      >
                        {day.map((item,index) => (
                          <MenuItem key={item.id} value={item.id}>
                            {item.name}
                          </MenuItem>
                        ))}
                      </Select>
                  </FormControl>
                  <FormControl sx={{margin: '18px 0'}} fullWidth>
                     <InputLabel id="demo">Chọn Khung Giờ </InputLabel>
                      <Select
                         name={`periods[${i}]timeId`}
                         {...register(`periods.${i}.timeId`)}
                        sx={{width: '40%'}}

                        label="Chọn số khung giờ muốn thêm"
                      >
                        {timeList.map((item,index) => (
                          <MenuItem key={item.id} value={item.id}>
                            {`${item.timeStart}-${item.timeEnd}`}
                          </MenuItem>
                        ))}
                      </Select>
                  </FormControl>
                  <Button type="button"  onClick={() => remove(i)}>Delete</Button>
                </Box>
              ))}

                <Button type="submit"  className={classes.hover} sx={{ bgcolor: '#42a5f5', color: 'white',margin: '12px 0' }} fullWidth>
          Create New Class
                </Button>
            </form>


        </div>
    );
};

export default FormAddClass;
