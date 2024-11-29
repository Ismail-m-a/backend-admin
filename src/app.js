const { API_DOCS, CORS_ALLOWED_ORIGINS } = require('./config');
const express = require('express');
const helmet = require('helmet');
const cors = require('cors'); 
const swaggerJsDoc = require("swagger-jsdoc");
const app = express();
app.use(express.json());

app.use(helmet());
app.use(cors({
    origin: (origin, callback) => {
        const isAllowed = CORS_ALLOWED_ORIGINS.some(allowedOrigin => {
            return typeof allowedOrigin === 'string' ? allowedOrigin === origin :
                allowedOrigin.test(origin);
        });
        if (!origin || isAllowed) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    }
}));

if (API_DOCS) {
    const swaggerUi = require("swagger-ui-express");
    const swaggerOptions = require('./swaggerConfig');
    app.get('/', (req, res) => {
        res.redirect('/api-docs');
    });
    const swaggerDocs = swaggerJsDoc(swaggerOptions);
    app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocs));
} else {
    app.get('/', (req, res) => {
        res.json({
            message: "Welcome to Backend-Admin API",
            availableRoutes: {
                authentication: "/api/auth",
                admin: "/api/admin",
                posts: "/api/posts",
                categories: "/api/categories",
                documentation: "Disabled",
            }
        });
    });
}

app.use('/api/auth', require('./routes/auth_routes'));
console.log("Auth routes loaded");
app.use('/api/admin', require('./routes/admin_routes'));
app.use('/api/posts', require('./routes/post_routes'));
app.use('/api/categories', require('./routes/category_routes'));

app.use((req, res) => res.status(404).send('Not Found'));


// Middleware to log request payload
app.use((req, res, next) => {
    console.log('Incoming Request:', req.method, req.url);
    console.log('Headers:', req.headers);
    console.log('Body:', req.body); // This will print the incoming JSON payload
    next();
});
module.exports = app;
