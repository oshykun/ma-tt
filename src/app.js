const express      = require('express');
const swaggerTools = require('swagger-tools');
const { Injector } = require('infuse.js');

const FilesLoader = require('./libs/filesLoader');

class App {
	constructor(logger, { swaggerDoc, ...config }) {
		this._logger     = logger;
		this._swaggerDoc = swaggerDoc;
		this._config     = config;

		let injector        = new Injector();
		injector.strictMode = true;
		this._diManager     = injector;

		mapDependency.call(this, logger, { name: 'logger', type: 'value' });
		addConfigsIntoDI.call(this, config);
		addRuntimeIntoDI.call(this);

		this._app            = express();
		this._app.moonactive = {
			logger   : this._logger,
			diManager: this._diManager,

		};
		this._logger.debug(`${this.constructor.name} - constructor`);
	}

	async start() {
		this._logger.debug(`${this.constructor.name} - start`);
		await loadMiddlewares.call(this);

		const messageService = this._diManager.getValue('messageService');
		await messageService.initMessagesHandler();

		this._server = await new Promise(resolve => {
			let server = this._app.listen(this._config.serverConfig.apiPort, () => resolve(server));
		});

		let address   = this._server.address().address === '::'
			? 'http://localhost'
			: `http://${this._server.address().address}`;
		let serverUrl = `${address}:${this._server.address().port}`;

		this._app.moonactive.serverUrl = `${serverUrl}${this._config.serverConfig.reverseProxyUrl}`;
		this._logger.info(`API Documentation available at ${serverUrl}${this._config.serverConfig.reverseProxyUrl}/${this._config.serverConfig.uiDocPath}`);
	}
}

async function loadMiddlewares() {
	this._logger.debug(`${this.constructor.name} - loadMiddlewares`);
	let swaggerMiddleware = await new Promise(resolve => swaggerTools.initializeMiddleware(this._swaggerDoc, resolve));
	let filesLoader       = this._diManager.getValue('filesLoader');
	let middlewares       = filesLoader.loadFilesSync(`${__dirname}/middlewares`, [], true);
	middlewares.forEach(middleware => middleware(this._app, { swaggerMiddleware, config: this._config }));
}

function addConfigsIntoDI(config) {
	this._logger.debug(`${this.constructor.name} - addConfigsIntoDI`);
	return Object.entries(config)
				 .forEach(([configKey, configValue]) => {
					 mapDependency.call(this, configValue, { name: configKey, type: 'value' });
				 });

}

function addRuntimeIntoDI() {
	this._logger.debug(`${App.name} - addRuntimeIntoDI`);
	let filesLoader      = new FilesLoader(this._logger);
	let runtimeLoadFiles = filesLoader.loadFilesSync(__dirname, ['index.js', 'controllers', 'domains', 'middlewares']);
	// add all runTime classes into DI
	return runtimeLoadFiles.forEach(file => {
		if (file.diProperties) {
			mapDependency.call(this, file, file.diProperties);
		}
	});
}

function mapDependency(mapping, properties) {
	if (!mapping) {
		throw new Error(`Property mapping is mandatory, ${properties}`);
	}
	if (!properties) {
		throw new Error(`Property 'properties' is mandatory, ${mapping}`);
	}
	if (properties.type === 'class') {
		this._diManager.mapClass(properties.name, mapping, properties.singleton);
		return;
	}
	if (properties.type === 'value') {
		this._diManager.mapValue(properties.name, mapping);
		return;
	}
	throw new Error(`No properties found for: ${properties}`);
}

module.exports = App;
