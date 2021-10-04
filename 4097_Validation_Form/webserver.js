const express = require('express');
const webserver = express();
const port = 4097;
webserver.use(express.urlencoded({extended:true}));
var response = '';
let checkLogin = /[A-z0-9]{4,8}$/;
let checkPassword = /[A-z0-9#$_]{6,10}$/;
var messageLogin = 'Login should only consist of letters and numbers, be 4-8 characters long and not be empty!';
var messagePassword = 'The password should only consist of letters, numbers and symbols #, $, _. 6-10 characters long and not be empty!';

answer =(login, password) =>{    
    return `<div>\
                <h4>Please fill this form</h4>\
                <form action="/check" method="POST">\
                    <p><input name="login" value =${login}> 
                    <input type="password" name="password" value=${password}></p>\
                    <p><input type="submit"></p>\
                </form>\
            </div>`;
}
webserver.get('', (req, res) => {
    res.send(answer('', ''));
});
webserver.get('/answer', (req, res) => {
    
    res.send(response);
});
webserver.post('/check', (req, res) => { 
    var formAswer = answer(req.body.login, req.body.password);
    console.log(req.body.login, req.body.password )
    if((req.body.login && checkLogin.exec(req.body.login)) && (req.body.password && checkPassword.exec(req.body.password))){
        response = `<div>\
                    <p>Your login is: ${req.body.login} </p> \n \
                    <p>Your password is: ${req.body.password}</p>\
                </div>
                <a href="/" style='text-decoration:none; color:red'>Main page</a>`

        return res.redirect('/answer');
    }
    else if(req.body.login === undefined || req.body.password === undefined){
        var login = '';
        var password = '';
        response = answer(login, password);
    }
    else{
        checkLogin.exec(req.body.login)? classMessageLogin = 'display:none;': classMessageLogin = 'display:block;';
        checkPassword.exec(req.body.password)? classMessagePassword = 'display:none;': classMessagePassword = 'display:block;';
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
