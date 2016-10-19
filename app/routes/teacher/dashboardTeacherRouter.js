 var express = require("express");
var router = express.Router();
var passport = require('passport');
var isLoggedIn = require("../../middlewares/isLoggedIn");
var sendEmail = require('../../email/mailer.js');

var Nursery = require("../../schemas/admin/nursery.js");
var Teacher = require("../../schemas/teacher/teacherSchema.js");
var Parent = require("../../schemas/parent/parentSchema.js");
var Children = require("../../schemas/children/childrenSchema.js");
  
 
 
  
  router.get('/', isLoggedIn.isLoggedInNext,function(req,res){
       res.render('./dashboards/teacher/teacherDashboard.ejs');
        
    });
 router.get('/children',isLoggedIn.isLoggedInNext,function(req,res){
        Children.find({ 'teacher.id' : req.user._id}).exec(function(err, childrenFound){ //finds children whose teacher is the one with the id provided  as req.user._id
            if(err){
                console.log(err);
            } else {
                //pass to the ejs an array of objects containing all of the teachers' data that work for this nursery
                res.render('dashboards/teacher/teacherChildren.ejs',{childrenFound:childrenFound});
            }
        });
        
    });
    
     
    
module.exports = router;