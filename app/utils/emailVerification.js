import { CURRENT_URL, NM_EMAIL } from "../config/config.js";
import { createVerificationToken } from './createAndVerifyTokens.js'
import { transporter } from './transporterNodeMailer.js';

export const sendEmailConfirmation = async (user, tokenInfo) => {
    try {
        const token = await createVerificationToken(user.id);

        if (!token) {
            throw new Error("Unable to create token");
        }

        const { emailSubject, html } = tokenInfo;

        // Replace {{token}} in the template
        const htmlWithToken = html.replace('{{token}}', token.dataValues.token);

        const mailOptions = {
            from: NM_EMAIL,
            to: user.email,
            subject: emailSubject,
            html: htmlWithToken,
        };

        await transporter.sendMail(mailOptions);

        return true;
    } catch (error) {
        console.log("Error sending the email:", error);
        throw new Error(error.message);
    }
};