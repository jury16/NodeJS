async function bodyQuise(){
    let wrapper = document.getElementById('wrapper');
    let form = document.getElementById('form');
    let url = document.getElementById('url');
    let get = document.getElementById('get');
    let none = document.getElementById('none');
    let divParams = document.getElementById('params');
    let divBody = document.getElementById('body');
    let divHeaders = document.getElementById('headers');
    let status = document.getElementById('status');
    let contentType = document.getElementById('contentType');
    let resBody = document.getElementById('resBody');
    let resHeaders = document.getElementById('resHeaders');
    let resPreview = document.getElementById('resPreview');
    let title = document.getElementById('title');
    let spanErr = document.getElementById('urlError');
    let storeUl = document.getElementById('store');
    let dataStore = [];
    let count = 0;   
    let idToDelete = 0;
    $('input[name="bodyType"]').on('click', function(event) {
        event.target.id == 'none'? divBody.setAttribute('class','body _hiden'):divBody.setAttribute('class','body _active');    
    });
    $("form").on( "submit", function( event ) {
        event.preventDefault();
        let paramsReq = '';
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
        // create headers hash
        for(let i = 0; i < inputsHeaders.length / 2; i++){
            headersReq[inputsHeaders[2*i].value] = inputsHeaders[2*i+1].value;
        }
        // create params string
        if (inputsParams.length){
            paramsReq = "?"
            for(let i = 0; i < inputsParams.length / 2; i++){                                         
                paramsReq = paramsReq + `${inputsParams[2*i].value}=${inputsParams[2*i+1].value}&`             
            }
            paramsReq = paramsReq.slice(0, -1);
            paramsReq == "?="? paramsReq = null:paramsReq;
        }
        
        let methodReq;
        let urlReq = event.target.url.value;
        let bodyReq = event.target.body.value;
        let getReq = event.target.get.checked;
        getReq?methodReq = 'GET': methodReq = 'POST';
        hashReq = {'url': urlReq, 'method':methodReq, 'params':paramsReq, 'headers':headersReq, bodyType: bodyParam , body: bodyReq};
                
        if(urlReq){
            $.ajax(('/request'),{ 
                type:'POST', 
                'Content-type': 'application/json',
                "Access-Control-Allow-Origin" :"*",
                data: (hashReq),
                success: dataLoaded, 
                //error:errorHandler
            });
            function dataLoaded(data){
                store(data); 
                showInfo(data);            
            }                  
            function errorHandler(jqXHR,statusStr,errorStr) {
                alert(statusStr+' '+errorStr);
            }
        }
        else {
            spanErr.innerHTML = `Cann't be empty!`;
        }
        
    }); 

    //Requests store
    function store (data){   
        ++count;
        data.id = count;
        dataStore.push(data);    
        showList();        
    }
    //show request info
    function showInfo(data = null){
        title.innerHTML = 'Received data'
        data?status.innerHTML = `Status:  ${data['status']}`: status.innerHTML = ``;
        spanErr.innerHTML = ``;
        resHeaders.innerHTML = '';
        data?contentType.innerHTML = `Content-Type: ${data['Content-Type']}`:contentType.innerHTML = ``;
        data?resBody.innerHTML = `Body: ${JSON.stringify(data['data'])}`:resBody.innerHTML = ``;
        resHeaders.innerHTML = 'Headers';
        if (data){
            wrapper.setAttribute('class', 'wrapper')
            console.log(data['Headers'])
            data['Headers'].forEach(item =>{                
                let ppp = document.createElement('p');
                ppp.innerHTML = `${Object.keys(item)} : ${item[Object.keys(item)]}`;
                resHeaders.appendChild(ppp);
            })
        }
        else{
            wrapper.setAttribute('class', '_infoHide')
        }
        
        resPreview.innerHTML = `Body preview: `;
    }
    //show Request list
    function showList(){
        storeUl.innerHTML = '';
        dataStore.forEach(item =>{            
            let request = document.createElement('li');            
            request.innerHTML = item.url;
            request.id = item.id;
            storeUl.appendChild(request);
        })
    }
    
    //add input fields
    let createInput = (name, nameClass) =>{
        name.classList.add(nameClass);
        name.name = name;
        name.type = 'text';
        name.size = '50';    
    }  

    //listen buttons
    $("#store").on( "click", function( event ) {
        idToDelete = event.target.id;
        dataStore.forEach(item =>{
            if (item.id == idToDelete){
                showInfo(item);
            }
        })
        //console.log(event.target);
        
    });
    $("#deleteItem").on( "click", function( event ) {
        if (idToDelete){
           let arr = [];
           for (let i = 0; i < dataStore.length; i++){
               if (dataStore[i].id != idToDelete){
                arr.push(dataStore[i]);  
               }                            
           }
           dataStore = arr;
           showList();
           showInfo();        
        }        
    }); 
    $("#deleteAll").on( "click", function( event ) {
        dataStore = [];
        showList();
        showInfo();                  
                
    }); 
    $("#clear").on( "click", function( event ) {
        url.value = '';
        get.checked = true;
        none.checked = true;
        divBody.className = 'body _hiden';
        clearInputs(document.getElementsByClassName('params'));
        clearInputs(document.getElementsByClassName('headers'));
        function clearInputs(item){
            for(let i = 0; i < item.length; i++){                
                item[i].value = '';
            }
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
        divParams.appendChild(divNewParamsFields);
        paramsKey.setAttribute('size', 'auto');
        paramsValue.setAttribute('size', 'auto');
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
        headersKey.setAttribute('size', 'auto');
        headersValue.setAttribute('size', 'auto');
        
    });
    
    }
    bodyQuise()