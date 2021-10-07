
var form = document.getElementById('form');
var divParams = document.getElementById('params');
var divBody = document.getElementById('body');

$("form").on( "submit", function( event ) {
    let paramsReq = {};
    let bodyReq = {};
    let hashReq = [];    
    let inputsHeaders = document.querySelectorAll('.params'); 
    let inputsBody = document.querySelectorAll('.body'); 
    //let inputs = document.querySelectorAll('.params'); 
    event.preventDefault();
    let methodReq;
   // console.log(event.target.paramsKey);
    let urlReq = event.target.url.value;
    let getReq = event.target.get.checked;
    let paramsKey = event.target.paramsKey.value;
    let headersReq = event.target.headers.value;
    getReq?methodReq = 'GET': methodReq = 'POST';
    hashReq = [{'url': urlReq}, {'method':methodReq}, {'Params':paramsReq}, , {'Headers':headersReq}, {'Body': bodyReq}]
    
    for(let i = 0; i < inputsHeaders.length / 2; i++){
        paramsReq[inputsHeaders[2*i].value] = inputsHeaders[2*i+1].value;
    }
    for(let i = 0; i < inputsBody.length / 2; i++){
        bodyReq[inputsBody[2*i].value] = inputsBody[2*i+1].value;
    }
    console.log(paramsReq);
    console.log(bodyReq);
    console.log('hashReq: ', hashReq);
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