module.exports = (app, { swaggerMiddleware, config }) => {
    // Serve the Swagger documents and Swagger UI
    app.use(swaggerMiddleware.swaggerUi({
        apiDocs  : `${config.serverConfig.reverseProxyUrl}/${config.serverConfig.apiDocPath}`,
        swaggerUi: `${config.serverConfig.reverseProxyUrl}/${config.serverConfig.uiDocPath}`,
    }));
};