async function bodyQuise(){
let form = document.getElementById('form');
let divParams = document.getElementById('params');
let divBody = document.getElementById('body');
let divHeaders = document.getElementById('headers');
let pUrl = document.getElementById('pUrl');
let pMethod = document.getElementById('pMethod');
let pParams = document.getElementById('pParams');
let pHeaders = document.getElementById('pHeaders');
let pBody = document.getElementById('pBody');
let spanErr = document.getElementById('urlError');
let headersBody = document.getElementById('headersBody');
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

    if (divBody.className === 'body _active'){
        getData (bodyReq, inputsBody);
    }
    else {
        bodyReq = inputsBody[0].value;
    }

    function getData(nameField, nameReq) {
        for(let i = 0; i < nameReq.length / 2; i++){
            nameField[nameReq[2*i].value] = nameReq[2*i+1].value;
        }
    }
    if(urlReq){
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
            spanErr.innerHTML = ``;
            pMethod.innerHTML = `Method: ${methodReq}`;
            //console.log(this)
            /*
            !paramsReq?pParams.innerHTML = `Params: null`:pParams.innerHTML = `Params: ${paramsReq}`;
            !headersReq?pHeaders.innerHTML = `Headers: null`:pHeaders.innerHTML = `Headers: ${headersReq}`;
            !bodyReq?pBody.innerHTML = `Body: null`:pBody.innerHTML = `Body: ${bodyReq}`;
            */
        }                  
    function errorHandler(jqXHR,statusStr,errorStr) {
        alert(statusStr+' '+errorStr);
    }
    }
    else {
        spanErr.innerHTML = `Cann't be empty!`;
    }
}); 
let createInput = (name, nameClass) =>{
    name.classList.add(nameClass);
    name.name = name;
    name.type = 'text';
    name.size = '50';    
}
$("#bodyButtonChange").on( "click", function( event ) {
    if (divBody.className === 'body _active'){        
        divBody.className = 'body _hiden';
        headersBody.className = '_active';
    }
    else {
        console.log('here')
        divBody.className = 'body _active';
        headersBody.className = '_hiden';
    }
});
$("#paramsButton").on( "click", function( event ) {
    let paramsKey = document.createElement('input');
    let divNewParamsFields = document.createElement('div');
    let paramsValue = document.createElement('input');
    createInput(paramsKey, 'params');
    createInput(paramsValue, 'params');   
    divNewParamsFields.appendChild(paramsKey);
    divNewParamsFields.appendChild(paramsValue);
    divNewParamsFields.appendChild(paramsValue);
    divNewParamsFields.appendChild(paramsValue);
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