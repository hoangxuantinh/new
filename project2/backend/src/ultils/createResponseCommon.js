const createResponseCommon = async (fn) => {
    try {
        return await fn;
    } catch (error) {
        return error.response || error;
    }
};
export default createResponseCommon;
