import bcrypt from 'bcryptjs';
import { User } from '../../models/user.js';
import passport from 'passport';
import { Strategy as LocalStrategy } from 'passport-local';

export default () => {

    //serialize 
    passport.serializeUser(function (user, done) {
        done(null, user.id);
    });

    // deserialize user 
    passport.deserializeUser(function (id, done) {
        User.findByPk(id).then(function (user) {
            if (user) {
                done(null, user.get());
            } else {
                done(user.errors, null);
            }
        });
    });

    passport.use('local-signup', new LocalStrategy(
        {
            usernameField: 'email',
            passwordField: 'password',
            passReqToCallback: true // allows us to pass back the entire request to the callback
        },
        async (req, email, password, done) => {
            var generateHash = (password) => {
                return bcrypt.hashSync(password, genSaltSync(8), null);
            };
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
                var userPassword = bcrypt.hashSync(password, 10);
                var data =
                {
                    email: email,
                    password: userPassword,
                    firstname: req.body.firstname,
                    lastname: req.body.lastname
                };
                const newUser = await User.create(data);

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
                var isValidPassword = (userpass, password) => {
                    return bcrypt.compareSync(password, userpass);
                }
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
                var userinfo = user.get();
                return done(null, userinfo);
            } catch (error) {
                console.log("Error:", err);
                return done(null, false, {
                    message: 'Something went wrong with your Signin'
                });
            }
        }
    ));
}