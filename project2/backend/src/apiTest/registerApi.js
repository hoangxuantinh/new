import axiosClient from './axiosClient';

const registerApi = {
    add(data, config) {
        const url = '/registation';
        return axiosClient.post(url, data, {
            headers: {
                ...config
            }
        });
    },
    getAll(config) {
        const url = '/registation';
        return axiosClient.get(url, {
            headers: {
                ...config
            }
        });
    },
    remove(id, config) {
        const url = `/registation/client?id=${id}`;
        return axiosClient.delete(url, {
            headers: {
                ...config
            }
        });
    },
    removeInAdmin(data, config) {
        const url = `/registation?userId=${data.userId}&classId=${data.classId}`;
        return axiosClient.delete(url, {
            headers: {
                ...config
            }
        });
    },
    confirmed(data, config) {
        const url = '/registation/confirmed';
        return axiosClient.post(url, data, {
            headers: {
                ...config
            }
        });
    },
    checkIsRegister(config) {
        const url = '/registation/check';
        return axiosClient.get(url, {
            headers: {
                ...config
            }
        });
    },
    search(filters, config) {
        const url = `/registation/filter?${filters}`;
        return axiosClient.get(url, {
            headers: {
                ...config
            }
        });
    }
};

export default registerApi;
