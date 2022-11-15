const User = require('../models/users');


module.exports.renderRegister = (req, res) => {
    res.render('users/register')
}

module.exports.register = async (req, res,next) => {
    try {
        const { email, username, password } = req.body;
        const user = new User({ email, username, password });
        const registeredUser = await User.register(user, password);
        req.login(registeredUser, err => {
            if (err) { return next(err); }
            req.flash('success', 'welcome to yelpcamp')
            res.redirect('/campgrounds')
        })
    } catch (e) {
        req.flash('error', e.message)
        res.redirect('/register')
    }
}

module.exports.renderLogin =(req, res) => {
    res.render('users/login');
}

module.exports.login = (req, res) => {
    req.flash('success', 'Good To see you Again!');
    const redirectUrl = req.session.returnTo || '/campgrounds';
    delete req.session.returnTo;
    res.redirect(redirectUrl);
}

module.exports.logout = (req, res) => {
    req.logout(function (err) {
        if (err) { return next(err); }
        req.flash('success', 'See Yaa again!!');
        res.redirect('/campgrounds');
    });
}