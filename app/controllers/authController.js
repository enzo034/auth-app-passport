import { User } from "../models/User.model.js";
import { RecoveryToken } from "../models/RecoveryToken.model.js";
import { verifyEmailToken } from "../utils/createAndVerifyTokens.js";
import { sendEmailConfirmation } from "../utils/emailVerification.js";

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
    try {
        const { token } = req.params;

        const confirmationToken = await verifyEmailToken(token);

        if (!confirmationToken) {
            return res.status(400).json({ message: 'Invalid or expired confirmation link' });
        }

        await User.update({ confirmed: true }, {
            where: { id: confirmationToken.dataValues.userId }
        })

        await RecoveryToken.destroy({
            where: { token: token }
        });

    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Server error", error });
    }
}

export const requestConfirmationEmail = async (req, res) => {
    try {
        console.log("Sending confirmation email...");
        const success = await sendEmailConfirmation(req.user);
        
        if (success) {
            console.log("Confirmation email sent successfully.");
            req.session.successMessage = "The confirmation email was sent successfully.";
        } else {
            console.log("Error sending confirmation email.");
            req.session.errorMessage = "There was an error sending the confirmation email.";
        }

        console.log("Redirecting to confirmation page...");
        res.redirect('/confirmation');
    } catch (error) {
        console.error("Error sending confirmation email:", error);
        res.status(500).send("An error occurred on the server.");
    }
};
