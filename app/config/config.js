import dotenv from 'dotenv';

dotenv.config();

export const DB_NAME = process.env.DB_NAME;
export const DB_USERNAME = process.env.DB_USERNAME;
export const DB_PASSWORD = process.env.DB_PASSWORD;
export const DB_HOST = process.env.DB_HOST;
export const NM_EMAIL = process.env.NM_EMAIL;
export const NM_PASSWORD = process.env.NM_PASSWORD;
export const CURRENT_URL = process.env.CURRENT_URL;
export const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
export const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;