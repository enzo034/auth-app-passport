import { signup, signin, logout, dashboard } from '../controllers/authController.js';
import { Router } from 'express'
import passport from 'passport';
import { isLoggedIn } from '../middlewares/auth.middlewares.js';

const router = Router();

router.get('/signup', signup);
router.get('/signin', signin);

router.get('/logout', logout);

router.get('/dashboard', isLoggedIn, dashboard);

router.post('/signup', passport.authenticate('local-signup', {
    successRedirect: '/dashboard',
    failureRedirect: '/signup'
}
));

router.post('/signin', passport.authenticate('local-signin', {
    successRedirect: '/dashboard',
    failureRedirect: '/signin'
}
));

export default router;