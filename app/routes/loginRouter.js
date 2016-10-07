var express = require("express");
var router = express.Router();
var passport = require('passport');
var isLoggedIn = require("../middlewares/isLoggedIn");

var Nursery = require("../schemas/admin/nursery.js");
var Teacher = require("../schemas/teacher/teacherSchema.js");
var Parent = require("../schemas/parent/parentSchema.js");


//--------------------------------------------------------------------------   
    
    router.get('/stuff',function(req,res){
        res.render('./loginForms/stuffLogin.ejs'); 
    });
//-------------------------------------------------------------------------      //login logic
    //middleware: some code that runs before our final callback
   router.post('/stuff/manager',passport.authenticate("nursery", {
        successRedirect: "/dashboard/manager", 
        failureRedirect: "/passportloginerror",
        failureFlash : true // allow flash messages

    }) ,function(req, res){
        
    });
    router.post('/stuff/teacher',passport.authenticate("teacher", {
        successRedirect: "/dashboard/teacher", 
        failureRedirect: "/passportloginerror",
        failureFlash : true // allow flash messages

    }) ,function(req, res){
    
    });
    
    router.post('/parent',passport.authenticate("parent", {
        successRedirect: "/dashboard/parent", 
        failureRedirect: "/passportloginerror",
        failureFlash : true // allow flash messages

    }) ,function(req, res){
    
    });
    
//--------------------------------------------------------------------------    
module.exports = router;