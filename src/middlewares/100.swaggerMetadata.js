module.exports = (app, { swaggerMiddleware }) => {
    // Interpret Swagger resources and attach metadata to request - must be first in swagger-tools middleware chain
    app.use(swaggerMiddleware.swaggerMetadata());
};