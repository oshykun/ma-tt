const BaseDomain = require('./base');

class MessagesDomain extends BaseDomain {
	constructor(logger, redisConnectorWrapper) {
		super(logger, redisConnectorWrapper, 'messages');
		this._logger.debug(`${this.constructor.name} - constructor`);
	}

	async addMessageInQueue(messageData) {
		this._logger.debug(`${this.constructor.name} - addMessageInQueue`);
		const { message, datetime } = messageData;
		return this._redisConnectorWrapper.setStringValue(datetime, message);
	}

	async getMessageByKey(key) {
		this._logger.debug(`${this.constructor.name} - getMessageByKey`);
		return this._redisConnectorWrapper.getValue(key);
	}
}

module.exports = MessagesDomain;
