module.exports = {
	loggerConfig: {
		level: 'debug',
	},
	serverConfig: {
		apiPort        : 8080,
		controllerPath : './src/controllers',
		docPath        : '../docs/swagger.json',
		apiDocPath     : 'api-docs',
		uiDocPath      : 'docs',
		reverseProxyUrl: '/v1.0',
	},
	redisConfig : {
		host: 'localhost',
		port: 32768,
	},
};
