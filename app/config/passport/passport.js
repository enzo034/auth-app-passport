import { User } from '../../models/User.model.js';
import passport from 'passport';
import { Strategy as LocalStrategy } from 'passport-local';
import { isValidPassword, generateHash } from '../../utils/passport-password.js';
import { sendEmailConfirmation } from '../../utils/emailVerification.js';
import { GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET } from '../config.js';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import { emailConfirmationInfo } from '../../utils/emailTemplates.js';

export default () => {

    //serialize 
    passport.serializeUser((user, done) => {
        done(null, user.id);
    });

    // deserialize user 
    passport.deserializeUser(async (id, done) => {
        try {
            const user = await User.findByPk(id);
            if (!user) {
                return done(new Error('User not found'), null);
            }
            done(null, user.get());
        } catch (error) {
            done(error, null);
        }
    });

    passport.use('local-signup', new LocalStrategy(
        {
            usernameField: 'email',
            passwordField: 'password',
            passReqToCallback: true // allows us to pass back the entire request to the callback
        },
        async (req, email, password, done) => {
            const user = await User.findOne({
                where: {
                    email: email
                }
            });
            if (user) {
                return done(null, false, {
                    message: 'That email is already taken'
                });
            } else {
                var userPassword = generateHash(password);
                var data =
                {
                    email: email,
                    password: userPassword,
                    firstname: req.body.firstname,
                    lastname: req.body.lastname
                };
                const newUser = await User.create(data);

                await sendEmailConfirmation(newUser, emailConfirmationInfo);

                if (!newUser) {
                    return done(null, false);
                }
                if (newUser) {
                    return done(null, newUser);
                }
            }
        }
    ));

    //LOCAL SIGNIN 
    passport.use('local-signin', new LocalStrategy(
        {
            // by default, local strategy uses username and password, we will override with email 
            usernameField: 'email',
            passwordField: 'password',
            passReqToCallback: true // allows us to pass back the entire request to the callback 
        },
        async (req, email, password, done) => {
            try {
                const user = await User.findOne({
                    where: {
                        email: email
                    }
                })
                if (!user) {
                    return done(null, false, {
                        message: 'Email does not exist'
                    });
                }
                if (!isValidPassword(user.password, password)) {
                    return done(null, false, {
                        message: 'Incorrect password.'
                    });
                }
                
                if (user.twoFactorEnabled) {
                    req.flash('2faRequired', '2FA verification required');
                    return done(null, user);
                }
                
                return done(null, user.get());
            } catch (error) {
                console.log("Error:", error);
                return done(null, false, {
                    message: 'Something went wrong with your Signin'
                });
            }
        }
    ));

    passport.use(new GoogleStrategy({
        clientID: GOOGLE_CLIENT_ID,
        clientSecret: GOOGLE_CLIENT_SECRET,
        callbackURL: "http://localhost:3000/auth/google/callback"
    },
        async (accessToken, refreshToken, profile, done) => {
            try {
                let user = await User.findOne({ where: { email: profile.emails[0].value } });

                if (user) {
                    // If exists, returns the user
                    return done(null, user);
                } else {
                    // If not, we create it in the bd
                    user = await User.create({
                        firstname: profile.name.givenName,
                        lastname: profile.name.familyName,
                        email: profile.emails[0].value,
                    });

                    // Return the created user
                    return done(null, user);
                }
            } catch (error) {
                return done(error, null);
            }
        }
    ));
}