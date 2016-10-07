var express = require("express");
var router = express.Router();
//var middlewares = require("../config/middlewares");//an object with my custom middleware functions
var User = require("../schemas/admin/user.js");
var Teacher = require("../schemas/teacher/teacherSchema.js");
var Parent = require("../schemas/parent/parentSchema.js");
var passport = require('passport');
var isLoggedIn = require("../middlewares/isLoggedIn");


    router.get('/',function(req, res) {
            res.render('home.ejs');
        });
        
   
    router.get("/logout", function(req, res){
    
            req.logout();//passport destroys all user data in the session.(this comes with "passport package")
            req.flash("success","Logged you out");
            res.redirect('/'); //Inside a callback… bulletproof!

    });
    
 

   router.get('/passportloginerror',function(req,res){
         res.render("passportloginerror"); 
         
     });
    
    router.get('*',function(req, res) {
       res.render('404.ejs'); 
    });

   
module.exports = router;