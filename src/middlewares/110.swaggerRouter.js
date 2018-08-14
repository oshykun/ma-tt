module.exports = (app, { swaggerMiddleware, config }) => {
    // Route validated requests to appropriate controller
    app.use(swaggerMiddleware.swaggerRouter({ controllers: config.serverConfig.controllerPath }));
};