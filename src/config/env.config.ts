import dotenv from 'dotenv';

dotenv.config();

export const config = {
	port: process.env.PORT || 3000,
	origin: 'https://projet-apis.herokuapp.com/',
	NODE_ENV: process.env.NODE_ENV || 'development',
	JWT_SECRET: process.env.JWT_SECRET || '',
	//CORS_ORIGIN: 'http://localhost:' + (process.env.PORT || 3000),
	COOKIE_DOMAIN: 'localhost',
	DB_URL: process.env.DATABASE_URL,
	//SESSION_SECRET: process.env.SESSION_SECRET||'',
	EMAIL_USERNAME: process.env.EMAIL_USERNAME,
	EMAIL_PASSWORD: process.env.EMAIL_PASSWORD
};
