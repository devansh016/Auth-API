const express = require('express');
const bodyParser = require('body-parser');
const db = require('./util/database');
const errorHandler = require('./util/error-handler');

const app = express();
const port = process.env.port || 80;

app.use(bodyParser.urlencoded({ extended: true}));
app.use(bodyParser.json());

const userRoutes = require('./routes/user');

//Handling User Authentication
app.use('/user', userRoutes);

//Handling Errors
app.use(errorHandler);

//Server Running
app.listen(port);
console.log("Server listening on port "+ port);