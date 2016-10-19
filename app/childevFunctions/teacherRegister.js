var passport = require('passport');
var Teacher = require("../schemas/teacher/teacherSchema.js");

function registerTeacher(req,res,newUser, password,foundNursery){
                

                    Teacher.register(newUser,password,function(err,userRegisterd){ //then register
                       if(err){
                           req.flash("error",err.message);//err is from "passport package"
                                  return res.redirect("back");
                    
                         }else{
                             
                             //then add teacher to that nursery
                             foundNursery.teacher.push(userRegisterd);
                             foundNursery.save(function(err, data){
                                if(err){
                                    console.log(err);
                                } else {
                  
                                        foundNursery.update({ $pull: { waitingRegistrationTeachers : { $in: [ userRegisterd.username ] }  } },function(err,dataRet){
                                              if(err){
                                                  req.flash('error','Sorry, something went wrong when trying to remove element.');
                                                  res.redirect('back');
                                                  console.log('error removing');
                                              }else{
                                                 passport.authenticate('teacher')(req,res,function(){
                                                     
                                                        
                                                            req.flash("success","Successfully registered " +userRegisterd.username);
                                                            res.redirect("/dashboard/teacher/"+req.user._id);
                                                        
                                                        
                                                    });
                                                  
                                              }
                                          }
                                        );//foundNursary.update, removes the teacher from the waiting registration list in the manager's view

                                }
                            });
                        }
               
                   });//Teacher.register
    }

module.exports = {
    registerTeacher:registerTeacher
}