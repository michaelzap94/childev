var express = require("express");
var router = express.Router();
var passport = require('passport');
var isLoggedIn = require("../../middlewares/isLoggedIn");
var sendEmail = require('../../email/mailer.js');
var votingFunctions = require("../../votingSystem/votingMain.js");
var myUtilities = require("../../childevFunctions/myUtilities.js");
var messagingFunctions = require("../../messagingSystem/messagingFunctions.js");

var Message = require("../../schemas/messages/messagesSchema.js");
var Nursery = require("../../schemas/admin/nursery.js");
var Teacher = require("../../schemas/teacher/teacherSchema.js");
var Parent = require("../../schemas/parent/parentSchema.js");
var Children = require("../../schemas/children/childrenSchema.js");
var sendLink = require("../../childevFunctions/sendLink.js");
var Report = require("../../schemas/progressReports/reportSchema.js");


/**
* This function, first checks that the user is logged in, then gets the polls available to this user
* and then it renders the manager Dashboard.
* 
* @middleware {function} votingFunctions.getUserPolls - Gets the polls created by manager and pass them to the router as req.userPollsRet
* @param {Object} req - Express request object
* @param {Object} res - Express response object
*/
router.get('/', isLoggedIn.isLoggedInNext, votingFunctions.getUserPolls, function(req, res) {
  var userPollsRet = req.userPollsRet;// Polls created by this manager
  var nurseryId = req.user._id;
  Message.find({"nursery.id":nurseryId , "to.id":req.user._id, "to.deleted":false , "to.read":false}).exec(function(err, messagesFound){
      if(err){
          req.flash('error',err);
          res.redirect('/');
      }else{
        res.render('dashboards/manager/managerDashboard.ejs', {userPollsRet:userPollsRet , messagesFound:  messagesFound}); 
         
      }
  });
 
});

/**
* This function, first checks that the user is logged in and then it renders the manager's teachers Dashboard, 
* populating it with all the teachers that work for the nursery.
* 
* @param {Object} req - Express request object
* @param {Object} res - Express response object
*/
router.get('/teachers', isLoggedIn.isLoggedInNext, function(req, res) {
  Nursery.findById(req.user._id).populate("teacher").exec(function(err, populatedDataTeachers) {
    if (err) {
      console.log(err);
    } else {
      //pass to the ejs an array of objects containing all of the teachers' data that work for this nursery
      res.render('dashboards/manager/managerTeachers.ejs', {
        populatedDataTeachers: populatedDataTeachers.teacher
      });
    }
  });

});

/**
* Important!!!, this function populates a Ref Array inside of a Ref Array.
* This function, first checks that the user is logged in and then it renders the manager's parent Dashboard, 
* populating it with all the teachers that work for the nursery.
* 
* @param {Object} req - Express request object
* @param {Object} res - Express response object
*
*/
router.get('/parents', isLoggedIn.isLoggedInNext, function(req, res) {
  Nursery.findById(req.user._id).populate('children').populate({
    path: 'parent',
    populate: {
      path: 'children',
      model: 'Children'
    }
  }).exec(function(err, populatedData) {
    if (err) {
      console.log(err);
    } else {
      //pass to the ejs an array of objects containing all of the teachers' data that work for this nursery
      res.render('dashboards/manager/managerParents.ejs', {
        populatedData: populatedData
      });
    }
  });

});

/**
* This function, first checks that the user is logged in and then it renders the manager's children Dashboard, 
* populating it with all the children that study in that nursery.
* 
* @param {Object} req - Express request object
* @param {Object} res - Express response object
*/
router.get('/children', isLoggedIn.isLoggedInNext, function(req, res) {
  Nursery.findById(req.user._id).populate("parent").populate({
    path: 'children',
    populate: {
      path: 'parent',
      model: 'Parent'
    }
  }).exec(function(err, populatedData) {
    if (err) {
      console.log(err);
    } else {
      //pass to the ejs an array of objects containing all of the teachers' data that work for this nursery
      res.render('dashboards/manager/managerChildren.ejs', {
        populatedData: populatedData
      });
    }
  });

});



