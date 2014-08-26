var config = {
    port: 3000,

    redishost: '127.0.0.1',
    redisport: 6379,

    db: 'test',
    dbhost: '127.0.0.1',
    dbuser: 'root',
    dbpwd: '123456',

    session_secret: 'stonebook_dev',
    debug: true
};

module.exports = config;
module.exports.config = config;