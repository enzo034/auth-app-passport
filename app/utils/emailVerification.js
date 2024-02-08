import { CURRENT_URL, NM_EMAIL } from "../config/config.js";
import { createVerificationToken, verifyEmailToken } from './createAndVerifyTokens.js'
import { transporter } from './transporterNodeMailer.js';

export const sendEmailConfirmation = async (user) => {
    try {
        console.log("SendEmailConfirmation");
        const recoveryToken = await createVerificationToken(user.userId);

        if(!recoveryToken) return false;

        const confirmationLink = `${CURRENT_URL}/resetpassword/${recoveryToken}`;

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