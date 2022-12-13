if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config();
}
//require('dotenv').config();

//console.log(process.env.SECRET);

const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const ejsMate = require('ejs-mate');
const methodOverride = require('method-override');
const ExpressError = require('./utils/ExpressError');
const mongoSanitize = require('express-mongo-sanitize');
const helmet = require('helmet');

const session = require('express-session');
const flash = require('connect-flash');
const passport = require('passport');
const LocalStrategy = require('passport-local');
const User = require('./models/user');

const userRoutes = require('./routes/users');
const campgroundRoutes = require('./routes/campgrounds');
const reviewRoutes = require('./routes/reviews');

const MongoDBStore = require("connect-mongo")(session);

//const dbUrl = process.env.DB_URL;
const dbUrl = process.env.DB_URL || 'mongodb://localhost:27017/yelp-camp';


const secret = process.env.SECRET || 'thisissecret';
//#region Connecting to the database
mongoose.connect(dbUrl, {
    useNewUrlParser: true,
    //useCreateIndex: true,
    // useUnifiedTopology: true,
    //useFindAndModify: false
});

const db = mongoose.connection;
db.on("Error", console.error.bind(console, "Connection Error:"));
db.once("open", () => {
    console.log("Database connected");
})
//#endregion

const app = express();

//#region Configuration for app
app.engine('ejs', ejsMate);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
//#endregion


//#region Midleware
app.use(express.urlencoded({ extended: true })); //This code use to express not pass the body. Body content will included in req.body
app.use(methodOverride('_method'));
app.use(express.static(path.join(__dirname, 'public')));
app.use(mongoSanitize());

//#endregion

//#region Helmet settings
const scriptSrcUrls = [
    "https://stackpath.bootstrapcdn.com/",
    "https://api.tiles.mapbox.com/",
    "https://api.mapbox.com/",
    "https://kit.fontawesome.com/",
    "https://cdnjs.cloudflare.com/",
    "https://cdn.jsdelivr.net",
    "https://api.mapbox.com/mapbox-gl-js/v2.10.0/mapbox-gl.js",
];
const styleSrcUrls = [
    "https://kit-free.fontawesome.com/",
    "https://stackpath.bootstrapcdn.com/",
    "https://api.mapbox.com/",
    "https://api.tiles.mapbox.com/",
    "https://fonts.googleapis.com/",
    "https://use.fontawesome.com/",
    "https://cdn.jsdelivr.net",
    "https://api.mapbox.com/mapbox-gl-js/v2.10.0/mapbox-gl.css",
];
const connectSrcUrls = [
    "https://api.mapbox.com/",
    "https://a.tiles.mapbox.com/",
    "https://b.tiles.mapbox.com/",
    "https://events.mapbox.com/",
    "https://api.mapbox.com/mapbox-gl-js",
    "https://res.cloudinary.com/dqfqvkdou/",
];
const fontSrcUrls = [];
app.use(
    helmet.contentSecurityPolicy({
        crossOriginEmbedderPolicy: false,
        directives: {
            defaultSrc: [],
            connectSrc: ["'self'", ...connectSrcUrls],
            scriptSrc: ["'unsafe-inline'", "'self'", ...scriptSrcUrls],
            styleSrc: ["'self'", "'unsafe-inline'", ...styleSrcUrls],
            workerSrc: ["'self'", "blob:"],
            objectSrc: [],
            imgSrc: [
                "'self'",
                "blob:",
                "data:",
                "https://res.cloudinary.com/dqfqvkdou/", //SHOULD MATCH YOUR CLOUDINARY ACCOUNT! 
                "https://images.unsplash.com/",
            ],
            fontSrc: ["'self'", ...fontSrcUrls],
        },
    })
);

//#endregion

//#region  Session Config
const store = new MongoDBStore({
    url: dbUrl,
    secret,
    touchAfter: 24 * 60 * 60,
});

store.on("error", function (e) {
    console.log("SESSION STORE ERROR", e);
})

const sessionConfig = {
    store,
    name: 'session',
    secret,
    resave: false,
    saveUninitialized: true,
    cookies: {
        httpOnly: true,
        //secure: true,
        expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
        maxAge: 1000 * 60 * 60 * 24 * 7
    }
}
app.use(session(sessionConfig));
app.use(flash());
//#endregion

//#region Passport (User-Password control midleware) - App.use(passport) must be after app.use(session)
app.use(passport.initialize());
app.use(passport.session()); //If our application uses persistent login session, we need this line
passport.use(new LocalStrategy(User.authenticate()));

//How passport store and unstore the password
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
//#endregion

// app.use(helmet({
//     contentSecurityPolicy: false,
//     referrerPolicy: { policy: "no-referrer" },
// }));

app.use((req, res, next) => {
    console.log(req.query);
    if (!['/login', '/register', '/'].includes(req.originalUrl)) {
        req.session.returnTo = req.originalUrl;
    }

    res.locals.currentUser = req.user;
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');

    //console.log(req.session.returnTo);
    next();
});

app.use('/', userRoutes);
app.use('/campgrounds', campgroundRoutes);
app.use('/campgrounds/:id/reviews', reviewRoutes);

app.get('/', (req, res) => {
    res.render('home');
});





app.all('*', (req, res, next) => {
    next(new ExpressError('Page not found', 404));
});

app.use((err, req, res, next) => {
    const { statusCode = 500 } = err;
    if (!err.message) { err.message = 'Oh no, Something went wrong!' }
    res.status(statusCode).render('error', { err });
});

app.listen(3000, () => {
    console.log('Serving on port 3000');
})