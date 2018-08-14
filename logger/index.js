const winston = require('winston');

class Logger {
	constructor(config) {
		this._config = config;

		const logger = winston.createLogger({
			level     : this._config.level,
			format    : winston.format.json(),
			transports: [
				new winston.transports.File({ filename: 'error.log', level: 'error' }),
				new winston.transports.File({ filename: 'combined.log' }),
			],
		});
		if (process.env.NODE_ENV !== 'production') {
			logger.add(new winston.transports.Console({
				format: winston.format.simple(),
			}));
		}
		return logger;
	}
}

module.exports = Logger;
