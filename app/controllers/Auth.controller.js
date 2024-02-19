import { User } from "../models/User.model.js";
import { RecoveryToken } from "../models/RecoveryToken.model.js";
import { verifyEmailToken } from "../utils/createAndVerifyTokens.js";
import { sendEmailConfirmation } from "../utils/emailVerification.js";
import { emailConfirmationInfo, passwordResetInfo } from "../utils/emailTemplates.js";
import { generateHash } from "../utils/passport-password.js";
import speakeasy from 'speakeasy';
import qrcode from 'qrcode'
import passport from 'passport';

export const signup = (req, res) => {
    res.render('signup', { csrfToken: req.csrfToken() });
}

export const signin = (req, res) => {
    res.render('signin', { csrfToken: req.csrfToken() });
}

export const signinPost = (req, res, next) => {
    passport.authenticate('local-signin', (err, user, info) => {
        if (err) { return next(err); }
        if (!user) { return res.redirect('/signin'); }

        if (req.flash('2faRequired').length > 0) {
            req.session.userId = user.id;
            return res.redirect('/verify-2fa');
        }

        req.login(user, (err) => {
            if (err) { return next(err); }
            return res.redirect('/dashboard');
        });
    })(req, res, next);
}

export const googleOAuth = (req, res, next) => {
    passport.authenticate('google', (err, user, info) => {
        if (err) { return next(err); }
        if (!user) { return res.redirect('/error'); }

        if (user.twoFactorEnabled) {
            req.session.userId = user.id;
            return res.redirect('/verify-2fa');
        } else {
            req.login(user, (err) => {
                if (err) { return next(err); }
                return res.redirect('/dashboard');
            });
        }
    })(req, res, next);
}

export const verify2fa = (req, res) => {
    res.render('verify-2fa', { csrfToken: req.csrfToken() });
}

export const dashboard = (req, res) => {
    const confirmed = req.user.confirmed;
    const qrCodeUrl = req.session.qrUrl;
    const qrDisabled = req.session.qrDisabled;

    delete req.session.qrUrl;
    delete req.session.qrDisabled;

    res.render('dashboard', { confirmed, qrCodeUrl, qrDisabled, csrfToken: req.csrfToken() });
}

export const logout = (req, res) => {
    req.session.destroy(function (err) {
        res.redirect('/');
    });
}

export const changeUserState2fa = async (req, res) => {
    try {
        const userId = req.user.id;
        const user = await User.findByPk(userId);

        if (!user) {
            return res.status(400).send('User not found');
        }

        if (user.twoFactorEnabled) {
            user.twoFactorEnabled = false;
            user.twoFactorSecret = null;

            req.session.qrDisabled = "You disabled 2FA. Remember that if you activate it again you will have to scan the new QR Code"
        } else {
            user.twoFactorEnabled = true;

            const secret = speakeasy.generateSecret({ length: 20 });
            const secretBase32 = secret.base32;

            user.twoFactorSecret = secretBase32;

            const qrCodeUrl = speakeasy.otpauthURL({
                secret: secret.ascii,
                label: 'Authentication test',
                issuer: 'Authentication test'
            });

            qrcode.toDataURL(qrCodeUrl, (err, dataUrl) => {
                if (err) {
                    console.log('Error generating the QR: ', err);
                } else {
                    req.session.qrUrl = dataUrl;
                }
            });
        }

        await user.save();

        res.redirect('/dashboard');
    } catch (error) {
        console.error('Error changing 2FA status:', error);
        res.status(500).send('Internal Server Error');
    }
}

export const verify2faCode = async (req, res) => {
    const { code } = req.body;
    const user = await User.findByPk(req.session.userId);
    req.session.userId = null;

    if (!user || !code) {
        req.flash('errorMessage', 'Invalid request.');
        return res.redirect('/signin');
    }

    const verified = speakeasy.totp.verify({
        secret: user.dataValues.twoFactorSecret,
        encoding: 'base32',
        token: code
    });

    if (!verified) {
        req.flash('errorMessage', 'Invalid verification code.');
        return res.render('verify-2fa', { errorMessage: req.flash('errorMessage'), csrfToken: req.csrfToken() });
    }

    req.login(user, (err) => {
        if (err) {
            console.error('Error logging in user:', err);
            return res.redirect('/signin');
        }
        return res.redirect('/dashboard');
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
    res.render('requestpasswordrecovery', { csrfToken: req.csrfToken() });
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
    res.render('resetpassword', { token, errorMessage: null, successMessage: null, csrfToken: req.csrfToken() });
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
        res.render('resetpassword', { token, errorMessage, successMessage: null, csrfToken: req.csrfToken() });
    }
}

export const confirmationController = (req, res) => {
    const successMessage = req.session.successMessage;
    const errorMessage = req.session.errorMessage;

    delete req.session.successMessage;
    delete req.session.errorMessage;

    res.render('confirmation', { successMessage, errorMessage });
}