const express=require('express');
const route = express.Router();
const services = require('../services/render');
const controller = require('../controller/controller');

route.get('/',services.homepage);

route.post('/signup',services.signup);

route.post('/login',services.login);


route.get('/dashboard',services.dashboard);


route.get('/history',services.history);


route.get('/logout',services.logout);


//API
route.post('/api/signup',controller.create);
route.post('/api/login',controller.find);
route.post('/api/withdraw',controller.withdraw);
route.post('/api/deposit',controller.deposit);
route.post('/api/request',controller.request);


module.exports = route;