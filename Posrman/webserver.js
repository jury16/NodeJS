const express = require('express');
const webserver = express();

//const fs = require("fs");
const fetch = require('node-fetch');
const path = require('path');
const port = 7780;
webserver.use(express.urlencoded({extended:true}));
webserver.use(express.static(path.resolve(__dirname, 'public')));

webserver.post('/request', (req, res) => { 
    //console.log('req.body: ', req.body)
    res.setHeader("Access-Control-Allow-Origin","*");
    res.setHeader("Access-Control-Allow-Headers","Content-Type");
    let urL = req.body.url;
    let method = req.body.method;
    let params = req.body.params;
    let headerS = req.body.headers;
    let bodyParams = req.body.bodyType;
    let bodY = req.body.body;  
    let dataResponse = {};
    headerS["Access-Control-Allow-Origin"]  = "*";
    headerS["Access-Control-Allow-Headers"] = "Content-Type";
    let url = urL + params;
    
    switch(bodyParams){
        case 'none': 
            call('none');
            break;
        case 'form-data': 
            call('multipart/form-data;');
            break;
        case 'TEXT ': 
            bodY = bodY;
            call('text/plain');
            break;
        case 'x-www-form-urlencoded': 
            call('application/x-www-form-urlencoded');
            break;
        case 'JSON': 
            bodY = JSON.stringify(bodY);
            call('application/json; charset=utf-8');
            break;
        case 'HTML': 
            call('text/html; charset=UTF-8');
            break;
        case 'XML': 
            call('text/xml');
            break;

    }
        async function call(type){            
            if(type != 'none' && !headerS['Content-Type']){
                headerS['Content-Type'] = type;
            }        
            const response = await fetch(url, {
                method: method,                
                if  (headerS){
                    headers: headerS},
                if  (bodY){
                    body: bodY},    
    
            })
            //console.log('from response: ', response.url)
            dataResponse = {};
            dataResponse['url'] = urL;
            dataResponse['status'] = response.status;
            dataResponse['Content-Type'] = response.headers.get('Content-Type');
            let resHeaders = [];
            for (let [key, value] of response.headers) {
                let obj = {};
                obj[key] = value;
                resHeaders.push(obj);
                } 
            dataResponse['Headers'] = resHeaders;
            const data = await response.text();                       
            dataResponse['data'] = data;
            res.send(dataResponse).end();
            //await Promise.reject(res.send(404).end());         
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