 var express = require("express");
var router = express.Router();
var passport = require('passport');
var isLoggedIn = require("../middlewares/isLoggedIn");

var User = require("../schemas/admin/user.js");
var Teacher = require("../schemas/teacher/teacherSchema.js");
var Parent = require("../schemas/parent/parentSchema.js");
  
   router.get('/manager', isLoggedIn.isLoggedInNext,function(req,res){
       res.render('./dashboards/managerDashboard.ejs');
        
    });
    
     router.get('/teacher', isLoggedIn.isLoggedInNext,function(req,res){
       res.render('./dashboards/teacherDashboard.ejs');
        
    });
     router.get('/parent', isLoggedIn.isLoggedInNext,function(req,res){
       res.render('./dashboards/parentDashboard.ejs');
        
    });
    
module.exports = router;