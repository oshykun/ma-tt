module.exports = app => {
    app.use((req, res, next) => {
        if (req.swagger) {
            return next();
        }
        // FIXME: add icon or remove it.
        if (req.originalUrl === '/favicon.ico') {
            return next();
        }
        let unhandledRequestError = new Error(`Unimplemented request handler, ${req.originalUrl}`);
        return next(unhandledRequestError);
    });
};