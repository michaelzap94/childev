 var express = require("express");
 var router = express.Router();
 var passport = require('passport');
 var isLoggedIn = require("../../middlewares/isLoggedIn");
 var sendEmail = require('../../email/mailer.js');
 var votingFunctions = require("../../votingSystem/votingMain.js");
var myUtilities = require("../../childevFunctions/myUtilities.js");

 var Nursery = require("../../schemas/admin/nursery.js");
 var Teacher = require("../../schemas/teacher/teacherSchema.js");
 var Parent = require("../../schemas/parent/parentSchema.js");

 /**
  * This function, first checks that the user is logged in and, if so,  it renders the parent Dashboard.
  * 
  * @param {Object} req - Express request object
  * @param {Object} res - Express response object
  */
 router.get('/', isLoggedIn.isLoggedInNext, votingFunctions.getUserPolls, function(req, res) {
     var userPollsRet = req.userPollsRet;// Polls created by this manager
   res.render('./dashboards/parent/parentDashboard.ejs', {userPollsRet:userPollsRet});

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
            res.render('dashboards/parent/parentChildrenMedical.ejs', {
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
  * Get children this parent have
  *
  */
 router.put('/children/:childId/medical/edit',isLoggedIn.isLoggedInNext,function(req,res){

     Parent.findById(req.user._id).populate('children').exec(function(err, populatedData) {
        if (err) {
          console.log(err);
        } else {
          //pass to the ejs an array of objects containing all of the teachers' data that work for this nursery
          res.render('dashboards/parent/parentChildrenMedical.ejs', {
            populatedData: populatedData
          });
        }
      });
   
 });
 
  /******NURSERY******************************************************************************/

  /**
  * Get children this parent have
  *
  */
 router.get('/nursery',isLoggedIn.isLoggedInNext,function(req,res){

  /*   Parent.findById(req.user._id).populate('children').exec(function(err, populatedData) {
        if (err) {
          console.log(err);
        } else {*/
          //pass to the ejs an array of objects containing all of the teachers' data that work for this nursery
          res.render('dashboards/parent/parentNursery.ejs');
       /* }
      });*/
   
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





 /**
  * 
  * @module app/routes/parent/dashboardParentRouter
  */
 module.exports = router;