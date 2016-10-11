var express = require("express");
var router = express.Router();
var passport = require('passport');
var crypto = require("crypto");

var isLoggedIn = require("../middlewares/isLoggedIn");
var sendEmail = require('../email/mailer.js');

var Nursery = require("../schemas/admin/nursery.js");
var Teacher = require("../schemas/teacher/teacherSchema.js");
var Parent = require("../schemas/parent/parentSchema.js");

function capitalizeStarter(str) {
    var arrOfWords = str.split(/\s+/).filter(Boolean);//filters out white spaces

    var capitalizedWordArr=[];
    
    arrOfWords.forEach(function(word){
       capitalizedWordArr.push(word.charAt(0).toUpperCase() + word.slice(1));
    });

    return capitalizedWordArr.join(' '); //returns every word passed capitalized
}
//------------------------------------------------------------------
    router.get('/nursery',function(req, res) {
        res.render('./registrationForms/nurseryRegister.ejs');
    });
    
//-----------------------------------------------------------------    
    router.post('/nursery',function(req,res){
         req.logout();
         //------------------//
         var newUser = new Nursery({username:req.body.username});
         var activationhash = crypto.createHash('md5').update(req.body.username).digest('hex');

         newUser.label='manager';
         newUser.active=0;
         newUser.activationhash=activationhash;
         newUser.waitingRegistrationTeachers = "";// so it works when I do a forEach loop;
         newUser.waitingRegistrationParents = "";// so it works when I do a forEach loop;
         var address = {
            address1: capitalizeStarter(req.body.address1),
            address2: capitalizeStarter(req.body.address2),
            city: capitalizeStarter(req.body.city),
            country: capitalizeStarter(req.body.country),
            postcode:req.body.postcode
         };
         
                
                
        newUser.details.push({
                name: capitalizeStarter(req.body.name),
                nurserycontactnumber:req.body.nurserycontactnumber,
                address:address,
                firstname: capitalizeStarter(req.body.firstname),
                lastname: capitalizeStarter(req.body.lastname),
                managerlabel:'manager',
                managercontactnumber:req.body.managercontactnumber            });
    
        //--------------------------//
       Nursery.register(newUser,req.body.password,function(err,dataRetUser){
           if(err){
               
               req.flash("error",err.message);//err is from "passport package"
                      return res.redirect("back");
        
             }
           
           else{
               
               sendEmail.sendConfirmationEmail(req.body.username,activationhash,'nursery','noneyet',function(statusCode){
                   if(statusCode==202){
                       req.flash("success","Please, check your mail and confirm the link we have sent you to access the platform as a Manager." );
                        res.redirect('/');
                   }else{
                       req.flash("error","Sorry,something went wrongSorry and the email could not be sent. Please contact the Childev Administrator." );
                        res.redirect('/');
                   }
                   
                   
               });
               
           }
           
           
       });
        
        
    });
        
        
        
//////////////////////////////////////////////
       //user got here, because the activationhash and nurseryid matched and the form was rendered, if they didn't match, he would not have got here.
 
    function registerParentOrTeacher(req,res,newUser, password,foundNursery,parentOrTeacher,Schema){
                

                    Schema.register(newUser,password,function(err,userRegisterd){ //then register
                       if(err){
                           req.flash("error",err.message);//err is from "passport package"
                                  return res.redirect("back");
                    
                         }else{
                             
                             //then add teacher to that nursery
                             foundNursery[parentOrTeacher].push(userRegisterd);
                             foundNursery.save(function(err, data){
                                if(err){
                                    console.log(err);
                                } else {
                  
                                        foundNursery.update({ $pull: { waitingRegistrationTeachers : { $in: [ userRegisterd.username ] }, waitingRegistrationParents: { $in: [ userRegisterd.username ] }  } },function(err,dataRet){
                                              if(err){
                                                  req.flash('error','Sorry, something went wrong when trying to remove element.');
                                                  res.redirect('back');
                                                  console.log('error removing');
                                              }else{
                                                 passport.authenticate(parentOrTeacher)(req,res,function(){
                                                     
                                                        if(parentOrTeacher==='teacher'){
                                                            req.flash("success","Successfully registered " +userRegisterd.username);
                                                            res.redirect("/dashboard/teacher/"+req.user._id);
                                                        }
                                                        if(parentOrTeacher==='parent'){
                                                            req.flash("success","Successfully registered " +userRegisterd.username);
                                                            res.redirect("/dashboard/parent/"+req.user._id);
                                                        }
                                                    
                                                    });
                                                  
                                              }
                                          }
                                        );//foundNursary.update, removes the teacher from the waiting registration list in the manager's view

                                }
                            });
                        }
               
                   });//Teacher.register
    }



router.post('/teacher/:nurseryId',function(req,res){
         req.logout();
         var nurseryId = req.params.nurseryId;
         var password = req.body.password;
         var newUser = new Teacher({username:req.body.username});
            newUser.label='teacher';
            newUser.details.push({
            firstname:capitalizeStarter(req.body.firstname),
            lastname: capitalizeStarter(req.body.lastname),
            contactnumber:req.body.contactnumber
            });
            //variables to check if the manager actually sent the link to user, if so continue, otherwise no/
        var inserted = 0,
        exists = false,
        parentOrTeacher = 'teacher';
        
            Nursery.findById(nurseryId,function(err,foundNursery){ //first find Nursery it belongs to
                if(err){
                    
                }else{
                    var arr = foundNursery.waitingRegistrationTeachers;
                        arr.forEach(function(emailFoundArr){
                            ++inserted;
                            if(req.body.username==emailFoundArr){
                                   exists = true;
                                
                               }  
                               if(inserted==arr.length && exists==true){
                                    return registerParentOrTeacher(req,res,newUser,password,foundNursery,parentOrTeacher,Teacher);
                                }
                               if(inserted==arr.length && exists==false){
                                   
                                req.flash('error',"You don't have permision to register as a "+parentOrTeacher+", ask the manager to send you a registration link.");
                                  return res.redirect('/');
                                }
                            });//loop
                }
            });
    });
/////////////////////////////////////////////////////////////
router.post('/parent/:nurseryId',function(req,res){
         req.logout();
         var nurseryId = req.params.nurseryId;
         var password = req.body.password;
         var newUser = new Parent({username:req.body.username});
            newUser.label='parent';
            newUser.details.push({
            firstname:capitalizeStarter(req.body.firstname),
            lastname: capitalizeStarter(req.body.lastname),
            contactnumber:req.body.contactnumber
            });
          var inserted = 0,
          exists = false,
          parentOrTeacher = 'parent';
          
            Nursery.findById(nurseryId,function(err,foundNursery){ //first find Nursery it belongs to
                if(err){
                    
                }else{
                             var arr = foundNursery.waitingRegistrationParents;
                                arr.forEach(function(emailFoundArr){
                                        ++inserted;
                                        if(req.body.username==emailFoundArr){
                                               exists = true;
                                            
                                           }  
                                           if(inserted==arr.length && exists==true){
                                            return registerParentOrTeacher(req,res,newUser,password,foundNursery,parentOrTeacher,Parent);
                                            }
                                           if(inserted==arr.length && exists==false){
                                               
                                            req.flash('error',"You don't have permision to register as a "+parentOrTeacher+", ask the manager to send you a registration link.");
                                              return res.redirect('/');
                                            }
                                });//loop
                }
            });
    });

    
module.exports = router;