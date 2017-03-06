 var express = require("express");
 var router = express.Router();
 var passport = require('passport');
 var isLoggedIn = require("../../middlewares/isLoggedIn");
 var sendEmail = require('../../email/mailer.js');
 var votingFunctions = require("../../votingSystem/votingMain.js");
 var messagingFunctions = require("../../messagingSystem/messagingFunctions.js");
 var myUtilities = require("../../childevFunctions/myUtilities.js");

 var Nursery = require("../../schemas/admin/nursery.js");
 var Teacher = require("../../schemas/teacher/teacherSchema.js");
 var Parent = require("../../schemas/parent/parentSchema.js");
 var Message = require("../../schemas/messages/messagesSchema.js");
 var Report = require("../../schemas/progressReports/reportSchema.js");


 /**
  * This function, first checks that the user is logged in and, if so,  it renders the parent Dashboard.
  * 
  * @param {Object} req - Express request object
  * @param {Object} res - Express response object
  */
 router.get('/', isLoggedIn.isLoggedInNext, votingFunctions.getUserPolls, function(req, res) {
     var userPollsRet = req.userPollsRet;// Polls created by this manager
     var nurseryId = req.user.nursery.id;
     Message.find({"nursery.id":nurseryId , "to.id":req.user._id , "to.deleted":false , "to.read":false}).exec(function(err, messagesFound){
          if(err){
              req.flash('error',err);
              res.redirect('/');
          }else{
            res.render('./dashboards/parent/parentDashboard.ejs', {userPollsRet:userPollsRet , messagesFound:  messagesFound}); 
             
          }
      });

 });
 
 /**
  * Get children this parent have
  *
  */
 router.get('/children',isLoggedIn.isLoggedInNext,function(req,res){

     Parent.findById(req.user._id).populate('children').exec(function(err, populatedData) {
        if (err) {
          console.log(err);
        } else {
          //pass to the ejs an array of objects containing all of the teachers' data that work for this nursery
          res.render('dashboards/parent/parentChildren.ejs', {
            populatedData: populatedData
          });
        }
      });
   
 });
 
 /******PROGRESS******************************************************************************/

  /**
  * Get children this parent have
  *
  */
 router.get('/children/:childId/progress',isLoggedIn.isLoggedInNext,function(req,res){

     Parent.findById(req.user._id).populate('children').exec(function(err, populatedData) {
        if (err) {
          console.log(err);
        } else {
          //pass to the ejs an array of objects containing all of the teachers' data that work for this nursery
          res.render('dashboards/parent/parentChildren.ejs', {
            populatedData: populatedData
          });
        }
      });
   
 });
 
 
 
/******PROFILE******************************************************************************/

  /**
  * Get children this parent have
  *
  */
 router.get('/children/:childId/profile',isLoggedIn.isLoggedInNext,function(req,res){
     
    //populate the child if it is a child of this parent otherwise return 'You are not the parent of this child.'
      Parent.findById(req.user._id).populate('children', null, {
            _id: req.params.childId
          }).exec(function(err, parentFound) {
        if (err) {
          console.log(err);
        } else {
            if (parentFound.children.length > 0) {
            //pass to the ejs an array of objects containing all of the child's data that work for this nursery
            res.render('dashboards/parent/parentChildrenProfile.ejs', {
                childObject: parentFound.children[0]
              });
            }else{
                req.flash('error','You are not the parent of this child.');
                res.redirect('/');
            }
                
                
        }
      });
   
 });
 
 /**
 * Update Details
 *
 */
router.put("/children/:childId/profile/edit",function(req,res){
    
     var maincareremail = req.body.p1username;
     var address = {
        address1: myUtilities.capitalizeStarter(req.body.address1),
        address2: myUtilities.capitalizeStarter(req.body.address2),
        city: myUtilities.capitalizeStarter(req.body.city),
        country: myUtilities.capitalizeStarter(req.body.country),
        postcode: req.body.postcode
      };
     var ukDateFormat = req.body.dob;

      Parent.findById(req.user._id).populate('children', null, {
            _id: req.params.childId
          }).exec(function(err,parentFound){
        if(err){
          req.flash('error', 'Error updating your details.');
          res.redirect('back');
        }else{
            var childObject = parentFound.children[0];
               childObject.details.pop();
               childObject.details.push({
                  address: address,
                  firstname: myUtilities.capitalizeStarter(req.body.firstname),
                  lastname: myUtilities.capitalizeStarter(req.body.lastname),
                  dob: ukDateFormat,
                  maincareremail: maincareremail,
                  maincarerfirstname: req.body.p1firstname,
                  maincarerlastname: req.body.p1lastname,
                  maincarercontactnumber: req.body.p1contactnumber,
                  maincarertype: req.body.p1carertype,
                  gender: req.body.gender
                              });
                childObject.save(function(error,userSaved){
                  if(error){
                    req.flash('error', 'Error updating your details.');
                    res.redirect('back');
                  }else{
                    req.flash('success', "Success updating your child's details.");
                    res.redirect('back');
                  }
    
    
                });
              
          
        }
    });
});



 
 
