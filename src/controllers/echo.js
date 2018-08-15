exports.echoAtTime = async function(req, res, next) {
	let error;
	try {
		const diManager   = req.app.moonactive.diManager;
		const messageData = req.swagger.params.echoData.value;

		const logger = diManager.getValue('logger');
		logger.debug(`Received message data: ${JSON.stringify(messageData)}`);

		const messageService = diManager.getValue('messageService');
		await messageService.scheduleMessageToPrint(messageData);

		logger.debug(`Message data: ${JSON.stringify(messageData)}}, successfully scheduled.`);
		res.status(204).end();
	} catch (err) {
		error = err;
	} finally {
		next(error);
	}
};