/**
 * Renders the register form for children, it is here and not in the 'registerRouter.js'  because
 * of security reasons since it is the Manager who is registering the user himself without prior email confirmation and authorization,
 * and the Id of this nursery will be passed down to the EJS, so when the form
 * is posted only the Manager that rendered the form can register that children.
 * 
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 *
 */
router.get('/children/registerForm', isLoggedIn.isLoggedInNext, function(req, res) {
  //render the register form and pass the manager's id to the ejs, even though it can be accessed by 'currentUser'.
  res.render('./registrationForms/childrenRegister.ejs');
});



/**
* This function, first checks that the user is logged in and then it registers a new child in the nursery.
* Also, it sends a registration link to the main carer of that child.
* 
* @param {Object} req - Express request object
* @param {Object} res - Express response object
*
*/
router.post("/children/registerForm", isLoggedIn.isLoggedInNext, function(req, res) {
  //user must be logged in so you can use req.user
  var maincareremail = req.body.p1username;
  var nursery = {
    id: req.user._id,
    username: req.user.username
  };
  var newUser = new Children();
  var firstname = myUtilities.capitalizeStarter(req.body.firstname);
  var lastname = myUtilities.capitalizeStarter(req.body.lastname);
  var address = {
    address1: myUtilities.capitalizeStarter(req.body.address1),
    address2: myUtilities.capitalizeStarter(req.body.address2),
    city: myUtilities.capitalizeStarter(req.body.city),
    country: myUtilities.capitalizeStarter(req.body.country),
    postcode: req.body.postcode
  };
   var medicalInfoSubmitted = {
            doctorAddress: '',
            doctorContactnumber: '',
            doctorName: '',
            disabilities: '',
            medications: '',
            illnesses:'',
            allergies: '',
            foodNotAllowed:'',
            specialSupport: '',
       }
       

  var ukDateFormat = req.body.dob;
  /*
  new Date(dateFromForm.split('/')[2], dateFromForm.split('/')[1] - 1, dateFromForm.split('/')[0]);
  */
  newUser.medicalInfo.push(medicalInfoSubmitted);
  newUser.details.push({
    address: address,
    firstname: firstname,
    lastname: lastname,
    dob: ukDateFormat,
    maincareremail: maincareremail,
    maincarerfirstname: req.body.p1firstname,
    maincarerlastname: req.body.p1lastname,
    maincarercontactnumber: req.body.p1contactnumber,
    maincarertype: req.body.p1carertype,
    gender: req.body.gender
  });
  newUser.label = 'children';
  newUser.nursery = nursery;
  newUser.parentsemails.push("");
  newUser.parentsemails.push(maincareremail);
  // console.log(req.body);

  Nursery.findById(req.user._id).populate('children', null, {
    details: {
      $elemMatch: {
        firstname: firstname,
        lastname: lastname,
        maincareremail: maincareremail
      }
    }
  }).exec(function(error, nurseryFound) {
    if (error) {
      console.log(error);
    } else {
      if (nurseryFound.children.length > 0) {
        req.flash('error', 'Sorry, this child is already registered.');
        res.redirect('/dashboard/manager/' + req.user._id + '/children');

      } else {
        
        Children.create(newUser, function(err, newlyCreatedChild) {
          nurseryFound.children.push(newlyCreatedChild);
          nurseryFound.save(function(err, savedNursery) {
            if (err) {
              req.flash('error', 'Error registering child');
              res.redirect('/dashboard/manager/' + req.user._id + '/children');
            } else {
     
              
            
              sendEmail.sendConfirmationEmailToParents(maincareremail, req.user.activationhash, req.user._id, newlyCreatedChild._id, function(statusCode,isRegistered) {
                if (statusCode == 202) {
                    if(!isRegistered){//if the user is not registered, save in the waitingRegistrationParents array so it cannot be sent again,just from the parent's section.
                        nurseryFound.waitingRegistrationParents.push({
                        email: maincareremail,
                        childId: newlyCreatedChild._id
                        });
                      //save this email in the waitingRegistrationParents array so it cannot be sent again,just from the parent's section.
                      nurseryFound.save(function(err, savedUser) {
                        if (err) {
                          console.log('saving email in the waitingRegistrationParents');
                          console.log(error);
    
                        } else {
                          req.flash('success', 'Success Registering child and sending registration link to main carer.');
                          res.redirect('/dashboard/manager/' + req.user._id + '/children');
    
                        }
                      });
                    }else{
                       var name = newlyCreatedChild.details[0].firstname+" "+newlyCreatedChild.details[0].lastname;
                         nurseryFound.waitingLinkingParents.push({
                            email: maincareremail,
                            childId: newlyCreatedChild._id,
                            name: name
                          });
                          nurseryFound.save(function(err, savedUser) {
                                if (err) {
                                  return res.send({
                                    error: err
                                  });
                    
                                } else {
                                    req.flash('success', 'User is already registered BUT a join-account link has been sent so the user can link his account to the child.');
                                    res.redirect('/dashboard/manager/' + req.user._id + '/children');
                                }
                    });//save user
                       
                        
                    }


                } else {
                        req.flash('error', 'Success Registering child, but there was an error while sending registration link to parents.');
                        res.redirect('/dashboard/manager/' + req.user._id + '/children');
                      }
              }); //sendEmail

            } //else save user
          }); //save user

        }); //create user
      } //else check if child exists
    } //else find nursery by id

  });
});

