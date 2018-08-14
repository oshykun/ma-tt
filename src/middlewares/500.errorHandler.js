const uuidv4 = require('uuid/v4');

module.exports = app => {
    app.use((err, req, res, next) => {

            let logger = getLogger(req);
            logger.debug('ErrorHandler - handleError');

            let reportId    = uuidv4();
            let requestData = {
                method     : req.method,
                headers    : req.headers,
                originalUrl: req.originalUrl,
                body       : JSON.stringify(req.body),
                traceId    : reportId,
            };
            try {
                if (!res.headersSent) {
                    let errorResponse = getErrorResponse(err, req, reportId);
                    res.setHeader('Content-Type', 'application/json');
                    res.status(errorResponse.httpCode)
                       .json(errorResponse.resBody);
                }
            } catch (internalError) {
                logger.error(`Error: ${internalError.stack}`);
            } finally {
                if (!(err instanceof Error)) {
                    err = new Error(JSON.stringify(err));
                }
                logger.error(`Error: ${err.stack} \n ${JSON.stringify(requestData, null, 2)}`);
                next();
            }
        },
    );
};

const getLogger = req => {
    let logger = req.app.moonactive.logger;
    if (!logger) {
        logger = {};
    }
    if (!logger.debug) {
        logger.debug = console.log;
    }
    if (!logger.error) {
        logger.error = console.error;
    }
    return logger;
};

const getErrorResponse = (err, req, reportId) => {
    // TODO: add new custom Error
    return {
        resBody : {
            errorCode: 'internal_error',
            message  : err.message || 'Please report to system admin with report error id.',
            reportId : reportId,
        },
        httpCode: 500,
    };
};
