class MessageService {
	constructor(logger, repositoryFacade) {
		this._logger           = logger;
		this._repositoryFacade = repositoryFacade;
		this._logger.debug(`${MessageService.name} - constructor`);
	}

	async pushMessage(messageData) {
		this._logger.debug(`${this.constructor.name} - pushMessage`);
		return this._repositoryFacade.messages.addMessageInQueue(messageData);
	}

	async getMessage(messageKey) {
		this._logger.debug(`${this.constructor.name} - getMessage`);
		return this._repositoryFacade.messages.getMessageByKey(messageKey);
	}
}

MessageService.diProperties = { name: 'messageService', type: 'class', singleton: true };
MessageService.inject       = ['logger', 'repositoryFacade'];

module.exports = MessageService;