//------------------------------------------------------------------------------------------------------------

/**
* This function, first checks that the user is logged in and then it sends a registration link to the specified email passed in the POST data.
* 
* @param {Object} req - Express request object
* @param {Object} res - Express response object
*
*/
router.post('/sendlink', isLoggedIn.isLoggedInNext, function(req, res) {

  if (req.body.emailTeacher) {
    return sendLink.findUser(req, res, req.body.emailTeacher, 'teacher', 'none', sendLink.myloopnow, sendLink.mycheck);
  } else {
     
    return sendLink.findUser(req, res, req.body.emailParent, 'parent', req.body.childId, sendLink.myloopnow, sendLink.mycheck);
  }

});
/****************************************************************************************************************/

/**
* This function, first checks that the user is logged in and then it resends a registration link to the specified email passed in the data.
* 
* @param {Object} req - Express request object
* @param {Object} res - Express response object
*
*/
router.get('/resendlink/:email', isLoggedIn.isLoggedInNext, function(req, res) {
  if (req.query.parentOrTeacher === 'teacher') {
    sendEmail.sendConfirmationEmail(req.params.email, req.user.activationhash, req.query.parentOrTeacher, req.user._id, function(statusCode) {
      if (statusCode == 202) {

        return res.send({
          success: "Registration link successfully sent to " + req.params.email
        });
      } else {
        return res.send({
          error: "Sorry,something went wrongSorry and the email could not be sent. Please contact the Childev Administrator."
        });
      }
    }); //sendEmail
  } else {
    sendEmail.sendConfirmationEmailToParents(req.params.email, req.user.activationhash, req.user._id, req.query.childId, function(statusCode) {
      if (statusCode == 202) {

        return res.send({
          success: "Registration link successfully sent to " + req.params.email
        });
      } else {
        return res.send({
          error: "Sorry,something went wrongSorry and the email could not be sent. Please contact the Childev Administrator."
        });
      }
    }); //sendEmail
  }
});

/********************************************************************************************************************/


