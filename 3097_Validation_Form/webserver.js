const express = require('express');
const webserver = express();
const port = 7580;
webserver.use(express.urlencoded({extended:true}));
let response = '';
webserver.get('/servise1', (req, res) => { 
    //console.log(req.query.login, req.query.password )
    if(!req.query.login || !req.query.password){
        response = '<div>\
                        <h3 style="color: red;">Your data is not correct!<h3> \n\
                        <h4>Please fill this form</h4>\
                        <form action="http://178.172.195.18:7580/servise1" method="get">\
                            <p><input name="login"> <input type="password" name="password"></p>\
                            <p><input type="submit"></p>\
                        </form>\
                    </div>';
    }
    else{
        response = `<div>\
                        <p>Your login is: ${req.query.login} </p> \n \
                        <p>Your password is: ${req.query.password}</p>\
                    </div>`
    }
    res.send(response);
    
}); 

webserver.listen(port,()=>{ 
    console.log("web server running on port " + port);
}); 