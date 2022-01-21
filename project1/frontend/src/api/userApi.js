import axiosClient from './axiosClient';

const userApi = {
    getAll(params) {
        const url = `/users?${params}`;
        return axiosClient.get(url);
    },
    detail(id) {
        const url = `/users/${id}`;
        return axiosClient.get(url);
    },
    getProperty() {
        const url = '/users/featutes';
        return axiosClient.get(url);
    },
    add(data) {
        const url = '/users';
        return axiosClient.post(url,data);
    },
    edit(data) {
        const url = `/users/${data.id}`;
        return axiosClient.put(url,data.formData);
    },
    remove(id) {
        const url = `/users/${id}`;
        return axiosClient.delete(url);
    },
    getUserByClassId(id) {
        const url = `/users/class/${id}`;
        return axiosClient.get(url);
    }
};

export default userApi;

