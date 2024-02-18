import express from 'express';
import session from 'express-session';
import { engine } from 'express-handlebars';
import cookieParser from 'cookie-parser';
import passport from 'passport';
import flash from 'express-flash';
import csrf from 'csurf';

const app = express();

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(session({
    secret: 'keyboard cat',
    resave: true,
    saveUninitialized: true
}));
app.use(cookieParser());
app.use(csrf({ cookie: true }));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());

// Handlebars setup
app.set('views', './app/views');
app.engine('hbs', engine({
    extname: '.hbs',
    defaultLayout: false,
    layoutsDir: 'views/'
}));
app.set('view engine', '.hbs');

export default app;