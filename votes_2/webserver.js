const { KeyObject } = require('crypto');
const express = require('express');
const webserver = express();
const fs = require("fs");
const path = require('path');
const {toXML} = require("jstoxml");
const json2html = require('node-json2html')
const port = 7580;

webserver.use(express.urlencoded({extended:true}));
webserver.use(express.static('public'));
webserver.use(express.static('static'));
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
        <script>
            var newStats = {}; //create hash questions:votes
            // create form
            var questions = null;
            $.ajax(('/variants'),
            { type:'GET', dataType:'json', success:dataLoaded, error:errorHandler }
            );
            function dataLoaded(data) {  
                var questions = data;                                      
                $.ajax(('/stats'),
                { type:'GET', dataType:'text', data: data, success:dataUploaded}
                );
                function dataUploaded(data) {                                          
                    var st = JSON.parse(data);
                    
                    if (st){
                        st.forEach((item, index) =>{
                            let color = Object.keys(item)[0];
                            let count = Object.keys(item)[1];
                            newStats[item[color]] = item[count];
                        })
                    }    
                    createForm(questions);                                                                                     
                }                            
                                    
            }
            function errorHandler(jqXHR,statusStr,errorStr) {
                alert(statusStr+' '+errorStr);
            }
            
            createForm = (questions) =>{
                var form = document.getElementById('form');
                form.style.border = 1 + 'px' + ' solid';
                form.style.width = 200 + 'px';
                form.style.backgroundColor = '#CDCDCD';
                var textSpan;                        
                questions.forEach((item, index)=>{   
                    var voteName = item[Object.keys(item)[0]];
                    var voteCode = item[Object.keys(item)[1]];
                    var p = document.createElement('p');                                             
                    //p.style.border = 3 + 'px' + ' solid';                      
                    var input = document.createElement('input');  
                    var span = document.createElement('span');  
                    span.style.float = 'right';  
                    span.style.marginRight = 5 + 'px';                 
                    input.type = 'radio'
                    input.id = voteCode;
                    input.name = "vote";
                    input.value = voteCode; 
                    var label = document.createElement('label');
                    label.htmlFor = voteCode;
                    var textLabel = document.createTextNode(voteName);
                    (Object.keys(newStats).length)?textSpan = document.createTextNode(newStats[voteName]):textSpan = document.createTextNode('');
                    label.appendChild(textLabel)
                    span.appendChild(textSpan);
                    p.appendChild(input); 
                    p.appendChild(label); 
                    p.appendChild(span); 
                    form.appendChild(p);
                    return false;
                })                       
                
                var inputSubmit = document.createElement('input');   
                inputSubmit.type = "submit";
                form.appendChild(inputSubmit);   
            
                $("form").on( "submit", function( event ) {
                    event.preventDefault();
                    
                    $.ajax(('/votes'),
                    { type:'POST', dataType:'text', data: $( this ).serialize(), success:dataLoaded}
                    );
                        function dataLoaded(data) {                            
                            $.ajax(('/stats'),
                            { type:'GET', dataType:'text', data: $( this ).serialize(), success:dataUploaded}
                            );
                        
                                function dataUploaded(data) {  
                                    let spanText = document.getElementsByTagName('span');  
                                    let statsChanged = (JSON.parse(data)); 
                                    
                                    statsChanged.forEach((item, index)=>{ 
                                        spanText[index].innerHTML = item[Object.keys(item)[1]];
                                    });                                                                  
                                }
                                                    
                        }
                    function errorHandler(jqXHR,statusStr,errorStr) {
                        alert(statusStr+' '+errorStr);
                    }
                
                });            
            }
            var divText = document.createElement('div');
            var pText = document.createElement('p');
            var pHead = document.createElement('p');                     
            var form2 = document.getElementById('form2');              
            var buttonsText = ['Show XML', 'Show HTML', 'Show JSON'];
            buttonsText.forEach((item, index) =>{
                var butt = document.createElement('input'); 
                butt.type = 'button';
                butt.value = item;
                butt.id = index;
                form2.appendChild(butt);
            });
            
            form2.appendChild(divText);            
            form2.addEventListener( "click" , () => {
                switch(event.target.id){
                    case '0': call_for_xml();
                    break;
                    case '1': call_for_html();
                    break;
                    case '2': call_for_json();
                    break;
                }
                async function call_for_json() {
                    const fetchOptions={
                            headers: {
                                    'Accept': 'application/json',
                            },
                    };
                    //console.log(fetchOptions);
                    const response=await fetch('/upploadStats',fetchOptions);
                    const data = await response.json();
                    pText.innerHTML = (JSON.stringify(data));
                    pHead.innerHTML = "JSON file:";
                    
                }
                async function call_for_xml() {
                    const fetchOptions={
                            headers: {
                                    'Accept': 'application/xml',
                            },
                    };                    
                    const response=await fetch('/upploadStats',fetchOptions);
                    const data = await response.text();                ;
                    pText.innerText = (data);
                    pHead.innerHTML = "XML file:";
                    
                }
                async function call_for_html() {
                    const fetchOptions={
                            headers: {
                                    'Accept': 'application/html',
                            },
                    };
                    
                    const response=await fetch('/upploadStats',fetchOptions);
                    const data = await response.text();                   
                    
                    pHead.innerHTML = "HTML file:";
                    pText.innerText = (data);
                    
                }
                divText.appendChild(pHead);
                divText.appendChild(pText);
               
            });
        </script>
    `   
 }
webserver.get('/main', (req, res) => { 
    let par1 = escapeHTML(req.query.vote); 
    console.log('from main')     
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