/******MEDICAL******************************************************************************/
 
 /**
  * Get children this parent have
  *
  */
 router.get('/children/:childId/medical',isLoggedIn.isLoggedInNext,function(req,res){
     //populate the child if it is a child of this parent otherwise return 'You are not the parent of this child.'
      Parent.findById(req.user._id).populate('children', null, {
            _id: req.params.childId
          }).exec(function(err, parentFound) {
        if (err) {
          console.log(err);
        } else {
            if (parentFound.children.length > 0) {
            //pass to the ejs an array of objects containing all of the child's data that work for this nursery
            var childObject = parentFound.children[0];

            res.render('dashboards/parent/parentChildrenMedical.ejs', {
                childObject: childObject
          });
            }else{
                req.flash('error','You are not the parent of this child.');
                res.redirect('/');
            }
                
                
        }
      });
    
 });
 
  /**
  * Update medical form
  *
  */
 router.put('/children/:childId/medical/edit',isLoggedIn.isLoggedInNext,function(req,res){

       //populate the child if it is a child of this parent otherwise return 'You are not the parent of this child.'
       
       var medicalInfoSubmitted = {
            doctorAddress: req.body.doctorAddress,
            doctorContactnumber: req.body.doctorContactnumber,
            doctorName: req.body.doctorName,
            disabilities: req.body.disabilityDetails,
            medications: req.body.medications,
            illnesses: req.body.illnesses,
            allergies: req.body.allergies,
            foodNotAllowed: req.body.food,
            specialSupport: req.body.specialSupport,
       }
       
      Parent.findById(req.user._id).populate('children', null, {
            _id: req.params.childId
          }).exec(function(err, parentFound) {
        if (err) {
          console.log(err);
        } else {
            if (parentFound.children.length > 0) {//if child exist
                var childObject = parentFound.children[0];
                childObject.medicalInfo.pop();
                childObject.medicalInfo.push(medicalInfoSubmitted);
                childObject.save(function(err, savedData){
                     if (err) {
                            req.flash('error','Error updating Medical records.');
                            res.redirect('/');                        
                         
                     } else {
                          //pass to the ejs an array of objects containing all of the teachers' data that work for this nursery
                            req.flash('success','Success updating Medical records.');
                            res.redirect('back');                       
                        }
                });
            
            }else{
                req.flash('error','You are not the parent of this child.');
                res.redirect('/');
            }
                
                
        }
      });
   
 });
 
  /******NURSERY******************************************************************************/

  /**
  * Get children this parent have
  *
  */
 router.get('/nursery',isLoggedIn.isLoggedInNext,function(req,res){
   var nurseryId = req.user.nursery.id;

   Nursery.findById(nurseryId).populate('teacher').exec(function(err, populatedNurseryFound) {
        if (err) {
          console.log(err);
        } else {
          //pass to the ejs an array of objects containing all of the teachers' data that work for this nursery
          res.render('dashboards/parent/parentNursery.ejs',{populatedNurseryFound:populatedNurseryFound});
        }
      });
   
 });
 
 
 
 /*****POLLS*****************************************************************/
//Show poll info
router.get("/polls/:id",isLoggedIn.isLoggedInNext,votingFunctions.showOnePoll,function(req, res) {
    res.render("./dashboards/parent/parentOnePoll.ejs",{showOnePoll:req.showOnePoll});
});
//Vote handler
router.post("/polls/:id/vote",isLoggedIn.isLoggedInNext,function(req,res){
 return votingFunctions.checkNursery(req,res,votingFunctions.oneVote,votingFunctions.saveVote);
  
});

/****SETTINGS*************************************************************************/
//--------------------------------------
router.get("/settings",function(req, res) {
   res.render("./dashboards/parent/parentSettings.ejs"); 
});
/**
 * Change Password
 *
 */
 router.put("/settings/edit",function(req, res) {
   myUtilities.resetPassword(req,res);
});


/**
 * Delete parent
 *
 */
 router.delete("/settings/delete",function(req,res){
  
  
  
   var passwordSubmitted = req.body.delete_password;

    Parent.findById(req.user._id,function(err, userFound){
          userFound.authenticate(passwordSubmitted, function(err, isMatch) {
           if (err){
            console.log(err);
           } else{
                if(isMatch){
                 
                   Nursery.update({
                         _id: userFound.nursery.id
                       }, {
                         $pull: {  parent: {
                                  $in: [userFound]
                                } 
                         }
                       }, function(err, dataRet) {
                         if (err) {
                            req.flash('error','There was an error deleting Parent Reference from Nursery.');
                            res.redirect('back');
                         } else {
                             userFound.remove(function(err){
                                  if(err){
                                      console.log(err);
                                    req.flash('error', 'Error deleting your profile.');
                                    res.redirect('back');
                                  }else{
                                    
                                    req.flash('success', 'Success deleting your profile.');
                                    res.redirect('/');
                          
                                    
                                  }
                              });
                                       
                          }
                               
                       });//Nursery.update();
                    
                   
                    
                }else{
                    req.flash('error', "The submitted password does not match our records.");
                    res.redirect('back');
                }
           }
            
        });
    });

   
 

});


