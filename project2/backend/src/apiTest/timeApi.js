import axiosClient from './axiosClient';

const timeApi = {
    add(data, config) {
        const url = '/times';
        return axiosClient.post(url, data, {
            headers: {
                ...config
            }
        });
    },
    getAll(config) {
        const url = '/times';
        return axiosClient.get(url, {
            headers: {
                ...config
            }
        });
    },
    getOne(id, config) {
        const url = `/times/${id}`;
        return axiosClient.get(url, {
            headers: {
                ...config
            }
        });
    },
    edit(data, config) {
        const url = `/times/${data.id}`;
        return axiosClient.put(url, data, {
            headers: {
                ...config
            }
        });
    },
    remove(id, config) {
        const url = `/times/${id}`;
        return axiosClient.delete(url, {
            headers: {
                ...config
            }
        });
    }
};

export default timeApi;
