const express = require('express');
const app = express();
const router = express.Router();
//body parser I
var bodyParser = require('body-parser')
app.use( bodyParser.json() ); 
//body parser F

//CORS - I
var cors = require('cors');
app.use(cors());
//CORS - F
//Rotas
const index = require('./routes/index');
const pbiEmbedRoute = require('./routes/pbiEmbedRoute');
app.use('/', index);
app.use('/pbiembed', pbiEmbedRoute);
module.exports = app;
