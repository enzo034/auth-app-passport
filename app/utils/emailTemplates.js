import { CURRENT_URL } from "../config/config.js";

export const emailConfirmationInfo = {
    emailSubject: 'Email confirmation',
    html: `Example mail confirmation : ${CURRENT_URL}/confirmemail/{{token}}`,
};

export const passwordResetInfo = {
    emailSubject: 'Password reset',
    html: `Example mail password reset : ${CURRENT_URL}/resetpassword/{{token}}`,
};