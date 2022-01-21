import axiosClient from './axiosClient';

const timeApi = {
    add(data) {
        const url = '/times';
        return axiosClient.post(url, data);
    },
    edit(data) {
        const url = `/times/${data.id}`;
        return axiosClient.put(url, data);
    },
    remove(id) {
        const url = `/times/${id}`;
        return axiosClient.delete(url);
    },
    getOne(id) {
        const url = `/times/${id}`;
        return axiosClient.get(url);
    },
    getAll() {
        const url = '/times';
        return axiosClient.get(url);
    }
};

export default timeApi;
