class RepositoryFacade {

	constructor(logger, redisConnectorWrapper, filesLoader) {
		this._logger                = logger;
		this._redisConnectorWrapper = redisConnectorWrapper;
		this._filesLoader           = filesLoader;

		this._filesLoader.loadFilesSync(`${__dirname}/domains/`, ['base.js'])
			.forEach(DomainClass => {
				try {
					let domainConnector = new DomainClass(this._logger, this._redisConnectorWrapper);
					if (!domainConnector.domain) {
						return;
					}
					this[domainConnector.domain] = domainConnector;
				} catch (err) {
					this._logger.error(`Can't load domain file as connector, err: ${JSON.stringify(err)}`);
				}
			});
		this._logger.debug(`${RepositoryFacade.name} - constructor`);
	}
}

RepositoryFacade.diProperties = { name: 'repositoryFacade', type: 'class', singleton: true };
RepositoryFacade.inject       = ['logger', 'redisConnectorWrapper', 'filesLoader'];

module.exports = RepositoryFacade;
