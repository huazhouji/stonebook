var user = require('./controllers/user');
var site = require('./controllers/site');

module.exports = function (app) {

    // home page
    app.get('/', site.index);

};