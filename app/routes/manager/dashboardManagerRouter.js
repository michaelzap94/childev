 var express = require("express");
var router = express.Router();
var passport = require('passport');
var isLoggedIn = require("../../middlewares/isLoggedIn");
var sendEmail = require('../../email/mailer.js');

var Nursery = require("../../schemas/admin/nursery.js");
var Teacher = require("../../schemas/teacher/teacherSchema.js");
var Parent = require("../../schemas/parent/parentSchema.js");
  
 
 
  
  router.get('/', isLoggedIn.isLoggedInNext,function(req,res){
       res.render('dashboards/manager/managerDashboard.ejs');
        
    });
  
  
   router.get('/teachers',isLoggedIn.isLoggedInNext,function(req,res){
        Nursery.findById(req.user._id).populate("teacher").exec(function(err, populatedDataTeachers){
            if(err){
                console.log(err);
            } else {
                //pass to the ejs an array of objects containing all of the teachers' data that work for this nursery
                res.render('dashboards/manager/managerTeachers.ejs',{populatedDataTeachers:populatedDataTeachers.teacher});
            }
        });
        
    });
    router.get('/parents',isLoggedIn.isLoggedInNext,function(req,res){
        Nursery.findById(req.user._id).populate("parent").exec(function(err, populatedDataParents){
            if(err){
                console.log(err);
            } else {
                //pass to the ejs an array of objects containing all of the teachers' data that work for this nursery
                res.render('dashboards/manager/managerParents.ejs',{populatedDataParents:populatedDataParents.parent});
            }
        });
       
        
    });
    
    /***********CALLBACK INSIDE CALLBACK INSIDE CALLBACK to beat Async ****/
    function findUser(req,res,email,parentOrTeacher,loopnow,cb){
        //populates teachers or parents and return Teacher or Parent Fields empty if email does not exists in that db
             var existsInPopulated = false;
         Nursery.findById(req.user._id).populate(parentOrTeacher,null,{username:email}).exec(function(err,userFound){
            if(err){
               return res.send({error:'Sorry this id was not found'});
            }else{
               
               if(userFound[parentOrTeacher].length>0){
                   existsInPopulated = true;
                    return loopnow(res,email,parentOrTeacher,existsInPopulated,userFound,cb);
               }else{
                    return loopnow(res,email,parentOrTeacher,existsInPopulated,userFound,cb);
               }
              
                
            }
    });
    
    }
    
    function myloopnow(res,email,parentOrTeacher,existsInPopulated,userFound,checktosend){
         var inserted = 0;
          var exists = false;
         
            var arr;
            if(parentOrTeacher==='teacher'){
               arr= userFound.waitingRegistrationTeachers; 
               
            }else if(parentOrTeacher==='parent'){
               arr= userFound.waitingRegistrationParents; 

            }
            
            
          arr.forEach(function(emailFoundArr){
                    ++inserted;
                    if(email==emailFoundArr){
                           exists = true;
                        
                       }  
                       if(inserted==arr.length && exists==true){
                            
                           return checktosend(exists,existsInPopulated,email,parentOrTeacher, userFound,res);
                        }
                       if(inserted==arr.length && exists==false){
                           return checktosend(exists,existsInPopulated,email,parentOrTeacher,userFound,res);
                        }
                    });//loop
                  
    }
    
    function mycheck(check,existsInPopulated,email,parentOrTeacher,userFound,res){
        if(check){
            return res.send({error:"Sorry, Email has already been sent, try clicking on the 'Re-send Link' button"});
        }else if(existsInPopulated){
            return res.send({error:"User is already registered."});

            }else{
             sendEmail.sendConfirmationEmail(email,userFound.activationhash,parentOrTeacher,userFound._id,function(statusCode){
                                if(statusCode==202){
                                    if(parentOrTeacher==='teacher'){
                                        userFound.waitingRegistrationTeachers.push(email);
                                    }else if(parentOrTeacher==='parent'){
                                        userFound.waitingRegistrationParents.push(email);
                                    }
                                    userFound.save(function(err, savedUser){
                                        if(err){
                                            return res.send({error:err});
                                            
                                        }else{
                                             return res.send({parentOrTeacher:parentOrTeacher,email:email, success:"Registration link successfully sent to "+email});
                                             
                                       }
                                    });  
                                       
                                }else{
 
                                    return res.send({error:"Sorry,something went wrongSorry and the email could not be sent. Please contact the Childev Administrator."});
                                    
                                }
                            });//sendEmail
        }
        
       
    }
    
    router.post('/sendlink',isLoggedIn.isLoggedInNext,function(req,res){
            if(req.body.emailTeacher){
                return  findUser(req,res,req.body.emailTeacher,'teacher',myloopnow,mycheck);
            }else{
                return  findUser(req,res,req.body.emailParent,'parent',myloopnow,mycheck);
            }

    });
        /***********CALLBACK INSIDE CALLBACK INSIDE CALLBACK to beat Async ****/
        
        router.get('/resendlink/:email',isLoggedIn.isLoggedInNext,function(req, res) {
            
             sendEmail.sendConfirmationEmail(req.params.email,req.user.activationhash,req.query.parentOrTeacher,req.user._id,function(statusCode){
                                if(statusCode==202){
                                    
                                    return res.send({success:"Registration link successfully sent to "+req.params.email});
                                }else{
                                    return res.send({error:"Sorry,something went wrongSorry and the email could not be sent. Please contact the Childev Administrator."});
                                }
                            });//sendEmail
        });
        router.get('/removeFromPending/:email',isLoggedIn.isLoggedInNext,function(req, res) {
           

            if(req.query.parentOrTeacher==='teacher'){
                Nursery.update(
                  { _id: req.user._id },
                  { $pull: { waitingRegistrationTeachers: { $in: [ req.params.email ] } } },function(err,dataRet){
                      if(err){
                         return res.send({error: 'Sorry, something went wrong when trying to remove element.'});
                      }else{
                        return res.send({email:req.params.email, success: 'Successfully removed '+req.params.email+' from list.'});
                      }
                  }
                );
            }else if(req.query.parentOrTeacher==='parent'){
                 console.log('got here p');
                Nursery.update(
                  { _id: req.user._id },
                  { $pull: { waitingRegistrationParents: { $in: [ req.params.email ] } } },function(err,dataRet){
                      if(err){
                         return res.send({error: 'Sorry, something went wrong when trying to remove element.'});
                      }else{
                        return res.send({email:req.params.email, success: 'Successfully removed '+req.params.email+' from list.'});
                      }
                  }
                );
            }else{
                return res.send({error:"You have to specify the parameter 'parentOrTeacher' "})
            }

        });

