async function bodyQuise(){


var newStats = {}; //create hash questions:votes
// create form
var questions = null;
$.ajax(('/variants'),
{ type:'GET', dataType:'json', success:dataLoaded, error:errorHandler }
);
function dataLoaded(data) {  
    var questions = data;  
    //console.log(questions);                                    
    $.ajax(('/stats'),
    { type:'GET', dataType:'text',  success:dataUploaded}
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
        console.log(newStats);
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
        (Object.keys(newStats).length)?textSpan = document.createTextNode(newStats[voteCode]):textSpan = document.createTextNode('');
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
                        console.log(data);
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
}
bodyQuise()