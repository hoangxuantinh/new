import axiosClient from './axiosClient';

const classApi = {
    pagination(params) {
        const url = `/classes?${params}`;
        return axiosClient.get(url);
    },
    loadMore(params) {
        const url = `/classes/all?${params}`;
        return axiosClient.get(url);
    },
    getFeatures() {
        const url = '/classes/features';
        return axiosClient.get(url);
    },
    getOne(id) {
        const url = `/classes/${id}`;
        return axiosClient.get(url);
    },
    add(data) {
        const url = '/classes';
        return axiosClient.post(url,data);
    },
    edit(id,data) {
        const url = `/classes/${id}`;
        return axiosClient.put(url,data);
    },
    remove(id) {
        const url = `/classes/${id}`;
        return axiosClient.delete(url);
    }
};

export default classApi;
