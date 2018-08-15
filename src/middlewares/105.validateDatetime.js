const moment = require('moment');

module.exports = (app, { config: { serverConfig } }) => {
	app.use(`${serverConfig.reverseProxyUrl}/echoAtTime`, (req, res, next) => {
		const { datetime, message } = req.swagger.params.echoData.value;
		const momentDate            = moment(datetime);
		if (!momentDate.isValid()) {
			return next(new Error('Validation error: Mandatory param \'datetime\' must have UTC format.'));
		}
		if (momentDate.valueOf() <= Date.now()) {
			const diManager = req.app.moonactive.diManager;
			const logger    = diManager.getValue('logger');
			return logger.info(`MESSAGE: ${JSON.stringify(message)}`);
		}
		return next();
	});
};
