import express from 'express';
import session from 'express-session';
import { engine } from 'express-handlebars';
import cookieParser from 'cookie-parser';
import passport from 'passport';
import flash from 'express-flash';
import csrf from 'csurf';
import helmet from 'helmet';
import sequelize from './db/connection.js';
import storeBuilder from 'connect-session-sequelize';

const app = express();

//Session store config
const SequelizeStore = storeBuilder(session.Store);
const store = new SequelizeStore({
    db: sequelize
});

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(
    session({
      secret: 'keyboard cat', // Secret to sign the session
      resave: false, 
      saveUninitialized: false, 
      store: store, // Usamos la instancia previamente creada
      cookie: {
        maxAge: 24 * 60 * 60 * 1000, //1 day
        secure: false,
        httpOnly: true,
      },
    })
);

// Sincronizamos la sesión con la base de datos
store.sync();

// Otros middlewares...
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
