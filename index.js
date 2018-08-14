const { loggerConfig, ...config } = require('./config');
const Logger                      = require('./logger');
const App                         = require('./src');

const logger = new Logger(loggerConfig);
const app    = new App(logger, config);

app.start()
   .then(() => console.log('Service started successfully!'))
   .catch(err => {
	   console.error(err, 'Service cant start');
	   process.exit(16);
   });
