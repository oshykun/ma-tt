exports.echoAtTime = async function(req, res, next) {
	let error;
	try {
		const diManager   = req.app.moonactive.diManager;
		const messageData = req.swagger.params.echoData.value;

		let logger = diManager.getValue('logger');
		logger.info(messageData.message);
		logger.info(messageData.datetime);

		let messageService = diManager.getValue('messageService');
		await messageService.pushMessage(messageData);
		const message = await messageService.getMessage(messageData.datetime);

		logger.info(message);

		res.status(200).send(message);
	} catch (err) {
		error = err;
	} finally {
		next(error);
	}
};
