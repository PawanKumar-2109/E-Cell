const express = require('express');
const bodyparser = require('body-parser');
const path = require('path');
const session = require('express-session');



const connectDB = require('./server/database/connection');

connectDB();


const app = express();
const port = 3000;

app.use(session({
    secret:"Pawan",
    resave:false,
    saveUninitialized:false
}))
 
app.use(bodyparser.json());
app.use(bodyparser.urlencoded({extended:true}));
app.set('view engine','ejs');


app.use('/css',express.static(path.resolve(__dirname,'assets/css')));
app.use('/img',express.static(path.resolve(__dirname,'assets/img')));
app.use('/js',express.static(path.resolve(__dirname,'assets/js')));


app.use('/',require('./server/routes/router'));

app.listen(port,()=>{
    console.log(`Server Started at http://localhost:${port}`);
})
