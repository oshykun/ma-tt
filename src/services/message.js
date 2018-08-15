const uuidv4 = require('uuid/v4');

class MessageService {
	constructor(logger, repositoryFacade) {
		this._logger           = logger;
		this._repositoryFacade = repositoryFacade;
		this._QUEUE_PREFIX     = 'queue_';
		this._QUEUE_KEY        = 'QUEUE_KEY';
		this._KEY_PATTERN      = /^queue_(.*)/;
		this._logger.debug(`${MessageService.name} - constructor`);
	}

	async pushMessage(messageData) {
		this._logger.debug(`${this.constructor.name} - pushMessage`);
		return this._repositoryFacade.messages.setMessage(messageData);
	}

	async getMessage(messageKey) {
		this._logger.debug(`${this.constructor.name} - getMessage`);
		return this._repositoryFacade.messages.getMessageByKey(messageKey);
	}

	async scheduleMessageToPrint({ message, datetime }) {
		this._logger.debug(`${this.constructor.name} - scheduleMessageToPrint`);
		const messageId = uuidv4();
		const key       = `${this._QUEUE_PREFIX}${messageId}`;
		const val       = '';
		const exUnits   = 'PX';
		const exVal     = new Date(datetime).getTime() - Date.now();
		try {
			await this._repositoryFacade.messages.setMessageWithExpiration(key, val, exUnits, exVal);
			await this._repositoryFacade.messages.addMessageIntoQueue(this._QUEUE_KEY, messageId, JSON.stringify(message));
			// TODO: remove it:
			// const m1 = await this._repositoryFacade.messages.getMessageFromQueue(this._QUEUE_KEY, messageId);
			// const m2 = await this._repositoryFacade.messages.getMessageByKey(key);
			// return { m1, m2 };
		} catch (err) {
			this._logger.error(err);
		}
	}

	// TODO: think of moving it into separate class...
	async initMessagesHandler() {
		this._logger.debug(`${this.constructor.name} - initMessagesHandler`);
		const messageListener = this._repositoryFacade.messages.getMessageListener();

		messageListener.on('message', async (channel, message) => {
			await messageHandler.call(this, message);
		});

		messageListener.subscribe('__keyevent@0__:expired');

		// handle already expired scheduled messages
		const keys = await this._repositoryFacade.messages.getAllExpiredMessagesFromQueue(this._QUEUE_KEY);
		keys.forEach(key => messageHandler.call(this, `${this._QUEUE_PREFIX}${key}`));
	}
}

async function messageHandler(message) {
	const [, messageId] = message.match(this._KEY_PATTERN);
	if (!messageId) {
		return;
	}
	try {
		const messageData = await this._repositoryFacade.messages.getMessageFromQueue(this._QUEUE_KEY, messageId);
		if (messageData) {
			// removing message which needs to be printed
			const deleteRes = await this._repositoryFacade.messages.delMessageFromQueue(this._QUEUE_KEY, messageId);
			if (deleteRes) {
				// TODO: check if need to use JSON.parse
				this._logger.info(`MESSAGE: ${messageData}`);
			}
		}
	} catch (err) {
		this._logger(err);
	}
}

MessageService.diProperties = { name: 'messageService', type: 'class', singleton: true };
MessageService.inject       = ['logger', 'repositoryFacade'];

module.exports = MessageService;
