import axiosClient from './axiosClient';

const authApi = {
    register(data) {
        const url = '/auth/register';
        return axiosClient.post(url, data, { headers: data.getHeaders() });
    },
    registerConfirm(data) {
        const url = '/auth/register/verify-email';
        return axiosClient.post(url, data);
    },
    login(data) {
        const url = '/auth/login';
        return axiosClient.post(url, data);
    },
    getLogin(config) {
        const url = '/auth/get-login';
        return axiosClient.get(url, {
            headers: {
                ...config
            }
        });
    },
    logout(config) {
        const url = '/auth/logout';
        return axiosClient.delete(url, {
            headers: {
                ...config
            }
        });
    },
    changePassword(data, config) {
        const url = '/auth/change-password';
        return axiosClient.post(url, data, {
            headers: {
                ...config
            }
        });
    },
    changeProfile(data, config) {
        const url = '/auth/change-profile';
        return axiosClient.post(url, data, {
            headers:
            {
                ...data.getHeaders(),
                ...config
            }
        });
    }
};

export default authApi;
