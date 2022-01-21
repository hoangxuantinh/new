/* eslint-disable no-undef */
import fs from 'fs/promises';
import path from 'path';
import { format } from 'date-fns';

const filename = path.join(__dirname, '../logs', 'log.log');
const logEvent = async (message) => {
    const dateTime = `${format(new Date(), 'dd-MM-yyyy\tss:mm:HH')}`;
    const contentLog = `${dateTime}---${message}\n`;
    try {
        fs.appendFile(filename, contentLog);
    } catch (error) {
        console.error(error);
    }
};

export default logEvent;
