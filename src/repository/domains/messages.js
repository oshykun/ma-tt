const BaseDomain = require('./base');

class MessagesDomain extends BaseDomain {
	constructor(logger, redisConnectorWrapper) {
		super(logger, redisConnectorWrapper, 'messages');
		this._logger.debug(`${this.constructor.name} - constructor`);
	}

	async setMessage(messageData) {
		this._logger.debug(`${this.constructor.name} - addMessageInQueue`);
		const { message, datetime } = messageData;
		return this._redisConnectorWrapper.setStringValue(datetime, message);
	}

	async getMessageByKey(key) {
		this._logger.debug(`${this.constructor.name} - getMessageByKey`);
		return this._redisConnectorWrapper.getValue(key);
	}

	async setMessageWithExpiration(key, val, exUnits, exVal) {
		this._logger.debug(`${this.constructor.name} - setMessageWithExpiration`);
		return this._redisConnectorWrapper.setStringValue(key, val, { exUnits, exVal });
	}

	async addMessageIntoQueue(hashKey, messageId, message) {
		this._logger.debug(`${this.constructor.name} - addMessageIntoQueue`);
		return this._redisConnectorWrapper.putIntoHash(hashKey, messageId, message);
	}

	async getMessageFromQueue(hashKey, messageId) {
		this._logger.debug(`${this.constructor.name} - addMessageIntoQueue`);
		return this._redisConnectorWrapper.getFromHash(hashKey, messageId);
	}

	getMessageListener() {
		this._logger.debug(`${this.constructor.name} - getMessageListener`);
		return this._redisConnectorWrapper.messageListener;
	}
}

module.exports = MessagesDomain;
