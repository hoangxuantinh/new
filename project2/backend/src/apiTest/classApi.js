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
    getFeatures(config) {
        const url = '/classes/features';
        return axiosClient.get(url, {
            headers: { ...config }
        });
    },
    getOne(id) {
        const url = `/classes/${id}`;
        return axiosClient.get(url);
    },
    add(data, config) {
        const url = '/classes';
        return axiosClient.post(url, data, {
            headers: {
                ...data.getHeaders(),
                ...config
            }
        });
    },
    edit(id, data, config) {
        const url = `/classes/${id}`;
        return axiosClient.put(url, data, {
            headers: {
                ...data.getHeaders(),
                ...config
            }
        });
    },
    remove(id, config) {
        const url = `/classes/${id}`;
        return axiosClient.delete(url, {
            headers: { ...config }
        });
    }
};

export default classApi;
