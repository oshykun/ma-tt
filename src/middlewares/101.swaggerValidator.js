module.exports = (app, { swaggerMiddleware }) => {
    // Validate Swagger requests
    app.use(swaggerMiddleware.swaggerValidator());
};