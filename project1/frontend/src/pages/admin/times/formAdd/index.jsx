/* eslint-disable react/prop-types */
import { yupResolver } from '@hookform/resolvers/yup';
import { Button } from '@mui/material';
import moment from 'moment';
import React from 'react';
import { useForm } from 'react-hook-form';
import * as Yup from 'yup';
import TimeField from '../../../../components/formControl/dateTime';
// import timeApi from '../../../../api/timeApi';


const isSameOrBefore = (startTime, endTime) => {
    return moment(startTime, 'HH:mm').isSameOrBefore(moment(endTime, 'HH:mm'));
};

const schema = Yup.object().shape({
    timeStart: Yup.string()
        .test(
            'not empty',
            'Start time cant be empty',
            function(value) {
                return !!value;
            }
        )
        .test(
            'start_time_test',
            'Start time must be before end time',
            function() {
                const { timeStart,timeEnd } = this.parent;
                return isSameOrBefore(timeStart, timeEnd);
            }
        ),
    timeEnd: Yup.string()
});



// eslint-disable-next-line no-unused-vars
const FormAddTime = ({submit}) => {

    const form = useForm({
        defaultValues: {
            timeStart: '00:00',
            timeEnd: '00:00'
        },
        resolver: yupResolver(schema)
    });
    const { setError } = form;
    const handleSubmit = async (values) => {
        try {
            if(!submit) return;
            submit(values);
        } catch (error) {
            setError('timeEnd', {
                type: 'server',
                message: error
            });
        }
    };

    return (
        <div >
            <form onSubmit={form.handleSubmit(handleSubmit)}>
                <TimeField name="timeStart" label="Time Start"  form={form} />
                <TimeField name="timeEnd"  label="Time End" form={form} />
                <Button type="submit" sx={{ bgcolor: '#42a5f5', color: 'white', marginTop: '8px'}}  fullWidth>
                    Create
                </Button>
            </form>
        </div>
    );
};

export default FormAddTime;
