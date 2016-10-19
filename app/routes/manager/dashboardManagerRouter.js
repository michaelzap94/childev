var express = require("express");
var router = express.Router();
var passport = require('passport');
var isLoggedIn = require("../../middlewares/isLoggedIn");
var sendEmail = require('../../email/mailer.js');

var Nursery = require("../../schemas/admin/nursery.js");
var Teacher = require("../../schemas/teacher/teacherSchema.js");
var Parent = require("../../schemas/parent/parentSchema.js");
var Children = require("../../schemas/children/childrenSchema.js");
var sendLink = require("../../childevFunctions/sendLink.js");

 function capitalizeStarter(str) {
    var arrOfWords = str.split(/\s+/).filter(Boolean);//filters out white spaces

    var capitalizedWordArr=[];
    
    arrOfWords.forEach(function(word){
       capitalizedWordArr.push(word.charAt(0).toUpperCase() + word.slice(1));
    });

    return capitalizedWordArr.join(' '); //returns every word passed capitalized
}
 
  
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
    /**
     * Important!!!, this function populates a Ref Array inside of a Ref Array.
     *
     */
      router.get('/parents',isLoggedIn.isLoggedInNext,function(req,res){
        Nursery.findById(req.user._id).populate('children').populate({path:'parent',populate:{path:'children',model:'Children'}}).exec(function(err, populatedData){
            if(err){
                console.log(err);
            } else {
                //pass to the ejs an array of objects containing all of the teachers' data that work for this nursery
                res.render('dashboards/manager/managerParents.ejs',{populatedData:populatedData});
            }
        });
   
    });
    
    router.get('/children',isLoggedIn.isLoggedInNext,function(req,res){
        Nursery.findById(req.user._id).populate("children").exec(function(err, populatedDataChildren){
            if(err){
                console.log(err);
            } else {
                //pass to the ejs an array of objects containing all of the teachers' data that work for this nursery
                res.render('dashboards/manager/managerChildren.ejs',{populatedDataChildren:populatedDataChildren.children});
            }
        });
       
        
    });
    /**
     * Renders the register form for children, it is here and not in the 'registerRouter.js'  because
     * of security reasons since it is the Manager who is registering the user himself without prior email confirmation and authorization,
     * and the Id of this nursery will be passed down to the EJS, so when the form
     * is posted only the Manager that rendered the form can register that children.
     *
     */
     router.get('/children/registerForm',isLoggedIn.isLoggedInNext,function(req,res){
            //render the register form and pass the manager's id to the ejs, even though it can be accessed by 'currentUser'.
                res.render('./registrationForms/childrenRegister.ejs');
    });
    
    
    //CREATE - add new campground to DB
    router.post("/children/registerForm",isLoggedIn.isLoggedInNext, function(req, res){
    //user must be logged in so you can use req.user
        var maincareremail = req.body.p1username;
        var nursery = {id:req.user._id, username:req.user.username};
        var newUser = new Children();
        var firstname = capitalizeStarter(req.body.firstname);
        var lastname =capitalizeStarter(req.body.lastname);
        var address = {
            address1: capitalizeStarter(req.body.address1),
            address2: capitalizeStarter(req.body.address2),
            city: capitalizeStarter(req.body.city),
            country: capitalizeStarter(req.body.country),
            postcode:req.body.postcode
         };
         
         var ukDateFormat =  req.body.dob;
         /*
         new Date(dateFromForm.split('/')[2], dateFromForm.split('/')[1] - 1, dateFromForm.split('/')[0]);
         */
        newUser.details.push({
                address:address,
                firstname: firstname,
                lastname: lastname,
                dob: ukDateFormat,
                maincareremail:maincareremail,
                maincarerfirstname:req.body.p1firstname,
                maincarerlastname:req.body.p1lastname,
                maincarercontactnumber:req.body.p1contactnumber,
                maincarertype:req.body.p1carertype,
                gender:req.body.gender
                });
        newUser.label='children';
        newUser.nursery = nursery;
        newUser.parentsemails.push(maincareremail);
       // console.log(req.body);

          Nursery.findById(req.user._id).populate('children',null,{details: {$elemMatch: {firstname: firstname, lastname: lastname,maincareremail: maincareremail }}}).exec(function(error,nurseryFound){
            if(error){
                console.log(error);
            } else {
                 if(nurseryFound.children.length>0){
                     console.log('user already registered');
                    req.flash('error','Sorry, this child is already registered.');
                    res.redirect('/dashboard/manager/'+req.user._id+'/children');
                    
                 }else{
                 console.log('user not registered');
                   Children.create(newUser, function(err, newlyCreatedChild){
        
                          nurseryFound.children.push(newlyCreatedChild);
                          nurseryFound.save(function(err, savedNursery){
                               if(err){
                                   req.flash('error','Error registering child');
                                   res.redirect('/dashboard/manager/'+req.user._id+'/children');
                               }else{
                               
                               sendEmail.sendConfirmationEmailToParents(maincareremail,req.user.activationhash,req.user._id,newlyCreatedChild._id,function(statusCode){
                                        if(statusCode==202){
                                             nurseryFound.waitingRegistrationParents.push({email:maincareremail, childId:newlyCreatedChild._id});
                                            //save this email in the waitingRegistrationParents array so it cannot be sent again,just from the parent's section.
                                            nurseryFound.save(function(err, savedUser){
                                                if(err){
                                                    console.log('saving email in the waitingRegistrationParents');
                                                    console.log(error);
                                                    
                                                }else{
                                                     req.flash('success','Success Registering child and sending registration link to main carer.');
                                                    res.redirect('/dashboard/manager/'+req.user._id+'/children');
                                           
                                               }
                                            });  
                                       
                                        }else{
                                            req.flash('error','Success Registering child, but there was an error while sending registration link to parents.');
                                             res.redirect('/dashboard/manager/'+req.user._id+'/children');
                                        }
                                    });//sendEmail
                
                               }//else save user
                          });//save user
                        
                 
                    });//create user
                 }//else check if child exists
               }//else find nursery by id
          
            
        });
    });

    
    //------------------------------------------------------------------------------------------------------------
 
    
    router.post('/sendlink',isLoggedIn.isLoggedInNext,function(req,res){
            if(req.body.emailTeacher){
                return  sendLink.findUser(req,res,req.body.emailTeacher,'teacher','none',sendLink.myloopnow,sendLink.mycheck);
            }else{
                return  sendLink.findUser(req,res,req.body.emailParent,'parent',req.body.childId,sendLink.myloopnow,sendLink.mycheck);
            }

    });
  /****************************************************************************************************************/
        
    router.get('/resendlink/:email',isLoggedIn.isLoggedInNext,function(req, res) {
        if(req.query.parentOrTeacher==='teacher'){
            sendEmail.sendConfirmationEmail(req.params.email,req.user.activationhash,req.query.parentOrTeacher,req.user._id,function(statusCode){
            if(statusCode==202){
                
                return res.send({success:"Registration link successfully sent to "+req.params.email});
            }else{
                return res.send({error:"Sorry,something went wrongSorry and the email could not be sent. Please contact the Childev Administrator."});
            }
            });//sendEmail
        }else{
             sendEmail.sendConfirmationEmailToParents(req.params.email,req.user.activationhash,req.user._id,req.query.childId,function(statusCode){
            if(statusCode==202){
                
                return res.send({success:"Registration link successfully sent to "+req.params.email});
            }else{
                return res.send({error:"Sorry,something went wrongSorry and the email could not be sent. Please contact the Childev Administrator."});
            }
            });//sendEmail
        }            
    });
        
/********************************************************************************************************************/
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