const express = require('express');
const bodyParser = require('body-parser');
const db = require('./util/database');
const errorHandler = require('./util/error-handler');
const jwt = require('./util/jwt');
const cookieParser = require("cookie-parser");

const app = express();
const port = process.env.port || 80;

app.use(bodyParser.urlencoded({ extended: true}));
app.use(bodyParser.json());

app.use(cookieParser());
app.use(jwt());

const authRoutes = require('./routes/authRoute');

//Handling Routes
app.use('/api/auth', authRoutes);

//Handling Errors
app.use(errorHandler);

//Server Running
app.listen(port);
console.log("Server listening on port "+ port);