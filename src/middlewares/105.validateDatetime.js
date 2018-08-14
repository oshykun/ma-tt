const moment = require('moment');


module.exports = (app, { config: { serverConfig } }) => {
	app.use(`${serverConfig.reverseProxyUrl}/echoAtTime`, (req, res, next) => {
		const { datetime } = req.swagger.params.echoData.value;
		const isValidDate  = moment(datetime).isValid();
		if (!isValidDate) {
			return next(new Error('Validation error: Mandatory param \'datetime\' must have UTC format.'));
		}
		return next();
	});
};