/**
* This function, first checks that the user is logged in and then it removes the email from the waiting registration array in the specified user 'teacher' or 'parent'.
* 
* @param {Object} req - Express request object
* @param {Object} res - Express response object
*
*/
router.get('/removeFromPending/:email', isLoggedIn.isLoggedInNext, function(req, res) {
  

  if (req.query.parentOrTeacher === 'teacher') {
    Nursery.update({
      _id: req.user._id
    }, {
      $pull: {
        waitingRegistrationTeachers: {
          $in: [req.params.email]
        }
      }
    }, function(err, dataRet) {
      if (err) {
        return res.send({
          error: 'Sorry, something went wrong when trying to remove element.'
        });
      } else {
        return res.send({
          email: req.params.email,
          success: 'Successfully removed ' + req.params.email + ' from list.'
        });
      }
    });
  } else if (req.query.parentOrTeacher === 'parent') {
      
      if(req.query.isRegistered){
            Nursery.update({
            _id: req.user._id
          }, {
            $pull: { 
              "waitingLinkingParents": {email: req.params.email, childId:req.query.childId}
            }
          }, function(err, dataRet) {
            if (err) {
              return res.send({
                error: 'Sorry, something went wrong when trying to remove element.'
              });
            } else {
              return res.send({
                email: req.params.email,
                success: 'Successfully removed ' + req.params.email + ' from list.'
              });
            }
          });        
      }else{
          Nursery.update({
            _id: req.user._id
          }, {
            $pull: { 
              "waitingRegistrationParents": {email: req.params.email}
            }
          }, function(err, dataRet) {
            if (err) {
              return res.send({
                error: 'Sorry, something went wrong when trying to remove element.'
              });
            } else {
              return res.send({
                email: req.params.email,
                success: 'Successfully removed ' + req.params.email + ' from list.'
              });
            }
          });

      }
  } else {
    return res.send({
      error: "You have to specify the parameter 'parentOrTeacher' "
    })
  }

});

//******************************************************************************************************/

/**
* This function deletes the Object Id Reference stored in the nursery Database when a user is created'.
* 
* @param {Object} req - Express request object
* @param {Object} res - Express response object
* @param {Object} objToRemove - The object to be removed.
* @param {String} label - A label that can be either 'parent' or 'teacher'.
*
*/
function deleteUserReference(req, res, objToRemove, label) {
  if (label === 'teacher') {
    Nursery.update({
      _id: req.user._id
    }, {
      $pull: {
        teacher: {
          $in: [objToRemove]
        }
      }
    }, function(err, dataRet) {
      if (err) {
        return res.send({
          error: 'Error deleting user'
        });
      } else {
        return res.send({
          success: 'User successfully deleted.'
        });
      }
    });
  } else if (label === 'parent') {
    Nursery.update({
      _id: req.user._id
    }, {
      $pull: {
        parent: {
          $in: [objToRemove]
        }
      }
    }, function(err, dataRet) {
      if (err) {
        return res.send({
          error: 'Error deleting user'
        });
      } else {

       deleteUserReferenceFinal(req, res, objToRemove, label);
            }
            
     
    
    });//Nursery.update();
  } else if (label === 'children') {
    Nursery.update({
      _id: req.user._id
    }, {
      $pull: {
        children: {
          $in: [objToRemove]
        }
      }
    }, function(err, dataRet) {
      if (err) {
        return res.send({
          error: 'Error deleting user'
        });
      } else {

       deleteUserReferenceFinal(req, res, objToRemove, label);
            }
            
     
    
    });//Nursery.update();
  }

}

/**
* This function deletes the Object Id Reference stored in the nursery Database when a user is created.
* 
* @param {Object} req - Express request object
* @param {Object} res - Express response object
* @param {Object} objToRemove - The object to be removed.
* @param {String} label - A label that can be either 'parent' or 'teacher'.
*/
function deleteUserReferenceFinal(req, res, objToRemove, label) {

   objToRemove.remove(function(err){
                  if(err){
                      return res.send({
                         error: 'Error deleting user'
                    });
                  }else{
                    
                      return res.send({
                        success: 'User successfully deleted.'
                      });
          
                    
                  }
              });
}
/**
* This function deletes the user from the Database.
* 
* @param {Object} req - Express request object
* @param {Object} res - Express response object
* @param {Object} schema - The object Schema where the user is going to be removed from.
* @param {String} idFromQuery - the Id of the user to be removed.
* @param {String} label - A label that can be either 'parent' or 'teacher'.
*
*/
function deleteUser(req, res, schema, idFromQuery, label) {
  schema.findByIdAndRemove(idFromQuery, function(err, dataReturned) {

    if (err) {
      return res.send({
        error: 'Error deleting user'
      });
    } else {
      deleteUserReference(req, res, dataReturned, label);
    }
  });
}

