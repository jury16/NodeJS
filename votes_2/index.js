const { KeyObject } = require('crypto');
const express = require('express');
const webserver = express();
const fs = require("fs");
const path = require('path');
const {toXML} = require("jstoxml");
const json2html = require('node-json2html')
const port = 7580;

webserver.use(express.urlencoded({extended:true}));
webserver.use(express.static(path.resolve(__dirname, 'public')));
//webserver.use(express.static('public'));
//webserver.use(express.static('static'));
var stats = JSON.parse(fs.readFileSync('statistics.json',"utf8"));  
var variants = fs.readFileSync('variants.json',"utf8");
 main = () =>{
     return  `
        <h2>Systeme votes</h2>
        <form id='form'>         
        </form>
        <form id='form2'> 
        </form>
        <script src='http://fe.it-academy.by/JQ/jquery.js'></script>  
        <script src="webserver.js"></script>      
    `   
 }
webserver.get('/main', (req, res) => { 
    let par1 = escapeHTML(req.query.vote); 
    //console.log('from main')     
    res.send(main());
}); 
webserver.get('/variants', (req, res) => { 
    let par1 = escapeHTML(req.query.vote);
    res.send(variants);
}); 
webserver.post('/votes', (req, res) => {    
    var idVote = (req.body)['vote'];
    let answer = null;
    JSON.parse(variants).map((item, index) =>{
        //console.log(item['text'])
        item['code'] == idVote? answer = item['text']: item['code'];
    })
    if(answer){
        stats.map(element => {
           (element)['color'] === answer?(element)['count'] += 1:(element)['count'];
        });    
          
        fs.writeFileSync('statistics.json', JSON.stringify(stats));   
    }
    res.status(200).end();
});
webserver.get('/stats', (req, res) => {     
    res.setHeader('Cache-Control', 'max-age=0, no-cache, no-store');
    res.send(JSON.parse(fs.readFileSync('statistics.json',"utf8")));  
});
webserver.get('/upploadStats', (req, res) => { 
    let reponse = JSON.parse(fs.readFileSync('statistics.json',"utf8"));
    res.setHeader("Access-Control-Allow-Origin","*"); 
    const clientAccept=req.headers.accept;
    if ( clientAccept==="application/json" ) {
        res.setHeader("Content-Type", "application/json");
        res.send(reponse);
    }
    else if ( clientAccept==="application/xml" ) {
        res.setHeader("Content-Type", "application/xml");
        res.send(toXML(reponse));
    }
    else if ( clientAccept==="application/html" ) {
        res.setHeader("Content-Type", "application/html");
        res.send(json2html.transform(reponse, {"<>":"li","html":"${color} : ${count}"}))

    }
    else console.log('something wrong');
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
