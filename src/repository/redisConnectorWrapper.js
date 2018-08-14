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
		this._config      = redisConfig;
		this._redisClient = redis.createClient(redisConfig);
		this._getAsync    = promisify(this._redisClient.get).bind(this._redisClient);
		this._setAsync    = promisify(this._redisClient.set).bind(this._redisClient);

		this._logger.debug(`${this.constructor.name} - constructor`);
	}

	/**
	 * @param {string} key key to set
	 * @param {string} val to set
	 * @param {object} [options=null] Optional settings.
	 *
	 * */
	async setStringValue(key, val, options) {
		this._logger.debug(`${this.constructor.name} - setStringValue`);
		return this._setAsync(key, val);
	}

	/**
	 * @param {string} val to get
	 * @return {Promise} returns Promise if no callback passed
	 *
	 * */
	async getValue(val) {
		this._logger.debug(`${this.constructor.name} - getValue`);
		return this._getAsync(val);
	}
}

RedisConnectorWrapper.diProperties = { name: 'redisConnectorWrapper', type: 'class', singleton: true };
RedisConnectorWrapper.inject       = ['logger', 'redisConfig'];

module.exports = RedisConnectorWrapper;
