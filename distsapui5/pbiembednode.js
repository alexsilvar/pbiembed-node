/*eslint linebreak-style: ["error", "windows"]*/
sap.ui.define([], function() {
	"use strict";
	return {
		embarcar: function(tipo, groupId, elementId, container, endereco) {
			//Para usar dentro do programa
			var jsonData = {
				type: tipo, //Tipo do elemento
				groupId: groupId, //ID do grupo
				elementId: elementId //ID do report/dashboard
			};
			//para exportar
			var data = JSON.stringify(jsonData);
			//POST Assincrono
			var request = new XMLHttpRequest();
			//endereco = 'http://ip.addres.node.running:3000/pbiembed';
			request.open('POST', endereco, true);
			request.setRequestHeader('Content-Type', 'application/json');
			request.onload = function() {
				//console.log('Recebido: ',this.responseText);
				var recebido = JSON.parse(this.responseText);
				//Configuracoes obtidas pela busca
				var models = window['powerbi-client'].models;
				var config = {
					id: jsonData.elementId,
					type: jsonData.type,
					tokenType: models.TokenType.Embed,
					accessToken: recebido.embedToken,
					embedUrl: recebido.embedUrl,
					pageView: "fitToWidth",
					settings: {
						layoutType: models.LayoutType.Custom,
						customLayout: {
							displayOption: models.DisplayOption.FitToPage
						},
						navContentPaneEnabled: true,
						filterPaneEnabled: false
					}
				};
				// pega o container que conterá o html - tamanho e outras coisas podem ser ditadas via css
				var thingContainer = container;
				//alert(token);
				// mostra de fato o elemento dentro do container
				var dashboard = powerbi.embed(thingContainer, config);
				dashboard.iframe.style.border = "none";
				dashboard.iframe.style.width = "100%";
				dashboard.iframe.style.height = "87%";

				//Seleciona a primeira pagina do report como ativa
				dashboard.on('loaded', function() {
					dashboard.getPages().then(function(pages) {
						pages[0].setActive();
					});
				});
			};
			//console.log("Enviado: ",data);
			request.send(data);
		}

	};

});