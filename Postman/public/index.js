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
            paramsReq.replace(/=|\?|\&/g,'') == ""? paramsReq = '':paramsReq;
        }
       // console.log('headersReq', headersReq);
        let methodReq;
        //url validation 
        let urlReq = event.target.url.value;
        event.target.url.value = escapeHTML(event.target.url.value)
        if (urlReq == escapeHTML(urlReq)){            
            (urlReq.substring(0, 7) == 'http://' || urlReq.substring(0, 8)) == 'https://'? urlReq : urlReq = 'http://' + urlReq;
        }
        else{
            spanErr.innerHTML = 'Not valid!';
        }
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
                error:errorHandler
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
        //console.log('data to transfer: ', hashReq);
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
        data?status.innerHTML = `${data['status']}`: status.innerHTML = ``;
        spanErr.innerHTML = ``;
        resHeaders.innerHTML = '';
        data?contentType.innerHTML = `${data['Content-Type']}`:contentType.innerHTML = ``;
        data?resBody.innerHTML = `${(data['data'])}`:resBody.innerHTML = ``;        
        if (data){
            wrapper.setAttribute('class', 'wrapper')
            //console.log(data['data'])
            data['Headers'].forEach(item =>{                
                let ppp = document.createElement('p');
                ppp.innerHTML = `${Object.keys(item)} : ${item[Object.keys(item)]}`;
                resHeaders.appendChild(ppp);
            })
        }
        else{
            wrapper.setAttribute('class', '_infoHide')
        }
        data?resPreview.innerHTML = `${(data['data'])}`:resPreview.innerHTML = '';
        
    }
    //show Request list
    function showList(){
        storeUl.innerHTML = '';
        dataStore.forEach(item =>{            
            let request = document.createElement('li');            
            request.innerHTML = item.url;
            request.id = item.id;
            request.className = '_notActive';
            storeUl.appendChild(request);
        })
    }
    
    //add input fields
    let createInput = (name, nameVal, nameClass) =>{ 
        name.classList.add(nameClass);       
        name.name = nameVal;
        name.type = 'text';
        name.setAttribute('size', 10);    
    }  

    //listen buttons
    $("#store").on( "click", function( event ) {
        let liArr = document.getElementsByTagName('li');
        for (let i = 0; i < liArr.length; i++){
            if (liArr[i].id == event.target.id){
                liArr[i].className = '_active';
            }
            else {
                liArr[i].className = '_notActive';
            }
        }
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
        bodyData = '';
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
        createInput(paramsKey, 'paramsKey', 'params');
        createInput(paramsValue, 'paramsValue', 'params');   
        divNewParamsFields.appendChild(paramsKey);
        divNewParamsFields.appendChild(paramsValue);
        divParams.appendChild(divNewParamsFields);
    }); 
    $("#headersButton").on( "click", function( event ) {
        let headersKey = document.createElement('input');
        let divNewHeaderFields = document.createElement('div');        
        let headersValue = document.createElement('input');
        createInput(headersKey, 'headersKey','headers');
        createInput(headersValue, 'headersValue', 'headers');   
        divNewHeaderFields.appendChild(headersKey);
        divNewHeaderFields.appendChild(headersValue);
        divHeaders.appendChild(divNewHeaderFields);        
    });
    
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
    bodyQuise()