/****PROFILE*************************************************************************/
//--------------------------------------
router.get("/profile",function(req, res) {
   res.render("./dashboards/parent/parentProfile.ejs"); 
});

/**
 * Update Details
 *
 */
router.put("/profile/edit",function(req,res){
  
     var address = {
        address1: myUtilities.capitalizeStarter(req.body.address1),
        address2: myUtilities.capitalizeStarter(req.body.address2),
        city: myUtilities.capitalizeStarter(req.body.city),
        country: myUtilities.capitalizeStarter(req.body.country),
        postcode: req.body.postcode
      };
    Parent.findById(req.user._id,function(err,userInfo){
        if(err){
          req.flash('error', 'Error updating your details.');
          res.redirect('back');
        }else{
          userInfo.details.pop();
          userInfo.carertype = req.body.carertype;
           userInfo.details.push({
              address: address,
              firstname: myUtilities.capitalizeStarter(req.body.firstname),
              lastname: myUtilities.capitalizeStarter(req.body.lastname),
              contactnumber: req.body.contactnumber,
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


 /**MESSAGES*************************************************/
 
 
 /**
  * INBOX
  *
  */
  router.get('/messages',isLoggedIn.isLoggedInNext,function(req, res) {
      var nurseryId = req.user.nursery.id;
      Message.find({"nursery.id":nurseryId , "to.id":req.user._id , "to.deleted":false}).exec(function(err, messagesFound){
          if(err){
              req.flash('error',err);
              res.redirect('/');
          }else{
            res.render("./dashboards/parent/parentMessages.ejs",{ messagesFound:  messagesFound}); 
             
          }
      });

 });
 
 /**
  * SENT
  *
  */
  router.get('/messages/sent',isLoggedIn.isLoggedInNext,function(req, res) {
    var nurseryId = req.user.nursery.id;
      Message.find({"nursery.id":nurseryId , "from.id":req.user._id, "from.deleted":false}).exec(function(err, messagesFound){
         if(err){
              req.flash('error',err);
              res.redirect('/');
          }else{
            res.render("./dashboards/parent/parentMessagesSent.ejs",{ messagesFound:  messagesFound}); 
             
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
  * NEW MESSAGE, check if URL has query arguments userIdTo & label, if so then populate the new message form with these details,
  * otherwise, populate the form with all of the nursery data including manager details and teacher details
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
                    
                    res.render("./dashboards/parent/parentMessagesNew.ejs",{oneUserFound:userFound});
        
                });
    
        }else{
           Nursery.findById(req.user.nursery.id).populate('teacher').exec(function(err, populatedNurseryTeachers) {
                if (err) {
                  console.log(err);
                } else {
                  //pass to the ejs an array of objects containing all of the teachers' data that work for this nursery
                  res.render("./dashboards/parent/parentMessagesNew.ejs",{populatedNurseryTeachers:populatedNurseryTeachers});
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
 
 /**SEE REPORT*****************************************************************************/

  /**
  * Gets the report, It makes sure child is actually registered in the same nursery as the teacher.
  *
  */
   router.get('/report/:childId',isLoggedIn.isLoggedInNext,function(req, res) {
      var nurseryId = req.user.nursery.id;//nursery the teacher belongs to.
      
      Report.find({"nursery.id":nurseryId , "children.id":req.params.childId}).populate('children.id',null,{
            "parent": { $in: [req.user._id]}
          }).exec(function(err, reportFound){
          if(err){
              console.log(err);
              req.flash('error',err);
              res.redirect('back');
          }else{
              //if a report was found, next
              if(reportFound.length>0){
                 
                 //if the user is a parent of the child, next
                 if(reportFound[0].children.id != null){
                     
                    var jsonReportFound = JSON.stringify(reportFound);     
                  res.render("./dashboards/parent/parentChildrenReport.ejs",{ reportFound:  reportFound, jsonReportFound:jsonReportFound }); 

                 }else{
                  req.flash('error',"You are not allowed to access this child's report.");
                  res.redirect('/dashboard/parent/'+req.user._id+'/children');
                 }
                
                
              }else{
                  req.flash('error','This child has no Reports yet.');
                  res.redirect('/dashboard/parent/'+req.user._id+'/children');
                  
              }
             
          }
      });

 });
 
 /**
  * 
  * @module app/routes/parent/dashboardParentRouter
  */
 module.exports = router;