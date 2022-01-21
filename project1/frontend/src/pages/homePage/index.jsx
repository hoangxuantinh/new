import React from 'react';
import Header from '../../components/header';
import ContentHomePage from './contentHomePage';
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { getLogin } from '../../redux/slice/userSlice';
import Footer from '../../components/footer';
import timeApi from '../../api/timeApi';

const HomePage = () => {
    const dispatch = useDispatch();

    useEffect(() => {
        (async () => {
            const token = localStorage.getItem('access_token');
            if(!token) return;
            await dispatch(getLogin());
        }
        )();
    }, []);
    useEffect(() => {
        (async () => {
            try {
                const res = await timeApi.remove(20);
                console.log('🚀 ~ file: index.jsx ~ line 24 ~ res', res);

            } catch (error) {
                console.log(error.response);
            }
        }
        )();
    }, []);

    return (
        <React.Fragment>
            <Header />
            <ContentHomePage/>
            <Footer/>
        </React.Fragment>
    );
};

export default HomePage;
