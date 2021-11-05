const express = require('express');
const webserver = express();
const helmet = require("helmet");
const fetch = require('node-fetch');
const path = require('path');
const port = 7780;
webserver.use(express.urlencoded({extended:true}));
webserver.use(express.static(path.resolve(__dirname, 'public')));
webserver.use(helmet());

webserver.post('/request', (req, res) => { 
    console.log('req.body: ', req.body)
    res.setHeader("Access-Control-Allow-Origin","*");
    res.setHeader("Access-Control-Allow-Headers","Content-Type");
    let urL = req.body.url;
    let method = req.body.method;
    let params = req.body.params;
    let headerS = req.body.headers;
    let bodyParams = req.body.bodyType;
    let bodY = req.body.body;  
    let dataResponse = {};
    headerS["Access-Control-Allow-Origin"] = "*";
    headerS["Access-Control-Allow-Headers"] = "Content-Type";
    headerS[0] == ""?headerS.shift():headerS;
    let url = urL + params;
    //bodY = JSON.stringify(bodY);
    switch(bodyParams){
        case 'none': 
            call('none');
            break;
        case 'form-data': 
            call('multipart/form-data;');
            break;
        case 'TEXT': 
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
        async function call(type){        
            if(type != 'none'){
                headerS['Content-Type'] = type;
            }      
            const response = await fetch(url, {
                method: method,                
                headers: headerS,
                body: (method == 'GET')?null:  bodY,    
    
            })
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
                     
        }
}); 
webserver.options('/request', (req, res) => { 
    res.setHeader("Access-Control-Allow-Origin","*"); 
    res.setHeader("Access-Control-Allow-Headers","Content-Type"); 
    res.send(""); 
});


 webserver.listen(port,()=>{ 
    console.log("web server running on port " + port);
}); 