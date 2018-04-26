const express = require('express');
//Adicionado inicio
var adal = require('adal-node');

//Adicionado fim
const router = express.Router();
router.get('/', function (req, res, next) {
	res.status(200).send({
	title: "Node API",
	author: "Silva A.R.",
	version: "1.0.0",
	howToUse: `API-CNB index: Disponíveis: domain:port/pbiembed`
	});
});


module.exports = router;
