import nodemailer from 'nodemailer';
import { NM_EMAIL, NM_PASSWORD } from '../config/config.js';

export const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: NM_EMAIL,
        pass: NM_PASSWORD,
    },
});