 var express = require("express");
var router = express.Router();
var passport = require('passport');
var isLoggedIn = require("../../middlewares/isLoggedIn");
var sendEmail = require('../../email/mailer.js');

var Nursery = require("../../schemas/admin/nursery.js");
var Teacher = require("../../schemas/teacher/teacherSchema.js");
var Parent = require("../../schemas/parent/parentSchema.js");
  
 
 
  
  router.get('/', isLoggedIn.isLoggedInNext,function(req,res){
       res.render('./dashboards/teacher/teacherDashboard.ejs');
        
    });
  
  
    
     
    
module.exports = router;