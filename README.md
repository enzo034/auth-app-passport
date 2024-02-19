# Authentication Application Security Documentation

## Introduction
This documentation outlines the security measures implemented in the authentication application to safeguard user data and privacy.

## Security Features

### User Authentication and Registration
- Utilizes Passport.js for user authentication, supporting both local strategies and OAuth 2.0 with Google.
- Requires email verification during user registration to validate provided email addresses.
- Offers the option for users to request a confirmation email from the application menu if they fail to confirm their email during registration.

### Password Reset
- Allows users to securely reset their password through a process that includes email verification.
- Sends a confirmation email with a secure link for resetting the user's password.

### Two-Factor Authentication (2FA)
- Optional two-factor authentication for users, implemented using the Speakeasy library.
- Users can enable or disable 2FA from the application menu.
- 2FA is required for sensitive actions like password changes or security settings.

### Protection against CSRF and XSS
- Implements CSRF tokens to prevent cross-site request forgery (CSRF) attacks.
- Utilizes proper validation and escaping of user input data to prevent cross-site scripting (XSS) attacks.

### Helmet Protection
- Uses the Helmet package to configure HTTP security policies, including Content Security Policy (CSP) and Strict-Transport-Security (HSTS), to mitigate known vulnerabilities.

## Technologies Used
- Node.js
- Express.js
- MySQL
- ORM: Sequelize
- Helmet

## Dependencies
- bcryptjs
- csurf
- express
- express-handlebars
- express-session
- joi
- nodemailer
- passport
- qrcode
- sequelize
- speakeasy

## Environment Variables
- GOOGLE_CLIENT_ID: Client ID for Google OAuth 2.0 authentication
- GOOGLE_CLIENT_SECRET: Client secret for Google OAuth 2.0 authentication
- DB_NAME: Name of the actual database
- DB_USERNAME: Your database username
- DB_HOST: Location of your database
- DB_PASSWORD: Your database password
- CURRENT_URL: The current URL of the application (e.g., "http://localhost:*port*")
- NM_EMAIL: Nodemailer email for sending emails
- NM_PASSWORD: Nodemailer password for authentication (requires 2FA if using Google)


