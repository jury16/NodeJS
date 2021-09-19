const { KeyObject } = require('crypto');
const express = require('express');
const webserver = express();
const fs = require("fs");
const path = require('path');
const port = 8080;

webserver.use(express.urlencoded({extended:true}));
var stats = JSON.parse(fs.readFileSync('statistics.json',"utf8"));    
webserver.get('', (req, res) => { 
    let par1 = escapeHTML(req.query.vote);
    res.send(func(stats));
}); 
webserver.get('/variants', (req, res) => { 
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Content-Type', 'application/json; charset=UTF-8');
    let par1 = escapeHTML(req.query.vote);
    let str = (fs.readFileSync('variants.json',"utf8"))
    //console.log(str);
    /*
    let questions = [];
    str.map(item =>{
        questions.push(item.text)
    })
    console.log(questions)
    res.send(questions);   
    */
    res.send(str);
}); 
webserver.post('/votes', (req, res) => { 
    console.log(req.body)
});
webserver.get('/stats', (req, res) => { 
    //console.log('req.query:' ,req.query.vote)
    let rep = escapeHTML(req.query.req);
    let answer = req.query.vote;
    if(answer){
        //console.log('answer:' , answer)
        stats.map(element => {
            Object.keys(element)[0] === answer?element[`${Object.keys(element)[0]}`] += 1:Object.keys(element)[0];
            
        });        
        fs.writeFileSync('statistics.json', JSON.stringify(stats));    
    }
    //console.log(stats);
    res.send(func(stats));    
}); 

func = (stats) =>{    
    var statS = JSON.stringify(stats);
    //console.log(statS);
   
    let forme =  `
                <h2>Systeme votes</h2>
                <form id='form' method="POST"> 
                </form>
                <script src='http://fe.it-academy.by/JQ/jquery.js'></script>
                <script>
                    var newStats = {}; //create hash questions:votes
                    //console.log(${statS});
                    if (${statS}){

                        ${statS}.forEach((item, index) =>{
                            var a = Object.keys(item)[0];
                            newStats[a] = item[a];
                        })
                    }                
                    // create form
                    var questions = null;
                    $.ajax(('/variants'),
                    { type:'GET', dataType:'json', success:dataLoaded, error:errorHandler }
                     );
                    function dataLoaded(data) {                                          
                        //questions = JSON.parse(data); 
                        questions = data; 
                        createForm(questions);
                        //console.log('from /variants: ', data)
                        
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
                            var p = document.createElement('p');                                             
                            //p.style.border = 3 + 'px' + ' solid';                      
                            var input = document.createElement('input');  
                            var span = document.createElement('span');  
                            span.style.float = 'right';  
                            span.style.marginRight = 5 + 'px';                 
                            input.type = 'radio'
                            input.id = item[Object.keys(item)[1]];
                            input.name = "vote";
                            input.value = item[Object.keys(item)[0]]; 
                            var label = document.createElement('label');
                            var textLabel = document.createTextNode(input.value);
                            (Object.keys(newStats).length)?textSpan = document.createTextNode(newStats[input.value]):textSpan = document.createTextNode('');
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
                        { type:'POST', dataType:'text', data: $( this ).serialize()}
                         );
                      });
                     
                    }
                                    
                </script>
                `;
    return (forme)
}

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