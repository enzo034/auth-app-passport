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
    renderRequestPasswordRecovery,
    changeUserState2fa
}
    from '../controllers/Auth.controller.js';
import { Router } from 'express'
import passport from 'passport';
import { isLoggedIn } from '../middlewares/isLoggedIn.js';
import { validateDataSignup, validateDataSignin } from '../middlewares/validateData.js';
import csrf from 'csurf';

const router = Router();

const csrfProtection = csrf({ cookie: true });

//router.use(csrfProtection);

router.get('/signup', signup);
router.get('/signin', signin);

router.get('/logout', logout);

router.get('/dashboard', isLoggedIn, dashboard);

router.post('/signup', validateDataSignup, passport.authenticate('local-signup', {
    successRedirect: '/dashboard',
    failureRedirect: '/signup'
},));

router.post('/2fa', isLoggedIn, changeUserState2fa);

router.post('/signin', validateDataSignin, (req, res, next) => {
    passport.authenticate('local-signin', (err, user, info) => {
        if (err) { return next(err); }
        if (!user) { return res.redirect('/signin'); }

        if (req.flash('2faRequired').length > 0) {
            return res.redirect('/verify-2fa');
        }

        req.login(user, (err) => { 
            if (err) { return next(err); }
            return res.redirect('/dashboard');
        });
    })(req, res, next);
});


router.get('/verify-2fa', (req, res)=>{
    res.render('verify-2fa');
})

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