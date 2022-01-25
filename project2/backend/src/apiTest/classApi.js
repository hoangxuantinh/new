import axiosClient from './axiosClient';

const classApi = {
    getFeatures(config) {
        const url = '/classes/features';
        return axiosClient.get(url, {
            headers: { ...config }
        });
    },
    getOne(id, config) {
        const url = `/classes/${id}`;
        return axiosClient.get(url, {
            headers: { ...config }
        });
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
