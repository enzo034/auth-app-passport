export function signup (req, res) {
    res.render('signup');
}

export function signin(req, res) {
    res.render('signin');
}

export function dashboard(req, res) {
    res.render('dashboard');
}

export function logout(req, res) {
    req.session.destroy(function(err) {
        res.redirect('/');
    });
}