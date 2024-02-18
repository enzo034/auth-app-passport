import expressApp from './app/config/expressConfig.js';
import passportConfig from './app/config/passport/passport.js';
import authRouter from './app/routes/Auth.routes.js'
import { User } from './app/models/User.model.js';
import { RecoveryToken } from './app/models/RecoveryToken.model.js';

// Routes
expressApp.use(authRouter);

// Passport configuration
passportConfig();

// Sync db
async function dbConnect() {
    try {
        await User.sync();
        await RecoveryToken.sync();
    } catch (error) {
        console.log("Unable to connect to the database:", error);
    }
}
dbConnect();

// Home route
expressApp.get('/', (req, res) => {
    res.send(`Welcome to Passport with Sequelize 
        <a href="/signup">Sign up</a>
        <a href="/signin">Sign in</a>`);
});

// Server setup
const PORT = 3000;
expressApp.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
});