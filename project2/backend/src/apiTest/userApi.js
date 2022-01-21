import axiosClient from './axiosClient';

const userApi = {
    getAll(params) {
        const url = `/users?${params}`;
        return axiosClient.get(url);
    },
    detail(id, config) {
        const url = `/users/${id}`;
        return axiosClient.get(url, {
            headers: {
                ...config
            }
        });
    },
    getProperty() {
        const url = '/users/featutes';
        return axiosClient.get(url);
    },
    add(data, config) {
        const url = '/users';
        return axiosClient.post(url, data, {
            headers: {
                ...data.getHeaders(),
                ...config
            }
        });
    },
    edit(data, config) {
        const url = `/users/${data.id}`;
        return axiosClient.put(url, data.formData, {
            headers: {
                ...data.formData.getHeaders(),
                ...config
            }
        });
    },
    remove(id, config) {
        console.log('🚀 ~ file: userApi.js ~ line 35 ~ remove ~ config', config);
        const url = `/users/${id}`;
        return axiosClient.delete(url, {
            headers: {
                ...config
            }
        });
    },
    getUserByClassId(id) {
        const url = `/users/class/${id}`;
        return axiosClient.get(url);
    }
};

export default userApi;
