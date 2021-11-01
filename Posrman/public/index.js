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
    $('input[name="bodyType"]').on('click', function(event) {
        event.target.id == 'none'? divBody.setAttribute('class','body _hiden'):divBody.setAttribute('class','body _active');    
    });
    $("form").on( "submit", function( event ) {
        event.preventDefault();
        let paramsReq = {};
        let headersReq = {};
        let hashReq = []; 
        let bodyParam = ''   ;
        let inputsParams = document.querySelectorAll('.params'); 
        let inputsHeaders = document.querySelectorAll('.headers'); 
        let inputsBodyReq = event.target.bodyType; 
        for (let i = 0; i < inputsBodyReq.length; i++){
            if (inputsBodyReq[i].checked == true){
                bodyParam = inputsBodyReq[i].id;
                break;
            }
        } 
        let methodReq;
        let urlReq = event.target.url.value;
        let bodyReq = event.target.body.value;
        let getReq = event.target.get.checked;
        getReq?methodReq = 'GET': methodReq = 'POST';
        hashReq = {'url': urlReq, 'method':methodReq, 'params':paramsReq, 'headers':headersReq, bodyType: bodyParam , body: bodyReq};
        //console.log(('te"st').replace('"', ""));
        getData (headersReq, inputsHeaders);
        getData (paramsReq, inputsParams);
        function getData(nameField, nameReq) {
            for(let i = 0; i < nameReq.length / 2; i++){
                nameField[nameReq[2*i].value] = nameReq[2*i+1].value;
            }
        }
        
        if(urlReq){
            $.ajax(('/request'),{ 
                type:'POST', 
                'Content-type': 'application/json',
                "Access-Control-Allow-Origin" :"*",
                //dataType: "json",
                data: (hashReq),
                success: dataLoaded(), 
                //error:errorHandler
            });
            function dataLoaded(){
                let divData = document.getElementById('storeData');
                let title = document.getElementById('title');
                title.innerHTML = 'Data to transfer'
                pUrl.innerHTML = `URL:  ${urlReq}`;
                spanErr.innerHTML = ``;
                pMethod.innerHTML = `Method: ${methodReq}`;
                paramsReq?pParams.innerHTML = `Params: ${JSON.stringify(paramsReq)}`: paramsReq = {};
                headersReq?pHeaders.innerHTML = `Headers: ${JSON.stringify(headersReq)}`: headersReq = {};
                pBody.innerHTML = `Body: ${bodyReq}`;
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
    
    $("#paramsButton").on( "click", function( event ) {
        let paramsKey = document.createElement('input');
        let divNewParamsFields = document.createElement('div');
        let paramsValue = document.createElement('input');
        createInput(paramsKey, 'params');
        createInput(paramsValue, 'params');   
        divNewParamsFields.appendChild(paramsKey);
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
    
    }
    bodyQuise()