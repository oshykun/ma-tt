let config        = process.env.NODE_ENV === 'production'
    ? require('./prod')
    : require('./dev');
config.swaggerDoc = require(config.serverConfig.docPath);

module.exports = config;
