const { KeyObject } = require('crypto');
const express = require('express');
const webserver = express();
const fs = require("fs");
const path = require('path');
const port = 7580;

webserver.use(express.urlencoded({extended:true}));
var stats = JSON.parse(fs.readFileSync('statistics.json',"utf8"));  
var variants = fs.readFileSync('variants.json',"utf8");
 main = () =>{
     return  `
        <h2>Systeme votes</h2>
        <form id='form' method="POST"> 
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
                { type:'POST', dataType:'text', data: data, success:dataUploaded}
                );
                function dataUploaded(data) {                                          
                    var st = JSON.parse(data);
                    if (st){
                        st.forEach((item, index) =>{
                            var a = Object.keys(item)[0];
                            newStats[a] = item[a];
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
                    var textLabel = document.createTextNode(voteName);
                    (Object.keys(newStats).length)?textSpan = document.createTextNode(newStats[voteName]):textSpan = document.createTextNode('');
                    label.appendChild(textLabel)
                    span.appendChild(textSpan);
                    p.appendChild(input); 
                    p.appendChild(label); 
                    p.appendChild(span); 
                    form.appendChild(p);
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
                        { type:'POST', dataType:'text', data: $( this ).serialize(), success:dataUploaded}
                        );
                        function dataUploaded(data) {                                          
                            $.ajax(('/main'),
                            { type:'GET', dataType:'text', success:dataLoaded(data), error:errorHandler }
                            );
                            function dataLoaded(data) {  
                                let spanText = document.getElementsByTagName('span');  
                                let statsChanged = (JSON.parse(data)); 
                                statsChanged.forEach((item, index)=>{ 
                                    spanText[index].innerHTML = item[Object.keys(item)[0]];
                                });                                                                  
                            }
                        }                            
                    }
                function errorHandler(jqXHR,statusStr,errorStr) {
                    alert(statusStr+' '+errorStr);
                }
            });            
            }
                            
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
        console.log('answer:' , answer)
        stats.map(element => {
           Object.keys(element)[0] === answer?element[`${Object.keys(element)[0]}`] += 1:Object.keys(element)[0];
            
        });        
        fs.writeFileSync('statistics.json', JSON.stringify(stats));   
    }
    res.status(200).end();
});
webserver.post('/stats', (req, res) => {     
    res.send(JSON.parse(fs.readFileSync('statistics.json',"utf8")));  
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