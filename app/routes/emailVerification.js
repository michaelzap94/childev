var express = require("express");
var router = express.Router();
var passport = require('passport');
var crypto = require("crypto");

var isLoggedIn = require("../middlewares/isLoggedIn");
var sendEmail = require('../email/mailer.js');

var Nursery = require("../schemas/admin/nursery.js");
var Teacher = require("../schemas/teacher/teacherSchema.js");
var Parent = require("../schemas/parent/parentSchema.js");


    
//-----------------------------------------------------------------    
    router.get('/activate/:accountType',function(req,res){
          var accountType= req.params.accountType,
              activationhash =req.query.activationhash;
          
          

        if(accountType==='nursery'){
            
            Nursery.findOne({'username': req.query.username},function(err, foundUser){
                if(err){
                    console.log(err);
                    req.flash("error",err.message);//err is from "passport package"
                    return res.redirect("/");
    
                }else{
                    
                    if(activationhash===foundUser.activationhash){
                        if(foundUser.active===0){
                            foundUser.active = 1;
                            foundUser.save(function(err, user){
                                if(err){
                                    console.log(err);
                                } else {
                                    req.flash("success","You are successfully registered, You can log in as a Manager now." );
                                    res.redirect("/");
                                }
                            });
                        }else{
                           req.flash("error","You are already registered." );
                           res.redirect("/");

                        }
                    }else{
                        req.flash("error","The link has expired or is incorrect, Try clicking on the link we sent you again." );
                        res.redirect("/");
                    }    
                      

               }
       
          });
                
            
            
        }else{
          res.render('404.ejs'); 
        }
        
    });
        
        
    
//-------------------------------------------------------------------------------------------
    /**
     * Renders the form to register parent or teachers, only if the activationhash and nurseryId match
     *
     */

    router.get('/activate/:accountType/:nurseryId',function(req,res){
          var accountType= req.params.accountType, 
              nurseryId = req.params.nurseryId, 
              activationhash = req.query.activationhash,
              username=req.query.username;
        
    
        if(accountType==='teacher'){
            Nursery.findOne({'_id':nurseryId,'activationhash':activationhash},function(err,foundNursery){
                if(err){
                    console.log(err.message);
                    req.flash("error",err.message);//err is from "passport package"
                    return res.redirect("/");
    
                }else{
                    res.render('registrationForms/teacherRegister.ejs',{nurseryObj:foundNursery, username:username });

                }
            });

        }else if(accountType==='parent'){
            Nursery.findOne({'_id':nurseryId,'activationhash':activationhash},function(err,foundNursery){
                if(err){
                    console.log(err.message);
                    req.flash("error",err.message);//err is from "passport package"
                    return res.redirect("/");
    
                }else{
                    res.render('registrationForms/parentRegister.ejs',{nurseryObj:foundNursery, username:username});

                }
            });

        }else{
          res.render('404.ejs'); 
        }
    });



module.exports = router;