//******************************************************************************************************/
function deleteUserReference(req,res,objToRemove,label){
    if(label==='teacher'){
      Nursery.update(
                  { _id: req.user._id },
                  { $pull: { teacher: { $in: [ objToRemove ] } } },function(err,dataRet){
                      if(err){
                             return res.send({error: 'Error deleting user'});
                      }else{
                            return res.send({success: 'User successfully deleted.'});
                      }
                  }
                );
    }else if(label==='parent'){
     Nursery.update(
              { _id: req.user._id },
              { $pull: { parent: { $in: [ objToRemove ] } } },function(err,dataRet){
                  if(err){
                         return res.send({error: 'Error deleting user'});
                  }else{
                        return res.send({success: 'User successfully deleted.'});
                  }
              }
            );
    }            
                
}

function deleteUser(req,res,schema,idFromQuery,label){
     schema.findByIdAndRemove(idFromQuery,function(err,dataReturned){
        
        if(err){
            return res.send({error: 'Error deleting user'});
        }
        else{
            deleteUserReference(req,res,dataReturned,label);
        }
    });
}

router.get("/deleteUser/:label/:id",function(req,res){
        var idFromQuery = req.params.id;
        var label = req.params.label;
        if(label==='teacher'){
             return deleteUser(req,res,Teacher,idFromQuery,label);
        }else if(label==='parent'){
             return deleteUser(req,res,Parent,idFromQuery,label);
        }else if(label==='child'){
           // return deleteUser(res,Children,idFromQuery); not implemented yet
        }
    
       
   
});



module.exports = router;