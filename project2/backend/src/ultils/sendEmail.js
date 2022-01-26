import dotenv from 'dotenv';
import nodemailer from 'nodemailer';
import smtpTransport from 'nodemailer-smtp-transport';

dotenv.config();

const transporter = nodemailer.createTransport(smtpTransport({
    port: 587,
    // service: 'gmail',
    host: 'smtp.gmail.com',
    auth: {
        user: process.env.EMAIL_SERVER,
        pass: process.env.PASSWORD_EMAIL
    }
}));

export default transporter;
