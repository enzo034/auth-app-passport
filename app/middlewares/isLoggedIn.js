export const isLoggedIn = (req, res, next) => {
    console.log("User: ", req.user);
    if (req.isAuthenticated()) {
        
        return next();
    }

    res.redirect('/signin');
}
