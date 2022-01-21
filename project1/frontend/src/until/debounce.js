export const debounce = (currentTimeout, callback, time = 1000) => {
    clearTimeout(currentTimeout);
    return setTimeout(callback, time);
};
