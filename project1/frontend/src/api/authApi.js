import axiosClient from './axiosClient';

const authApi = {
    register(data) {
        const url = '/auth/register';
        return axiosClient.post(url, data);
    },
    registerConfirm(data) {
        const url = '/auth/register/verify-email';
        return axiosClient.post(url,data);
    },
    login(data) {
        const url = '/auth/login';
        return axiosClient.post(url, data);
    },
    getLogin() {
        const url = '/auth/get-login';
        return axiosClient.get(url);
    },
    logout() {
        const url = '/auth/logout';
        return axiosClient.delete(url);
    },
    changePassword(data) {
        const url = '/auth/change-password';
        return axiosClient.post(url, data);
    },
    changeProfile(data) {
        const url = '/auth/change-profile';
        return axiosClient.post(url, data);
    }
};

export default authApi;

