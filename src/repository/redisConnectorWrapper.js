const redis         = require('redis');
const { promisify } = require('util');

class RedisConnectorWrapper {
	constructor(logger, redisConfig) {
		this._logger = logger;
		if (!redisConfig) {
			throw new Error('Redis config object is mandatory.');
		}
		if (!redisConfig.host) {
			throw new Error('config.host property is mandatory.');
		}
		if (!redisConfig.port) {
			throw new Error('config.port property is mandatory.');
		}
		this._config          = redisConfig;
		this._redisClient     = redis.createClient(this._config);
		this._messageListener = redis.createClient(this._config);

		this._getAsync   = promisify(this._redisClient.get).bind(this._redisClient);
		this._setAsync   = promisify(this._redisClient.set).bind(this._redisClient);
		this._hgetAsync  = promisify(this._redisClient.hget).bind(this._redisClient);
		this._hsetAsync  = promisify(this._redisClient.hset).bind(this._redisClient);
		this._hkeysAsync = promisify(this._redisClient.hkeys).bind(this._redisClient);
		this._hdelAsync  = promisify(this._redisClient.hdel).bind(this._redisClient);

		this._logger.debug(`${this.constructor.name} - constructor`);
	}

	/**
	 * @param {string} key key to set
	 * @param {string} val to set
	 * @param {object} [options=null] Optional settings.
	 * @param {string} [options.exUnits=null] expiration units e.g. milliseconds
	 * @param {number} [options.exVal=null] expiration time value
	 * @return {Promise} returns Promise
	 *
	 * */
	async setStringValue(key, val, options) {
		this._logger.debug(`${this.constructor.name} - setStringValue`);
		if (options) {
			const { exUnits, exVal } = options;
			return this._setAsync(key, val, exUnits, exVal);
		}
		return this._setAsync(key, val);
	}

	/**
	 * @param {string} val to get
	 * @return {Promise} returns Promise
	 *
	 * */
	async getValue(val) {
		this._logger.debug(`${this.constructor.name} - getValue`);
		return this._getAsync(val);
	}

	/**
	 * @param {string} hash of the field
	 * @param {string} field to set
	 * @param {string} val to set
	 * @return {Promise} returns Promise
	 *
	 * */
	async putIntoHash(hash, field, val) {
		this._logger.debug(`${this.constructor.name} - addIntoHash`);
		return this._hsetAsync(hash, field, val);
	}

	async getFromHash(hash, field) {
		this._logger.debug(`${this.constructor.name} - getFromHash`);
		return this._hgetAsync(hash, field);
	}

	async removeFromHash(hash, field) {
		this._logger.debug(`${this.constructor.name} - removeFromHash`);
		return this._hdelAsync(hash, field);
	}

	async getAllKeysByHash(hash) {
		this._logger.debug(`${this.constructor.name} - getAllKeysByHash`);
		return this._hkeysAsync(hash);
	}

	get messageListener() {
		return this._messageListener;
	}
}

RedisConnectorWrapper.diProperties = { name: 'redisConnectorWrapper', type: 'class', singleton: true };
RedisConnectorWrapper.inject       = ['logger', 'redisConfig'];

module.exports = RedisConnectorWrapper;
