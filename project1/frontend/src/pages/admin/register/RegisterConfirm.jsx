/* eslint-disable react/prop-types */
import authApi  from '../../../api/authApi';
import { useEffect, useState } from 'react';
import queryString from 'query-string';
import { useHistory } from 'react-router-dom';
import { PATH } from '../../../constants/Path';
import { useSnackbar } from 'notistack';
const RegsiterConfirm = ({history}) => {
    const { enqueueSnackbar } = useSnackbar();
    const browserHistory = useHistory();
    const [message,setMassage] = useState('Confirm Register');

    useEffect(() => {
        const { id, token } = queryString.parse(history.location.search);
        const verifyEmail = async () => {
            try {
                // eslint-disable-next-line no-unused-vars
                const reponse = await authApi.registerConfirm({id,token});
                browserHistory.push(PATH.LOGIN);
                enqueueSnackbar('Verify Email Success.Please login');
            } catch (error) {
                setMassage(error.response.data.message);
            }
        };
        verifyEmail();

    }, []);
    return (
        // eslint-disable-next-line react/react-in-jsx-scope
        <h1>{message}</h1>
    );
};

export default RegsiterConfirm;
