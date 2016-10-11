var Nursery = require("../schemas/admin/nursery.js");
var Teacher = require("../schemas/teacher/teacherSchema.js");
var Parent = require("../schemas/parent/parentSchema.js");
 
 
     var isManager = function (req,res,next){
      if(req.user !== undefined){
          if(req.params.currentUserId==req.user._id){
                Nursery.findById(req.user._id,function(error,foundUser){
                    if(error){
                        req.logout();
                        req.flash('error',"You don't have authorization to access this type of account.");
                       return res.redirect('/');
                    }else{
                        if(foundUser){
                            return next();
                        }else{
                             req.logout();
                        req.flash('error',"You don't have authorization to access this type of account.");
                       return res.redirect('/');
                        }
                    }
                });

          }else{
           req.logout();
           req.flash('error',"You don't have authorization to access this type of account.");
           res.redirect('/');
          }
         
     }else{
      
          req.flash('error',"You don't have authorization to access this type of account.");
           res.redirect('/');
     }
  }
  var isTeacher = function (req,res,next){
      if(req.user !== undefined){
          if(req.params.currentUserId==req.user._id){
                Teacher.findById(req.user._id,function(error,foundUser){
                    if(error){
                        req.logout();
                        req.flash('error',"You don't have authorization to access this type of account.");
                        res.redirect('/');
                    }else{
                       if(foundUser){
                            return next();
                        }else{
                             req.logout();
                        req.flash('error',"You don't have authorization to access this type of account.");
                       return res.redirect('/');
                        }
                    }
                });

          }else{
           req.logout();
           req.flash('error',"You don't have authorization to access this type of account.");
           res.redirect('/');
          }
         
     }else{
      
          req.flash('error',"You don't have authorization to access this type of account.");
           res.redirect('/');
     }
  }
  var isParent = function (req,res,next){
      if(req.user !== undefined){
          if(req.params.currentUserId==req.user._id){
                Parent.findById(req.user._id,function(error,foundUser){
                    if(error){
                        req.logout();
                        req.flash('error',"You don't have authorization to access this type of account.");
                        res.redirect('/');
                    }else{
                        if(foundUser){
                            return next();
                        }else{
                             req.logout();
                        req.flash('error',"You don't have authorization to access this type of account.");
                       return res.redirect('/');
                        }
                    }
                });

          }else{
           req.logout();
           req.flash('error',"You don't have authorization to access this type of account.");
           res.redirect('/');
          }
         
     }else{
      
          req.flash('error',"You don't have authorization to access this type of account.");
           res.redirect('/');
     }
  }
module.exports={
    isManager:isManager,
    isTeacher:isTeacher,
    isParent:isParent
}