import appRoot from 'app-root-path';
import { createLogger, transports } from 'winston';

// instantiate a new Winston Logger with the settings defined above
const logger = createLogger({
    level: 'debug',
    transports: [
        new transports.File({
            filename: `${appRoot}/src/logs/app.log`
        })
    ]
});

export default logger;
