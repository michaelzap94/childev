var express = require("express");
var router = express.Router();
var passport = require('passport');
var isLoggedIn = require("../middlewares/isLoggedIn");

var Nursery = require("../schemas/admin/nursery.js");
var Teacher = require("../schemas/teacher/teacherSchema.js");
var Parent = require("../schemas/parent/parentSchema.js");


//--------------------------------------------------------------------------   
    
    router.get('/staff',function(req,res){
        res.render('./loginForms/stuffLogin.ejs'); 
    });
//-------------------------------------------------------------------------   

    function logoutFirst(req,res,next){
        req.logout();//passport destroys all user data in the session.(this comes with "passport package")
        next();
    }

//login logic
    //middleware: some code that runs before our final callback
   router.post('/staff/manager',logoutFirst,passport.authenticate("nursery",{
        failureRedirect: "/",
        failureFlash : true // allow flash messages

    }),function(req, res) {
    
        res.redirect('/dashboard/manager/' + req.user._id);
    
    
  });
  
    router.post('/staff/teacher',logoutFirst,passport.authenticate("teacher",{
        failureRedirect: "/",
        failureFlash : true // allow flash messages
    
    }),function(req, res){
        res.redirect('/dashboard/teacher/' + req.user._id);
    });
    
    router.post('/parent',logoutFirst,passport.authenticate("parent", {
        failureRedirect: "/",
        failureFlash : true // allow flash messages

    }) ,function(req, res){
            res.redirect('/dashboard/parent/' + req.user._id);

    });
    
//--------------------------------------------------------------------------    
module.exports = router;