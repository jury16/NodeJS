//const { KeyObject } = require('crypto');
//const { response } = require('express');
const express = require('express');
const webserver = express();
//const fs = require("fs");
const fetch = require('node-fetch');
const path = require('path');
const port = 7780;
webserver.use(express.urlencoded({extended:true}));
webserver.use(express.static(path.resolve(__dirname, 'public')));

webserver.post('/request', (req, res) => { 
    let status, headerContent, headersArr;
    res.setHeader("Access-Control-Allow-Origin","*");
    res.setHeader("Access-Control-Allow-Headers","Content-Type");
    let urL = req.body.url;
    let method = req.body.method;
    let params = req.body.params;
    let headerS = req.body.headers;
    let bodyParams = req.body.bodyType;
    let body = req.body.body;  
    headerS["Access-Control-Allow-Origin"]  = "*";
    headerS["Access-Control-Allow-Headers"] = "Content-Type";
    console.log('headers reicive and added: ', headerS)
    /*
    console.log('method:', method);
    console.log('params:', params);
    console.log('headerS: ', headers);
    console.log('bodyParams: ', bodyParams);
    console.log('body:', body);
    */
    switch(bodyParams){
        case 'none': 
            call('none');
            break;
        case 'form-data': 
            call('multipart/form-data;');
            break;
        case 'TEXT ': 
            call('text/plain');
            break;
        case 'x-www-form-urlencoded': 
            call('application/x-www-form-urlencoded');
            break;
        case 'JSON': 
            call('application/json; charset=utf-8');
            break;
        case 'HTML': 
            call('text/html; charset=UTF-8');
            break;
        case 'XML': 
            call('text/xml');
            break;

    }
        function call(type){ 
            if(type != 'none' && !headerS['Content-Type']){
                headerS['Content-Type'] = type;
            }        
            console.log(headerS)   
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
                console.log('headers to send: ', headerS)
                console.log('body to send: ', body);
                console.log('response.status: ', response.status);
                console.log('response.headers: ', response.headers.get('Content-Type'));
                /*
                for (let [key, value] of response.headers) {
                    console.log(`${key} = ${value}`);
                  } 
                  */
                return response.json();  
            })
            .then(data => console.log('data: ', data))
            .catch(error => console.log('error: ', error))
                     
        }

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