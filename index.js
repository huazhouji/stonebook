var path = require('path');
var express = require('express');
var session = require('express-session');
var passport = require('passport');
require('./models');
var routes = require('./routes');
var auth = require('./middlewares/auth');
var RedisStore = require('connect-redis')(session);
var _ = require('lodash');
var csurf = require('csurf');
var compress = require('compression');
var bodyParser = require('body-parser');
var config = require('./config');
require('mkdirp').sync('./logs');
require('log4js').configure('log4js.json', { cwd: 'logs' });

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
    name: 'sid',
    store: new RedisStore({
        host: config.redishost,
        port: config.redisport
    }),
    saveUninitialized: true,
    resave: true
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
    return res.status(500).send(err.message);
});

var server = app.listen(3000, function () {
    console.log('Listening on port %d', server.address().port);
});
