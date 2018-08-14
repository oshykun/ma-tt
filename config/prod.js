module.exports = {
	loggerConfig: {
		level: 'info',
	},
	serverConfig: {
		apiPort        : process.env.MA_SERVER_PORT,
		controllerPath : './src/controllers',
		docPath        : '../docs/swagger.json',
		apiDocPath     : 'api-docs',
		uiDocPath      : 'docs',
		reverseProxyUrl: '/v1.0',
	},
	redisConfig : {
		host: process.env.REDIS_HOST,
		port: process.env.REDIS_PORT,
	},
};
