var express = require("express");
var router = express.Router();
var passport = require('passport');
var isLoggedIn = require("../middlewares/isLoggedIn");

var User = require("../schemas/admin/user.js");
var Teacher = require("../schemas/teacher/teacherSchema.js");
var Parent = require("../schemas/parent/parentSchema.js");


//------------------------------------------------------------------
    router.get('/nursery',function(req, res) {
        res.render('./registrationForms/nurseryRegister.ejs');
    });
    
//-----------------------------------------------------------------    
    router.post('/nursery',function(req,res){
         req.logout();
         var newUser = new User({username:req.body.username});
         newUser.label='nursery';
    newUser.managerDetails.push({
            firstname:req.body.firstname,
            lastname:req.body.lastname,
            label:'manager',
            contactnumber:req.body.contactnumber
            
        });
    

   User.register(newUser,req.body.password,function(err,dataRetUser){
       if(err){
           
           req.flash("error",err.message);//err is from "passport package"
                  return res.redirect("back");
    
         }
       
       else{
           
           passport.authenticate("user")(req,res,function(){
               req.flash("success","successfully registered " );

               res.redirect("/dashboard/manager");
           });
       }
       
       
   });
        
        
    });
        
        
        
//////////////////////////////////////////////
        router.get('/teacher',function(req, res) {
        res.render('./registrationForms/teacherRegister.ejs');
    });
    
    
    router.post('/teacher',function(req,res){
         req.logout();
         var newUser = new Teacher({username:req.body.username});
    newUser.details.push({
            firstname:req.body.firstname,
            lastname:req.body.lastname
            });
    


   Teacher.register(newUser,req.body.password,function(err,dataRetUser){
       if(err){
           
           req.flash("error",err.message);//err is from "passport package"
                  return res.redirect("back");
    
         }
       
       else{
           
           passport.authenticate("teacher")(req,res,function(){
               req.flash("success","successfully registered " +dataRetUser.username);

               res.redirect("/dashboard/teacher");
           });
       }
       
       
   });
        
        
    });
/////////////////////////////////////////////////////////////
    router.get('/parent',function(req, res) {
        res.render('./registrationForms/parentRegister.ejs');
    });
    
    
    router.post('/register/parent',function(req,res){
         req.logout();
         var newUser = new Parent({username:req.body.username});
    newUser.details.push({
            firstname:req.body.firstname,
            lastname:req.body.lastname,
        });
    


   Parent.register(newUser,req.body.password,function(err,dataRetUser){
       if(err){
           
           req.flash("error",err.message);//err is from "passport package"
                  return res.redirect("back");
    
         }
       
       else{
           
           passport.authenticate("parent")(req,res,function(){
               req.flash("success","successfully registered " +dataRetUser.username);

               res.redirect("/dashboard/parent");
           });
       }
       
       
   });
        
        
    });
    
    
//-------------------------------------------------------------------------------------------
module.exports = router;