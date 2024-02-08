import passport from 'passport';
import session from 'express-session';
import { engine } from 'express-handlebars';
import { User } from './app/models/User.model.js';
import { RecoveryToken } from './app/models/RecoveryToken.model.js';
import authRouter from './app/routes/auth.js'
import express, { urlencoded, json } from 'express';
var app = express();

app.use(urlencoded({
    extended: true
})
);
app.use(json());

// For Passport 
app.use(session({
    secret: 'keyboard cat',
    resave: true,
    saveUninitialized: true
})); // session secret 

app.use(passport.initialize());
app.use(passport.session()); // persistent login sessions

//For Handlebars 
app.set('views', './app/views');
app.engine('hbs', engine({
    extname: '.hbs',
    defaultLayout: false,
    layoutsDir: "views/layouts/"
}));
app.set('view engine', '.hbs');

//Routes
app.use(authRouter);

//load passport strategies 
import passportConfig from './app/config/passport/passport.js'
passportConfig();

//Sync Database 
async function dbConnect() {
    try {
        await User.sync();
        await RecoveryToken.sync();
    } catch (error) {
        console.log("Unable to connect to the db : ", error);
    }
}
dbConnect();

app.get('/', function (req, res) {
    res.send('Welcome to Passport with Sequelize');
});

app.listen(3000, function (err) {
    if (!err)
        console.log("Server listening on port 3000");
    else console.log(err)
});