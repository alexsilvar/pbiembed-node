# pbiembed-node
API to Generate Embed Token in Node JS

To use this app you have to install the followings packages at the server folder
```sh
 $ npm install express
 $ npm install body-parser
 $ npm install cors
 $ npm install adal-node
 $ npm install xmlhttprequest
 ```
 
 To run it you have to use nodemon:
 
```sh
$ npm install nodemon
```
 
 Than you have to do some changes at ```pbiEmbedController.js```:
 
 | Variable | Value Required Development | Value Required Production |
 | ------ | ------ | ------ |
 | tenant | Your microsoft tenant | Your microsoft tenant |
 | appId | Your registered Power BI Native App | Your registered Power BI Native App |
 | username | Login of Admin of group you're getting tokens | Login of Embededd PowerBI |
 | passwd | Password of Admin of group you're getting tokens | Login of Embededd PowerBI |
 
 Finnaly you start the server usgin:
 ```sh
$ npm start
```
 
 To get the tokens from your developed server you have to pass the parameters like in the ```test.js``` 'test' folder :
 ```sh
 var tp = "report"; // or "dashboard"
 var groupId = "815-groupId-470";
 var elementId = "5c1-elelmentID-231";
 var container = "container"; //ID of the div
 
 embarcar(tp, groupId, elementId, container);
 ```
 
