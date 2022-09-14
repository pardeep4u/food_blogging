const blogModel = require("../model/blogModel");
const adminModel = require("../model/adminModel");
const fs = require("fs");
const path = require("path");
const { validationResult } = require("express-validator/check");

const ITEMS_PER_PAGE = 4;


const getHomepage = (req,res,next) =>{  

    var page;
    var totalItems;
    if(req.query.page === undefined){
        page = 1;
    }else{
        page = parseInt(req.query.page);
    }
   
    var hasNextPage , hasPreviousPage;

    



    blogModel.find().countDocuments().then((anwser) => {
        totalItems = anwser;

        return blogModel.find().skip((page - 1) * ITEMS_PER_PAGE).limit(ITEMS_PER_PAGE)
    }).then(items => {

        if(page < Math.ceil(totalItems / ITEMS_PER_PAGE)){
            hasNextPage = true;
        }
        if((page - 1 ) > 0){
            hasPreviousPage = true;
        }

        res.render("main.ejs",{

            item:items,
            lastPage:Math.ceil(totalItems / ITEMS_PER_PAGE),
            hasPreviousPage:hasPreviousPage,
            currentPage:page,
            hasNextPage:hasNextPage,
            loggedIn:req.session.isLoggedIn,
            csrfToken:req.csrfToken()

        });

    }).catch(err => {

        console.log(err);

    })
    
    /**
     {},(err,items)=>{

        if(err){
           
        }
        else{

           
            

        }

    });
     */
    
 
};

const getPostpage = (req,res,next) => {

    if(req.session.isLoggedIn){

        res.render("upload.ejs",{
            loggedIn:req.session.isLoggedIn,
            csrfToken:req.csrfToken()

        });

    }else{

        res.redirect("/login");

    }
    
    

};




const addPost = (req,res,next) => {

    /*

    console.log(req.body.postTitle);
    console.log(req.body.postText);
    console.log(req.body.category);

    res.send("check console!");
    res.send("check Console");

    */



    const obj = {
        title: req.body.postTitle,
        img:{
            data: fs.readFileSync(path.join(__dirname,"../" , "uploads" , req.file.filename)),
            contentType: "image/jpg"
        },
        about:req.body.postAbout,
        text:req.body.postText,
        category:req.body.category,
        lastDate: new Date().toISOString()
    }

    blogModel.create(obj, (err,item) =>{

        if(err){
            console.log(err)
        }
        else{
            item.save().then( (data)=>{

            fs.unlinkSync(path.join(__dirname ,".." , "uploads" , req.file.filename));
            res.redirect("/");

            }).catch((err)=>{
                console.log(err);
            })
            
        }

    });
 

}

const getSinglepost = (req,res,next) => {

   
    
    blogModel.find({_id:req.params.objId},(err,items)=>{

        if(err){
            console.log(err);
        }
        else{
           res.render("single.ejs",{

                item:items,
                loggedIn:req.session.isLoggedIn,
                csrfToken:req.csrfToken()

            });
        }

    });
    

}

const getLoginpage = (req,res,next) => {

    res.render("adminLogin.ejs",{
        fail:false,
        csrfToken:req.csrfToken()
    });

}


const postLogin = (req,res,next) => {

    /**
     const obj = {
        user_id:req.body.adminID,
        password:req.body.adminPass
    }


    adminModel.create(obj,(err,item) =>{

        if(err){
            console.log(err)
        }
        else{
            item.save().then( (data)=>{
            req.session.isLoggedIn = true;
            res.redirect("/");

            }).catch((err)=>{
                console.log(err);
            })
            
        }

    });
     */

    const errors = validationResult(req);
    if(!errors.isEmpty()){

        res.render("adminLogin.ejs",{
            
            csrfToken:req.csrfToken(),
            fail: errors.array()[0].msg

        })

    }else{

        adminModel.find({user_id:req.body.adminID},(err,items)=>{

            if(err){
                console.log(err);
            }
            else{
               
                
                if(items.length === 0){
                    res.render("adminLogin.ejs",{
                        csrfToken:req.csrfToken(),
                        fail: "ID Not Found"
    
                    })
                }
                else if(items[0].password === req.body.adminPass){
                    req.session.isLoggedIn = true;
                    res.redirect("/new_article");
                }
                else{
                    res.render("adminLogin.ejs",{
                        csrfToken:req.csrfToken(),
                        fail:"Incorrect password"
                    })
                }
                
                
    
            }
    
        });


    }

}

const postLogout = (req,res,next) => {

    req.session.destroy( ()=>{

        res.redirect("/");

    });

}

const getCategorypage = (req,res,next) => {

    
    

    blogModel.find( {category:req.params.food} )
    .then((items) => {

        res.render("onlyCate.ejs",{
            food:req.params.food,
            item:items,
            loggedIn:req.session.isLoggedIn,
            csrfToken:req.csrfToken()
        });

    })
    .catch((err)=>{
        console.log(err);
    })
  
}


const postDelete = (req,res,next) => {

    blogModel.deleteOne({_id:req.params.objId} , (err,data)=>{

        if(err){
            console.log(err);
        }
        else{
            
            
            res.redirect("/");

        }

    });

}


module.exports = {
    getHomepage,
    getPostpage,
    addPost,
    getSinglepost,
    getLoginpage,
    postLogin,
    postLogout,
    getCategorypage,
    postDelete
}