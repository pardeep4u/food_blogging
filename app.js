// ONLY REQUIRE OR IMPORT 

const express = require('express');
const bodyParser = require('body-parser');
const router = require("./routes/router");
const mongoose = require("mongoose");
const session = require("express-session");
const mongodbStore = require("connect-mongodb-session")(session);
const csrf = require("csurf");
require("dotenv").config();






// ONLY SETTING FOR SERVER LIKE PUBLIC FOLDER OR VIEW ENGINE


const app = express();
app.use(bodyParser.urlencoded({extended:false}));
app.set('view-engine','ejs');
app.use(express.static('public'));
const csrfProtection = csrf();  // CSRF is a middleware.

const store = new mongodbStore({
    uri:process.env.URI,
    collection:"session"
})
app.use(session({
    secret:"This key is just for testing and Fun",
    saveUninitialized:false,
    resave:false,
    store:store
}));


app.use(csrfProtection);







// ONLY HANDLING ROUTES





app.use("/",router);






// 404 error

app.use( (req,res,next) =>{ 
    res.send("<h1>Sorry we have an Error 404!</h1>");
});




// CONNECTING TO SERVERS

mongoose.connect(process.env.URI, (error) => {

    if(error){

        console.log("Connection to DB failed");
        console.log(error);

    }

    else{

        console.log("Connected to DB");
        app.listen(process.env.PORT , ()=>{
            console.log("Address is http://localhost:2000");   
        });

    }

})

