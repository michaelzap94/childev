 var express = require("express");
 var router = express.Router();
 var passport = require('passport');
 var isLoggedIn = require("../../middlewares/isLoggedIn");
 var sendEmail = require('../../email/mailer.js');
 var votingFunctions = require("../../votingSystem/votingMain.js");
var myUtilities = require("../../childevFunctions/myUtilities.js");
var bcrypt   = require('bcrypt-nodejs');


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






 /**
  * 
  * @module app/routes/parent/dashboardTeacherRouter
  */
 module.exports = router;