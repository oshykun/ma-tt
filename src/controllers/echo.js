exports.echoAtTime = async function(req, res, next) {
	let error;
	try {
		const diManager   = req.app.moonactive.diManager;
		const messageData = req.swagger.params.echoData.value;

		const logger = diManager.getValue('logger');
		logger.info(messageData.message);
		logger.info(messageData.datetime);

		const messageService = diManager.getValue('messageService');
		await messageService.scheduleMessageToPrint(messageData);
		// const { m1, m2 }     = await messageService.scheduleMessageToPrint(messageData);
		// console.log(m1);
		// console.log(m2);

		res.status(204).end();
	} catch (err) {
		error = err;
	} finally {
		next(error);
	}
};
