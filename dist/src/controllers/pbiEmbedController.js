var adal = require('adal-node');
//
var resp = null;
//Guarda informacoes recebidas via post
var received = null;

//BEGIN Setup
const authorityHostUrl = 'https://login.microsoftonline.com/';
const tenant = 'tenant.onmicrosoft.com'; // AAD Tenant name.
const uri = authorityHostUrl + tenant;
const appId = '9033b-xxxxxx-888b0a';
//BEGIN Administrador dos grupos e usuário PRO	
const username = 'login_embedded_bi';
const passwd = 'password_embedded_bi';
//END Administrador
const resource = 'https://analysis.windows.net/powerbi/api';
//ENDSetup

startPBI = (type, groupId, elementId) => {

	var context = new adal.AuthenticationContext(uri);//Start adal context
	
	//Encontrar Token de acesso
	context.acquireTokenWithUsernamePassword(resource, username, passwd, appId, function(err, tokenResponse) {
		if (err) {
			console.log('well that didn\'t work: ' + err.stack);
		} else {
			var authHeader = "Bearer " + tokenResponse.accessToken;	
			//console.log(authHeader);
			var embedUrl = getUrl(authHeader);
			//console.log(embedUrl);
			var embedData = getEmbedToken(authHeader);			
			//console.log(embedToken);
			if(embedUrl && embedData){
				resp.status(201).send(`{"embedUrl": "${embedUrl}", "expiration": "${embedData.expiration}", "embedToken": "${embedData.token}"}`);
				console.log('Succes: Embed Info sent');
			}else{
				resp.status(403).send(`Erro de `);
				console.log('Error embedUrl or embedData');
			}
		}
	});
};

getUrl = (authHeader) => {
	var XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;
	var request = new XMLHttpRequest();
	//Chamada syncrona devido a dependencia do resultado
	request.open('GET', 'https://api.powerbi.com/v1.0/myorg/groups/'+ received.groupId +'/'+ received.type + 's', false);
	request.setRequestHeader('Authorization', authHeader);
	request.send();
	if (request.readyState === 4) {
		var resposta = JSON.parse(request.responseText);
		//responseText contem o formato odata com informacoes importantes
		for(var i = 0; i < resposta.value.length ; i++){			
			if( resposta.value[i].id === received.elementId ){
				return resposta.value[i].embedUrl;
			}
		}
		return null;
	}else{
		return null;
	}    
};

getEmbedToken = (authHeader) => {
	var XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;
	var request = new XMLHttpRequest();

	var urlForEmbed = 'https://api.powerbi.com/v1.0/myorg/groups/'+ received.groupId +'/'+received.type+'s/'+ received.elementId+'/GenerateToken';
	//Chamada syncrona devido a dependencia do resultado
	request.open('POST', urlForEmbed, false);
	request.setRequestHeader('Authorization', authHeader);
	request.setRequestHeader('Content-Type', 'application/json; charset=utf-8');
	request.setRequestHeader('Accept', 'application/json');
	//envia request com conteudo
	var conteudo = JSON.stringify({
		"accessLevel": "View",
		"allowSaveAs": "false"
	});		
	
	request.send(conteudo); 
	
	if (request.readyState === 4) {
		var ret = {};
		ret.expiration = JSON.parse(request.responseText).expiration;
		//RetornaDataEmMilis
		ret.expiration = Date.parse(ret.expiration);
		ret.token = JSON.parse(request.responseText).token;
		return ret;
	}else{
		return null;
	}
	
	
};

exports.post = (req, res, next) => {
	//console.log('POST Recebido');
	received = {};
	received.type = req.body.type;
	received.groupId = req.body.groupId;
	received.elementId = req.body.elementId;
	//console.log(req);
	resp = res;
	startPBI();
};
exports.get = (req, res, next) => {
	res.status(200).send({
	title: "Node API - PowerBI Embedded",
	author: "Silva A.R.",
	version: "1.0.0",
	howToUse: `POST body = {type: report|dashboard, groupId: 81536a48-xxxx-58a3b9ad8470, elementId: a9055f42-xxxx-ea1d99b08349} at 'domain/pbiembed'}`
	});
};