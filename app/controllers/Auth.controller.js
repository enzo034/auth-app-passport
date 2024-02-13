import { User } from "../models/User.model.js";
import { RecoveryToken } from "../models/RecoveryToken.model.js";
import { verifyEmailToken } from "../utils/createAndVerifyTokens.js";
import { sendEmailConfirmation } from "../utils/emailVerification.js";
import { emailConfirmationInfo, passwordResetInfo } from "../utils/emailTemplates.js";

export const signup = (req, res) => {
    res.render('signup');
}

export const signin = (req, res) => {
    res.render('signin');
}

export const dashboard = (req, res) => {
    res.render('dashboard');
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

export const requestPasswordRecovery = async (req, res) => {
    const { email } = req.body;

    try {

        const user = await User.findOne({
            where: {
                email: email
            }
        })

        if (!user) {
            req.session.errorMessage = "There's no user with that email"
        } else {
            await sendEmailConfirmation(user, passwordResetInfo);
            req.session.successMessage = "The email to recover your password was sent.";
        }

        res.redirect('/confirmation');
    } catch (error) {
        console.error("Error sending confirmation email:", error);
        req.session.errorMessage = error.message;
        res.redirect('/confirmation');
    }
}
