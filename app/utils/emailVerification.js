import { CURRENT_URL, NM_EMAIL } from "../config/config.js";
import { createVerificationToken } from './createAndVerifyTokens.js'
import { transporter } from './transporterNodeMailer.js';

export const sendEmailConfirmation = async (user) => {
    try {
        const recoveryToken = await createVerificationToken(user.id);

        if (!recoveryToken) return false;

        const confirmationLink = `${CURRENT_URL}/confirmemail/${recoveryToken.dataValues.token}`;

        const mailOptions = {
            from: NM_EMAIL,
            to: user.email,
            subject: `Email confirmation`,
            html: `Example mail confirmation : ${confirmationLink}`
        }

        await transporter.sendMail(mailOptions);
        return true;
    } catch (error) {
        console.log(error);
        return false;
    }
}