/**
* This function catches a GET request to delete a user and executes the responsible function ('deleteUser()') to delete it.
* 
* @param {Object} req - Express request object
* @param {Object} res - Express response object
*
*/
router.get("/deleteUser/:label/:id", function(req, res) {
  var idFromQuery = req.params.id;
  var label = req.params.label;
  if (label === 'teacher') {
    return deleteUser(req, res, Teacher, idFromQuery, label);
  } else if (label === 'parent') {
    return deleteUser(req, res, Parent, idFromQuery, label);
  } else if (label === 'children') {
    console.log("got here");
    return deleteUser(req,res,Children,idFromQuery,label);
  }

});

/*****POLLS*****************************************************************/
// get Form to create Poll
router.get("/polls/new", function(req, res) {
  
   res.render("./dashboards/manager/managerPollsForm.ejs"); 

});

//crete poll

//POST from newPollForm to /dashboard
router.post("/polls", isLoggedIn.isLoggedInNext,function(req,res){

  votingFunctions.createPollWithOptions(req,res);
     

});

//DELETE USER OWN POST, need to authorize
router.post("/polls/:id/delete", isLoggedIn.isLoggedInNext,function(req,res){
  
    votingFunctions.deletePoll(req,res);

});

//Show poll info
router.get("/polls/:id",isLoggedIn.isLoggedInNext,votingFunctions.showOnePoll,function(req, res) {
    res.render("./dashboards/manager/managerOnePoll.ejs",{showOnePoll:req.showOnePoll});
});
//Vote handler
router.post("/polls/:id/vote",isLoggedIn.isLoggedInNext,function(req,res){
 return votingFunctions.checkNursery(req,res,votingFunctions.oneVote,votingFunctions.saveVote);
  
});
//--------------------------------------
/**
 * Render the settings Form
 *
 */
router.get("/settings",isLoggedIn.isLoggedInNext,function(req, res) {
   res.render("./dashboards/manager/managerSettings.ejs"); 
});


/**
 * Change Password within inside the application
 *
 */
 router.put("/settings/edit",isLoggedIn.isLoggedInNext,function(req, res) {
   myUtilities.resetPassword(req,res);
});

/**
 * Remove profile
 *
 */

router.delete("/settings/delete",function(req,res){
   myUtilities.deleteUser(req,res);

});
//--------------------------------------
/**
 * Render the profile Form
 *
 */
router.get("/profile",isLoggedIn.isLoggedInNext,function(req, res) {
   res.render("./dashboards/manager/managerProfile.ejs"); 
});


/**
 * Update Details
 *
 */
