 var express = require("express");
 var router = express.Router();
 var passport = require('passport');
 var isLoggedIn = require("../../middlewares/isLoggedIn");
 var sendEmail = require('../../email/mailer.js');
 var votingFunctions = require("../../votingSystem/votingMain.js");
 var myUtilities = require("../../childevFunctions/myUtilities.js");
 var messagingFunctions = require("../../messagingSystem/messagingFunctions.js");

 var bcrypt   = require('bcrypt-nodejs');


 var Message = require("../../schemas/messages/messagesSchema.js");
 var Nursery = require("../../schemas/admin/nursery.js");
 var Teacher = require("../../schemas/teacher/teacherSchema.js");
 var Parent = require("../../schemas/parent/parentSchema.js");
 var Children = require("../../schemas/children/childrenSchema.js");

 /**
  * This function, first checks that the user is logged in and then it renders the teacher Dashboard.
  * 
  * @param {Object} req - Express request object
  * @param {Object} res - Express response object
  */
 
 router.get('/', isLoggedIn.isLoggedInNext, votingFunctions.getUserPolls,function(req, res) {
    var userPollsRet = req.userPollsRet;// Polls created by this manager

   res.render('./dashboards/teacher/teacherDashboard.ejs',{userPollsRet:userPollsRet});

 });

 /**
  * This function, first finds children whose teacher is the one with the id provided  as req.user._id.
  * then, if a child is found it will pass to the ejs an array of objects containing all of the teachers' data that work for this nursery.
  * 
  * @param {Object} req - Express request object
  * @param {Object} res - Express response object
  */
 router.get('/children', isLoggedIn.isLoggedInNext, function(req, res) {
     var nurseryId = req.user.nursery.id;
     
     Nursery.findById(nurseryId).populate({
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
          res.render('dashboards/teacher/teacherChildren.ejs', {
            populatedData: populatedData
          });
        }
      });
     
  

 });
 
 /*****POLLS*****************************************************************/


//Show poll info
router.get("/polls/:id",isLoggedIn.isLoggedInNext,votingFunctions.showOnePoll,function(req, res) {
    res.render("./dashboards/teacher/teacherOnePoll.ejs",{showOnePoll:req.showOnePoll});
});
//Vote handler
router.post("/polls/:id/vote",isLoggedIn.isLoggedInNext,function(req,res){
 return votingFunctions.checkNursery(req,res,votingFunctions.oneVote,votingFunctions.saveVote);
  
});
//--------------------------------------
router.get("/settings",function(req, res) {
   res.render("./dashboards/teacher/teacherSettings.ejs"); 
});
/**
 * Change Password
 *
 */
 router.put("/settings/edit",function(req, res) {
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
router.get("/profile",function(req, res) {
   res.render("./dashboards/teacher/teacherProfile.ejs"); 
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
    Teacher.findById(req.user._id,function(err,userInfo){
        if(err){
          req.flash('error', 'Error updating your details.');
          res.redirect('back');
        }else{
          userInfo.details.pop();
           userInfo.details.push({
              address: address,
              firstname: myUtilities.capitalizeStarter(req.body.firstname),
              lastname: myUtilities.capitalizeStarter(req.body.lastname),
              contactnumber: req.body.contactnumber
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
      Message.find({"nursery.id":nurseryId , "to.id":req.user._id}).exec(function(err, messagesFound){
          if(err){
              req.flash('error',err);
              res.redirect('/');
          }else{
            res.render("./dashboards/teacher/teacherMessages.ejs",{ messagesFound:  messagesFound}); 
             
          }
      });

 });

 /**
  * SENT
  *
  */
  router.get('/messages/sent',isLoggedIn.isLoggedInNext,function(req, res) {
    var nurseryId = req.user.nursery.id;
      Message.find({"nursery.id":nurseryId , "from.id":req.user._id}).exec(function(err, messagesFound){
         if(err){
              req.flash('error',err);
              res.redirect('/');
          }else{
            res.render("./dashboards/teacher/teacherMessagesSent.ejs",{ messagesFound:  messagesFound}); 
             
          }      
          
      });
 
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
                    
                    res.render("./dashboards/teacher/teacherMessagesNew.ejs",{oneUserFound:userFound});
        
                });
    
        }else{
           Nursery.findById( req.user.nursery.id).populate('parent').exec(function(err, populatedNurseryParents) {
                if (err) {
                  console.log(err);
                } else {
                  //pass to the ejs an array of objects containing all of the teachers' data that work for this nursery
                  res.render("./dashboards/teacher/teacherMessagesNew.ejs",{populatedNurseryParents:populatedNurseryParents});
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
  * DELETE a message
  *
  */
  router.get('/messages/:messageId/delete',isLoggedIn.isLoggedInNext,function(req, res) {

    messagingFunctions.deleteMessage(req,res);

 });
 
 /***REPORT************************************************************/
 
 /**
  * Gets the form to write a report, It makes sure child is actually registered in the same nursery as the teacher.
  *
  */
   router.get('/report/:childId/new',isLoggedIn.isLoggedInNext,function(req, res) {
      var nurseryId = req.user.nursery.id;//nursery the teacher belongs to.
      
      Children.findById({"nursery.id":nurseryId , "_id":req.params.childId}).exec(function(err, childFound){
          if(err){
              req.flash('error',err);
              console.log(err);
              res.redirect('/');
          }else{
              var childAge = myUtilities.calculateAge(childFound.details[0].dob);
            res.render("./dashboards/teacher/teacherReportForm.ejs",{ childFound:  childFound, childAge:childAge }); 
             
          }
      });

 });
 
 
 /**
  * 
  * @module app/routes/parent/dashboardTeacherRouter
  */
 module.exports = router;