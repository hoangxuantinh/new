import axiosClient from './axiosClient';

const cartApi = {
    add(data) {
        const url = '/registation';
        return axiosClient.post(url, data);
    },
    getAll() {
        const url = '/registation';
        return axiosClient.get(url);
    },
    getCourseById(id) {
        const url = `/registation/${id}`;
        return axiosClient.get(url);
    },
    remove(id) {
        const url = `/registation/client?id=${id}`;
        return axiosClient.delete(url);
    },
    removeInAdmin({userId,classId}) {
        const url = `/registation?userId=${userId}&classId=${classId}`;
        return axiosClient.delete(url);
    },
    confirmed(data) {
        const url = '/registation/confirmed';
        return axiosClient.post(url, data);
    },
    checkIsRegister() {
        const url = '/registation/check';
        return axiosClient.get(url);
    },
    search(filters) {
        const url = `/registation/filter?${filters}`;
        return axiosClient.get(url);
    }
};

export default cartApi;