router.put("/profile/edit",isLoggedIn.isLoggedInNext,function(req,res){
    
    
     var address = {
        address1: myUtilities.capitalizeStarter(req.body.address1),
        address2: myUtilities.capitalizeStarter(req.body.address2),
        city: myUtilities.capitalizeStarter(req.body.city),
        country: myUtilities.capitalizeStarter(req.body.country),
        postcode: req.body.postcode
      };
    Nursery.findById(req.user._id,function(err,userInfo){
        if(err){
          req.flash('error', 'Error updating your details.');
          res.redirect('back');
        }else{
          userInfo.details.pop();
           userInfo.details.push({
              name: myUtilities.capitalizeStarter(req.body.name),
              nurserycontactnumber: req.body.nurserycontactnumber,
              address: address,
              urn:req.body.urn,
              firstname: myUtilities.capitalizeStarter(req.body.firstname),
              lastname: myUtilities.capitalizeStarter(req.body.lastname),
              managerlabel: 'manager',
              managercontactnumber: req.body.managercontactnumber
            });
            userInfo.save(function(error,userSaved){
              if(error){
                req.flash('error', 'Error updating your details.');
                res.redirect('back');
              }else{
                req.flash('success', 'Success updating your details.');
                res.redirect('back');
              }


            });
              
          
        }
    });

 
    
});
//-----------------------------------------------------
/**
 * Unlink parent from child
 *
 */
 router.get('/unlink',isLoggedIn.isLoggedInNext,function(req, res) {
     var parentId = req.query.parentId;
     var childId = req.query.childId;
     myUtilities.unlinkParentFromChild(req,res,parentId,childId);
 });
 
 
 /**MESSAGES*************************************************/
  
 /**
  * INBOX
  *
  */
  router.get('/messages',isLoggedIn.isLoggedInNext,function(req, res) {
    
      var nurseryId = req.user._id;
      Message.find({"nursery.id":nurseryId , "to.id":req.user._id, "to.deleted":false}).exec(function(err, messagesFound){
          if(err){
              req.flash('error',err);
              res.redirect('/');
          }else{
            res.render("./dashboards/manager/managerMessages.ejs",{ messagesFound:  messagesFound}); 
             
          }
      });

 });
 
  /**
  * SENT
  *
  */
  router.get('/messages/sent',isLoggedIn.isLoggedInNext,function(req, res) {
      var nurseryId = req.user._id;
      Message.find({"nursery.id":nurseryId , "from.id":req.user._id , "from.deleted":false }).exec(function(err, messagesFound){
         if(err){
              req.flash('error',err);
              res.redirect('/');
          }else{
            res.render("./dashboards/manager/managerMessagesSent.ejs",{ messagesFound:  messagesFound}); 
             
          }      
          
      });

 });
 
  /**
  * Message Read
  *
  */
  router.post('/messages/:messageId/read',isLoggedIn.isLoggedInNext,function(req, res) {
    
    messagingFunctions.messageRead(req,res);

 });
 
 
   /**
  * NEW MESSAGE
  *
  */
  router.get('/messages/new',isLoggedIn.isLoggedInNext,function(req, res) {
       var userIdTo= req.query.userIdTo;
      var label = req.query.labelTo;
      var schema;
      
        if(userIdTo && label){
                if(label==="parent"){
                   schema = Parent;
               }else if(label==="teacher"){
                   schema = Teacher;
               }else if(label==="manager"){
                   schema = Nursery;
               }else{
                    req.flash("error","Label could not be identified.")
                    res.redirect("back");
               }
                schema.findById(userIdTo,function(err, userFound) {
                    
                    res.render("./dashboards/manager/managerMessagesNew.ejs",{oneUserFound:userFound});
        
                });
    
        }else{
           Nursery.findById( req.user._id).populate('parent').populate('teacher').exec(function(err, populatedNurseryParents) {
                if (err) {
                  console.log(err);
                } else {
                  //pass to the ejs an array of objects containing all of the teachers' data that work for this nursery
                  res.render("./dashboards/manager/managerMessagesNew.ejs",{populatedNurseryParents:populatedNurseryParents});
                }
              });
        } 

 });
 
  /**
  * NEW MESSAGE, check if URL has query arguments userIdTo & label, if so then populate the new message form with these details,
  * otherwise, populate the form with all of the nursery data including manager details and teacher details
  *
  */
  router.post('/messages/new',isLoggedIn.isLoggedInNext,function(req, res) {

    messagingFunctions.sendNewMessage(req,res);

 });
 
  /**
  * DELETE a message from Inbox
  *
  */
  router.get('/messages/inbox/:messageId/delete',isLoggedIn.isLoggedInNext,function(req, res) {

    messagingFunctions.deleteMessageInbox(req,res);

 });
 
   /**
  * DELETE a message from Sent
  *
  */
  router.get('/messages/sent/:messageId/delete',isLoggedIn.isLoggedInNext,function(req, res) {

    messagingFunctions.deleteMessageSent(req,res);

 });
 
 
 
 /**
  * 
  * @module app/routes/manager/dashboardManagerRouter
  */
module.exports = router;