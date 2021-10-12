async function bodyQuise(){
let form = document.getElementById('form');
let divParams = document.getElementById('params');
let divBody = document.getElementById('body');
let divHeaders = document.getElementById('headers');
let pUrl = document.getElementById('pUrl');
let pMethod = document.getElementById('pMethod');



$("form").on( "submit", function( event ) {
    event.preventDefault();
    let paramsReq = {};
    let headersReq = {};
    let bodyReq = {};
    let hashReq = {};    
    let inputsParams = document.querySelectorAll('.params'); 
    let inputsHeaders = document.querySelectorAll('.headers'); 
    let inputsBody = document.querySelectorAll('.body');     
    let methodReq;
    let urlReq = event.target.url.value;
    let getReq = event.target.get.checked;
    getReq?methodReq = 'GET': methodReq = 'POST';
    hashReq = {'url': urlReq, 'method':methodReq, 'params':paramsReq, 'headers':headersReq, 'body': bodyReq};
    
    getData (headersReq, inputsHeaders);
    getData (paramsReq, inputsParams);
    getData (bodyReq, inputsBody);
    function getData(nameField, nameReq) {
        for(let i = 0; i < nameReq.length / 2; i++){
            nameField[nameReq[2*i].value] = nameReq[2*i+1].value;
        }
    }
    $.ajax(('/request'),{ 
                type:'POST', 
                dataType:"json", 
                data: (hashReq),
                success: dataLoaded(), 
                //error:errorHandler
            });
            function dataLoaded(){
                let divData = document.getElementById('storeData');
                pUrl.innerHTML = `URL:  ${urlReq}`;
                pMethod.innerHTML = `Method: ${methodReq} \n`;
               // divData.innerHTML = 'success!' ;
            }   
            
        
        function errorHandler(jqXHR,statusStr,errorStr) {
            alert(statusStr+' '+errorStr);
        }
}); 
let createInput = (name, nameClass) =>{
    name.classList.add(nameClass);
    name.name = name;
    name.type = 'text';
    name.size = '50';    
}
$("#paramsButton").on( "click", function( event ) {
    let paramsKey = document.createElement('input');
    let divNewParamsFields = document.createElement('div');
    let paramsValue = document.createElement('input');
    createInput(paramsKey, 'params');
    createInput(paramsValue, 'params');   
    divNewParamsFields.appendChild(paramsKey);
    divNewParamsFields.appendChild(paramsValue);
    divParams.appendChild(divNewParamsFields);
}); 
$("#headersButton").on( "click", function( event ) {
    let headersKey = document.createElement('input');
    let divNewHeaderFields = document.createElement('div');
    let headersValue = document.createElement('input');
    createInput(headersKey, 'headers');
    createInput(headersValue, 'headers');   
    divNewHeaderFields.appendChild(headersKey);
    divNewHeaderFields.appendChild(headersValue);
    divHeaders.appendChild(divNewHeaderFields);
});
$("#bodyButton").on( "click", function( event ) {
    let bodyKey = document.createElement('input');
    let divNewBodyFields = document.createElement('div');
    let bodyValue = document.createElement('input');
    createInput(bodyKey, 'body');
    createInput(bodyValue, 'body');   
    divNewBodyFields.appendChild(bodyKey);
    divNewBodyFields.appendChild(bodyValue);
    divBody.appendChild(divNewBodyFields);
}); 
}
bodyQuise()