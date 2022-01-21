/* eslint-disable no-restricted-syntax */
export const checkTimeIsExist = (arr) => {
    if (!Array.isArray(arr)) return false;
    const obj = {};
    for (const item of arr) {
        const key = `${item.dayId}${item.timeId}`;
        if (obj[key]) return true;
        obj[key] = true;
    }
    return false;
};
