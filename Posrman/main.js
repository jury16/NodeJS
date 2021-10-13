const { KeyObject } = require('crypto');
//const { response } = require('express');
const express = require('express');
const webserver = express();
const fs = require("fs");
const fetch = require('node-fetch');
const path = require('path');
const port = 7580;
webserver.use(express.urlencoded({extended:true}));
webserver.use(express.static(path.resolve(__dirname, 'public')));
//webserver.use(express.static(__dirname + "/public"));
main = () =>{
    return  `
       
    `   
 };
answer = () =>{
      return  `<div>append data</div>`
     }
 
 webserver.get('', (req, res) => { 
    //res.setHeader("Access-Control-Allow-Origin","*"); 
    //res.setHeader("Access-Control-Allow-Headers","Content-Type");    
    res.send();
}); 
webserver.post('/request', (req, res) => { 
    let status, headerContent, headersArr;
    res.setHeader("Access-Control-Allow-Origin","*");
    res.setHeader("Access-Control-Allow-Headers","Content-Type");
    let urL = req.body.url;
    let method = req.body.method;
    let params = req.body.params;
    let headerS = req.body.headers;
    let body = req.body.body; 
        if (method === 'GET' || method === "POST"){

        fetch(urL, {
            method: method,
            if  (params){
                params: params},
            if  (headerS){
                headers: headerS},
            if  (body){
                body: body},

        })
        .then(response => {
            status = response.status;
            headerContent = response.headers.get('content-type');
            headersArr = response.headers
            /*
            console.log('Status: ', response.status)
            console.log('Headers: ', (response.headers.get['Headers']))
            console.log('Content-type: ', response.headers.get('content-type'))
            */
            return response.json();
        })
        .then(data => console.log(data))
        .catch(error => console.log('Error: ', error))
        console.log('headerContent: ', this.headerContent);
        }
    res.send(); 
}); 
webserver.options('/request', (req, res) => { 
    res.setHeader("Access-Control-Allow-Origin","*"); 
    res.setHeader("Access-Control-Allow-Headers","Content-Type"); 
    res.send(""); 
});
escapeHTML = (text) =>{
    if(!text){
        return text;
    }
    text = text.toString()
        .split('&').join('&amp;')
        .split('<').join('&lt;')
        .split('>').join('&gt;')
        .split('"').join('&quot;')
        .split("'").join('&#039t;');
    return text;

}
 webserver.listen(port,()=>{ 
    console.log("web server running on port " + port);
}); 