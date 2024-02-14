import { User } from "../models/User.model.js";
import { RecoveryToken } from "../models/RecoveryToken.model.js";
import { verifyEmailToken } from "../utils/createAndVerifyTokens.js";
import { sendEmailConfirmation } from "../utils/emailVerification.js";
import { emailConfirmationInfo, passwordResetInfo } from "../utils/emailTemplates.js";
import { generateHash } from "../utils/passport-password.js";

export const signup = (req, res) => {
    res.render('signup');
}

export const signin = (req, res) => {
    res.render('signin');
}

export const dashboard = (req, res) => {
    const confirmed = req.user.confirmed;

    res.render('dashboard', { confirmed });
}

export const logout = (req, res) => {
    req.session.destroy(function (err) {
        res.redirect('/');
    });
}

export const confirmEmail = async (req, res) => {
    let errorMessage = null;
    let successMessage = null;
    try {
        const { token } = req.params;

        const confirmationToken = await verifyEmailToken(token);

        if (!confirmationToken) {
            errorMessage = "The verification token isn't valid";
        } else {
            await User.update({ confirmed: true }, {
                where: { id: confirmationToken.dataValues.userId }
            })

            await RecoveryToken.destroy({
                where: { token: token }
            });

            successMessage = "Your account was confirmed successfully";
        }

        return res.render('confirmation', { successMessage, errorMessage });
    } catch (error) {
        console.log(error);
        req.session.errorMessage = error.message;
        return res.render('confirmation', { successMessage, errorMessage });
    }
}

export const requestConfirmationEmail = async (req, res) => {
    try {
        await sendEmailConfirmation(req.user, emailConfirmationInfo);
        req.session.successMessage = "The confirmation email was sent successfully.";
        res.redirect('/confirmation');
    } catch (error) {
        console.error("Error sending confirmation email:", error);
        req.session.errorMessage = error.message;
        res.redirect('/confirmation');
    }
};

export const renderRequestPasswordRecovery = (req, res) => {
    res.render('requestpasswordrecovery');
}

export const requestPasswordRecovery = async (req, res) => {
    const { email } = req.body;

    let errorMessage = null;
    let successMessage = null;

    try {

        const user = await User.findOne({
            where: {
                email: email
            }
        })

        if (!user) {
            errorMessage = "There's no user with that email"
        } else {
            await sendEmailConfirmation(user, passwordResetInfo);
            successMessage = "The email to recover your password was sent.";
        }

        return res.render('confirmation', { successMessage, errorMessage });
    } catch (error) {
        console.error("Error sending the email:", error);
        errorMessage = error.message;
        return res.render('confirmation', { successMessage, errorMessage });
    }
}

export const renderResetPasswordPage = async (req, res) => {
    const { token } = req.params;
    res.render('resetpassword', { token, errorMessage: null, successMessage: null });
};

export const resetPassword = async (req, res) => {
    const { newPassword } = req.body;
    const { token } = req.params;

    try {

        const recoveryToken = await verifyEmailToken(token); //I don't check the recovery token later because of the verifyEmailToken
        const user = await User.findByPk(recoveryToken.dataValues.userId);

        const hashedPassword = generateHash(newPassword);

        await user.update({ password: hashedPassword });

        const successMessage = "Your password has been reset successfully.";

        return res.render('confirmation', { successMessage, errorMessage: null });
    } catch (error) {
        console.error("Error resetting password:", error);
        const errorMessage = error.message || "An error occurred while resetting your password.";
        res.render('resetpassword', { token, errorMessage, successMessage: null });
    }
}