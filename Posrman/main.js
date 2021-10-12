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
    let url = req.body.url;
    let method = req.body.method;
    let params = req.body.params;
    let headers = req.body.headers;
    let body = req.body.body; 
    console.log('url:', url)    
    console.log('method:', method)  
    console.log('params:', params)    
    console.log('headers:', headers)    
    console.log('body:', body)    
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