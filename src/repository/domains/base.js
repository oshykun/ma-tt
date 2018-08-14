class BaseDomain {
	constructor(logger, redisConnectorWrapper, domain) {
		this._logger                = logger;
		this._redisConnectorWrapper = redisConnectorWrapper;
		this._domain                = domain;
		this._logger.debug(`${this.constructor.name} - constructor`);
	}

	get domain() {
		return this._domain;
	}
}

module.exports = BaseDomain;
