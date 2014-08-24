var path = require('path');
var express = require('express');
var session = require('express-session');
var passport = require('passport');
require('./models');
var routes = require('./routes');
var auth = require('./middlewares/auth');
var MongoStore = require('connect-mongo')(session);
var _ = require('lodash');
var csurf = require('csurf');
var compress = require('compression');
var bodyParser = require('body-parser');
var config = require('./config');

var staticDir = path.join(__dirname, 'public');

var app = express();

app.engine('html', require('swig').renderFile);

app.set('view engine', 'html');
app.set('views', path.join(__dirname, 'views'));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(require('method-override')());
app.use(require('cookie-parser')(config.session_secret));
app.use(compress());
app.use(session({
    secret: config.session_secret,
    key: 'sid',
    store: new MongoStore({
        db: config.db_name
    }),
    resave: true,
    saveUninitialized: true
}));

app.use(passport.initialize());

// custom middleware
//app.use(require('./controllers/sign').auth_user);
app.use(auth.blockUser());

app.use('/public', express.static(staticDir));

if (!config.debug) {
    app.use(csurf());
    app.set('view cache', true);
}

_.assign(app.locals, {
    config: config
});

app.use(function (req, res, next) {
    res.locals.csrf = req.csrfToken ? req.csrfToken() : '';
    next();
});

// routes
routes(app);

// error handler
app.use(function (err, req, res, next) {
    return res.send(500, err.message);
});

var server = app.listen(3000, function () {
    console.log('Listening on port %d', server.address().port);
});
