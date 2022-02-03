const axios = require('axios');


exports.homepage = (req,res) => {
    res.render('homepage');
}


exports.signup = (req,res) => {
    axios.post('http://localhost:3000/api/signup',req.body)
    .then(function(result){
        res.redirect('http://localhost:3000');
    }).catch(err=>{
        res.send(err);
    })
}


exports.login = async (req,res) => {
    let result = await axios.post('http://localhost:3000/api/login',req.body);
    if(result.data.length == 0){
        res.redirect('/');
    }else{
        let password = result.data[0].password;
        if(req.body.password == password){
            req.session.email = req.body.email;
            res.redirect('/dashboard');
        }else{
            res.redirect('/');
        }      
    }
}

exports.dashboard = async (req,res) => {
    if(req.session.email){
        let result = await axios.post('http://localhost:3000/api/login',{email:req.session.email});
        let _user_info = {};
        _user_info.name = result.data[0].name;
        _user_info.email = result.data[0].email;
        _user_info.balance = result.data[0].balance;
        res.render('dashboard',{user_info:_user_info});
    }else{
        res.send("UnAuthorize Access");
    }
}


exports.history = async (req,res) => {
    if(req.session.email){
        let result = await axios.post('http://localhost:3000/api/login',{email:req.session.email});
        res.render('history',{deposit:result.data[0].deposit_transactions,withdraw:result.data[0].withdrawal_transactions});
    }else{
        res.send("UnAuthorize Access");
    }
}


exports.logout = (req,res) => {
    req.session.destroy(function(err){
        if(err){
            res.send(err);
        }else{
            res.redirect('/');
        }
    })
}