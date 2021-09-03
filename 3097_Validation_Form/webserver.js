const express = require('express');
const webserver = express();
const port = 7580;
webserver.use(express.urlencoded({extended:true}));
var response = '';
var responseMessages = '';
let checkLogin = /[a-z0-9]{4,8}$/;
let checkPassword = /[a-z0-9#$_]{6,10}$/;
var messageLogin = 'Login should only consist of letters and numbers, be 4-8 characters long and not be empty!';
var messagePassword = 'The password should only consist of letters, numbers and symbols #, $, _. 6-10 characters long and not be empty!';
answer =(login, password) =>{    
    return `<div>\
                <h4>Please fill this form</h4>\
                <form action="http://178.172.195.18:7580" method="get">\
                    <p><input name="login" value =${login}> <input type="password" name="password" value=${password}></p>\
                    <p><input type="submit"></p>\
                </form>\
            </div>`;
}
webserver.get('', (req, res) => { 
    var formAswer = answer(req.query.login, req.query.password);

    //console.log(req.query.login, req.query.password )
    if((req.query.login && checkLogin.exec(req.query.login)) && (req.query.password && checkPassword.exec(req.query.password))){
        response = `<div>\
                        <p>Your login is: ${req.query.login} </p> \n \
                        <p>Your password is: ${req.query.password}</p>\
                    </div>`
    }
    else if(req.query.login === undefined || req.query.password === undefined){
        var login = '';
        var password = '';
        response = answer(login, password);
    }
    else{
        checkLogin.exec(req.query.login)? classMessageLogin = 'display:none;': classMessageLogin = 'display:block;';
        checkPassword.exec(req.query.password)? classMessagePassword = 'display:none;': classMessagePassword = 'display:block;';
        response = `${formAswer}\
                    <h4>Data are not correct</h4>\
                    <p style=${classMessageLogin}>${messageLogin}</p>\
                    <p style=${classMessagePassword}>${messagePassword}</p>\
                    `;
    }
    res.send(response);
    
}); 
//console.log(password)
webserver.listen(port,()=>{ 
    console.log("web server running on port " + port);
}); 
