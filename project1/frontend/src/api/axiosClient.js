import axios from 'axios';

const axiosClient = axios.create({
    baseURL: 'http://localhost:8888/api/v1/' ,
    headers: {
        'Content-Type': 'application/json'
    }
});

axiosClient.interceptors.request.use(
    function (config) {
        const token = localStorage.getItem('access_token');
        config.headers.Authorization =  token ? `Bearer ${token}` : '';
        return config;
    },
    function (error) {
        return Promise.reject(error);
    }
);

axiosClient.interceptors.response.use(
    function (response) {

        return response.data;
    },
    function (error) {
        return Promise.reject(error);
    }
);
export default axiosClient;
