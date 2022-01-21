// eslint-disable-next-line import/no-extraneous-dependencies
import redis from 'redis';

export const client = redis.createClient();
const connectRedis = () => {
    client.on('connect', () => {
        console.log('Client connected to redis...');
    });

    client.on('ready', () => {
        console.log('Client connected to redis and ready to use...');
    });

    client.on('error', (err) => {
        console.log(err.message);
    });

    client.on('end', () => {
        console.log('Client disconnected from redis');
    });
};

export default connectRedis;
