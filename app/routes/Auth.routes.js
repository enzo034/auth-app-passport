import {
    signup,
    signin,
    logout,
    dashboard,
    confirmEmail,
    requestConfirmationEmail,
    requestPasswordRecovery,
    resetPassword,
    renderResetPasswordPage,
    renderRequestPasswordRecovery
}
    from '../controllers/Auth.controller.js';
import { Router } from 'express'
import passport from 'passport';
import { isLoggedIn } from '../middlewares/isLoggedIn.js';
import { validateDataSignup, validateDataSignin } from '../middlewares/validateData.js';
import csrf from 'csurf';

const router = Router();

const csrfProtection = csrf({cookie: true});

router.use(csrfProtection);

router.get('/signup', signup);
router.get('/signin', signin);

router.get('/logout', logout);

router.get('/dashboard', isLoggedIn, dashboard);

router.post('/signup', validateDataSignup, passport.authenticate('local-signup', {
    successRedirect: '/dashboard',
    failureRedirect: '/signup'
}
));

router.post('/signin', validateDataSignin, passport.authenticate('local-signin', {
    successRedirect: '/dashboard',
    failureRedirect: '/signin'
}
));

router.get('/auth/google',
    passport.authenticate('google', { scope: ['profile', 'email'] }));

router.get('/auth/google/callback',
    passport.authenticate('google', { failureRedirect: '/error' }),
    (req, res) => {
        res.redirect('/dashboard');
    });

router.get('/confirmemail/:token', confirmEmail);

router.post('/requestconfirmationemail', isLoggedIn, requestConfirmationEmail);

router.get('/confirmation', isLoggedIn, (req, res) => {
    const successMessage = req.session.successMessage;
    const errorMessage = req.session.errorMessage;

    delete req.session.successMessage;
    delete req.session.errorMessage;

    res.render('confirmation', { successMessage, errorMessage });
});

router.get('/requestpasswordrecovery', renderRequestPasswordRecovery);
router.post('/requestpasswordrecovery', requestPasswordRecovery);

router.get('/resetpassword/:token', renderResetPasswordPage);
router.post('/resetpassword/:token', resetPassword);

export default router;