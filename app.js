if(process.env.NODE_ENV !== "production"){
    require('dotenv').config();
}

const express = require('express')
const app = express();
const path = require('path');
const mongoose = require('mongoose');
const ejsMate = require('ejs-mate');
const session = require('express-session');
const flash = require('connect-flash')
const ExpressError = require('./Utilities/ExpressError');
const methodOverride = require('method-override');
const passport = require('passport');
const LocalStrategy = require('passport-local');
const User = require('./models/users')
const mongoSanitize = require('express-mongo-sanitize');
const MongoStore = require('connect-mongo');




const userRoutes = require('./routes/usersAuth');
const campgroundRoutes = require('./routes/campgrounds');
const reviewRoutes = require('./routes/reviews');

const dbUrl = process.env.DB_URL || 'mongodb://localhost:27017/yelpcamp';

mongoose.connect(dbUrl);

app.engine('ejs', ejsMate);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));
app.use(express.static(path.join(__dirname, 'public')))
app.use(mongoSanitize({
    replaceWith: '_'
}));

const secret = process.env.SECRET || 'KingOfThePirates'

app.use(session({
    secret,
    saveUninitialized: false,
    resave: false,
    store: MongoStore.create({
        mongoUrl: dbUrl,
        touchAfter: 24 * 3600
    })
  }));

const sessionConfig = {
    secret,
    resave: true,
    saveUninitialized: true,
    cookie: {
        httpOnly: true,
        expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
        maxAge: 1000 * 60 * 60 * 24 * 7
    }
}
app.use(session(sessionConfig))
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


app.use((req, res, next) => {
    res.locals.currentUser = req.user;
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    next();
})


app.use('/',userRoutes)
app.use('/campgrounds', campgroundRoutes)
app.use('/campgrounds/:id/reviews', reviewRoutes)


app.get('/', (req, res) => {
    res.render('home')
});

app.all('*', (req, res, next) => {
    next(new ExpressError('Page not Found', 404))
})

//error handler
app.use((err, req, res, next) => {
    const { statuscode = 500, message = 'Something went wrong' } = err;
    if (!err.message) err.message = 'Oh No,Something went wrong!'
    res.status(statuscode).render('error', { err });

})

const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Serving on port ${port}`)
})  