const { KeyObject } = require('crypto');
const express = require('express');
const webserver = express();
const fs = require("fs");
const path = require('path');
const port = 7580;

webserver.use(express.urlencoded({extended:true}));

webserver.get('', (req, res) => { 
    let par1 = escapeHTML(req.query.vote);
    res.send(func());
}); 
webserver.get('/questions', (req, res) => { 
    let par1 = escapeHTML(req.query.vote);
    res.send(JSON.stringify(fs.readFileSync('questions.txt',"utf8").split(', ')));
}); 
webserver.get('/servise1', (req, res) => { 
    
    let rep = escapeHTML(req.query.req);
    let answer = req.query.vote;
    
    let stats = null;       //statistics
        stats = JSON.parse(fs.readFileSync('statistics.json',"utf8"));        
        stats.forEach(element => {
            let key = Object.keys(element);
            let keY = key[0];
            Object.keys(element)[0] === answer?element[`${Object.keys(element)[0]}`] += 1:Object.keys(element)[0];
            
        });
        fs.writeFileSync('statistics.json', JSON.stringify(stats));    

        res.send(func(stats));    
}); 

func = (stats = null) =>{
    //console.log(JSON.stringify(stats));
    stats = JSON.stringify(stats);
    
    let forme =  `
                <h2>Systeme votes</h2>
                <form id='form' action="/servise1" method="get">
                </form>
                <script src='http://fe.it-academy.by/JQ/jquery.js'></script>
                <script>
                //read quetions.txt with ajax
                        
		var newStats = {}; //create hash questions:votes
                if (${stats}){
                    ${stats}.forEach((item, index) =>{
                        var a = Object.keys(item)[0];
                        newStats[a] = item[a];
                    })
                }                
                // create form
		    var questions = null;
                    $.ajax(('/questions'),
                    { type:'GET', dataType:'text', success:dataLoaded, error:errorHandler }
                     );
                    function dataLoaded(data) {                                          
                        questions = JSON.parse(data);
                        
                        createForm(questions);
                        
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
                       input.id = item;
                       input.name = "vote";
                       input.value = item;
                       var label = document.createElement('label');
                       var textLabel = document.createTextNode(item);
                       (Object.keys(newStats).length)?textSpan = document.createTextNode(newStats[item]):textSpan = document.createTextNode('');
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
		}              
                </script>
                `;
                return forme;
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
