import cron from 'node-cron';
import appRoot from 'app-root-path';

const initCronJob = (config) => {
    Object.keys(config).forEach((key) => {
        if (cron.validate(config[key].frequency)) {
            cron.schedule(config[key].frequency, () => {
                // eslint-disable-next-line global-require
                const handler = require(`${appRoot}/src/${config[key].handler}`);
                handler();
            });
        }
    });
};

export default initCronJob;
