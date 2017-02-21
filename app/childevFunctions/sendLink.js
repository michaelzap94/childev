var Nursery = require("../schemas/admin/nursery.js");
var sendEmail = require("../email/mailer.js");
var Children = require("../schemas/children/childrenSchema.js");

/***********CALLBACK INSIDE CALLBACK INSIDE CALLBACK to beat Async (This is needed because I wanted to use AJAX on the client-side.) ****/

/**
 * This function finds a user in the 'teacher' or 'parent' waitingParentRegistration or waitingTeacherRegistration lists, if found, continue to callback 'loopnow'.
 *
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {object} email - The email of the parent or teacher.
 * @param {string} parentOrTeacher - A string that can be either 'parent' or 'teacher'.
 * @param {string} childId - The child ID.
 * @param {function} checktosend - A callback function that will check if link has already been sent.
 * @returns {function} loopnow - A callback function that loops through the whole array of waitingParentRegistration or waitingTeacherRegistration depending on the 'parentOrTeacher' argument.
 * 
 */
function findUser(req, res, email, parentOrTeacher, childId, loopnow, checktosend) {
  //populates teachers or parents and return Teacher or Parent Fields empty if email does not exists in that db
  var existsInPopulated = false;
  var inserted = 0;
  var exists = false;
  Nursery.findById(req.user._id).populate(parentOrTeacher, null, {
    username: email
  }).exec(function(err, nurseryFound) {
    if (err) {
      return res.send({
        error: 'Sorry this id was not found'
      });
    } else {
      if (nurseryFound[parentOrTeacher].length > 0) {
        existsInPopulated = true;

        var populatedChildrenInParent = nurseryFound.parent[0].children;//array of children IDs in parentSchema.
        if(populatedChildrenInParent>0){//if not empty, check that the ID does not already exists.
              populatedChildrenInParent.forEach(function(element){//check if the parent is already linked to the child.
                ++inserted;
                if(element==childId){
                  exists = true;
                }
                if(inserted==populatedChildrenInParent.length && exists === true){

                  return res.send({
                          error: 'This parent is already linked to this child.'
                        });
                }
                 if(inserted==populatedChildrenInParent.length && exists === false){

                      return loopnow(res, email, parentOrTeacher, childId, existsInPopulated, nurseryFound, checktosend);
      
                }
              });
            } else {
              return loopnow(res, email, parentOrTeacher, childId, existsInPopulated, nurseryFound, checktosend);
            }
      }else{
            return loopnow(res, email, parentOrTeacher, childId, existsInPopulated, nurseryFound, checktosend);

      }
    }
  });

}

/**
 * This function loops through the whole array of waitingParentRegistration or waitingTeacherRegistration depending on the 'parentOrTeacher' argument.
 *
 * @param {Object} res - Express response object
 * @param {object} email - The email of the parent or teacher.
 * @param {string} parentOrTeacher - A string that can be either 'parent' or 'teacher'.
 * @param {string} childId - The child ID.
 * @param {Boolean} existsInPopulated - It's a boolean that will be used to check if the user already exists, if so then show an error saying the user is already registered.
 * @param {object} nurseryFound - This is the user found in the 'findUser' function.
 * @returns {function} checktosend - A callback function that will check if link has already been sent.
 */
function myloopnow(res, email, parentOrTeacher, childId, existsInPopulated, nurseryFound, checktosend) {
  var inserted = 0;
  var exists = false;

  var arr;
  if (parentOrTeacher === 'teacher') {
    arr = nurseryFound.waitingRegistrationTeachers;
    arr.forEach(function(emailFoundArr) {
      ++inserted;
      if (email == emailFoundArr) {
        exists = true;

      }
      if (inserted == arr.length && exists == true) {

        return checktosend(exists, existsInPopulated, email, parentOrTeacher, childId, nurseryFound, res);
      }
      if (inserted == arr.length && exists == false) {
        return checktosend(exists, existsInPopulated, email, parentOrTeacher, childId, nurseryFound, res);
      }
    }); //loop
  } else if (parentOrTeacher === 'parent') {
      if(!existsInPopulated){//parent does not exist so check waitingLinkingParents
        arr = nurseryFound.waitingRegistrationParents;
        arr.forEach(function(emailFoundArr) {
          ++inserted;
          if (email == emailFoundArr.email) {
            exists = true;
    
          }
          if (inserted == arr.length && exists == true) {
    
            return checktosend(exists, existsInPopulated, email, parentOrTeacher, childId, nurseryFound, res);
          }
          if (inserted == arr.length && exists == false) {
            return checktosend(exists, existsInPopulated, email, parentOrTeacher, childId, nurseryFound, res);
          }
        }); //loop
      }else{//parent exists so check waitingLinkingParents
         arr = nurseryFound.waitingLinkingParents;
         arr.forEach(function(emailFoundArr) {
          ++inserted;
          if (email == emailFoundArr.email&&childId==emailFoundArr.childId) {
            exists = true;
    
          }
          if (inserted == arr.length && exists == true) {
    
            return checktosend(exists, existsInPopulated, email, parentOrTeacher, childId, nurseryFound, res);
          }
          if (inserted == arr.length && exists == false) {
            return checktosend(exists, existsInPopulated, email, parentOrTeacher, childId, nurseryFound, res);
          }
        }); //loop       
      }
  }

}

/**
 * This function ENTERS a parent email in its 'parentemails' array (in the Database), and this can be used to check that an email is associated with a child.
 * 
 * @param {Object} res - Express response object
 * @param {object} email - The email of the parent or teacher.
 * @param {string} parentOrTeacher - A string that can be either 'parent' or 'teacher'.
 * @param {string} childId - The child ID.
 * @param {Object} foundChild - nursery Object found.
 * @returns {function} res.send() - This is used to return an object containing some properties needed to populate the AJAX request made on the client-side.
 */
function checkLinkChildToParent(email, parentOrTeacher, childId, isRegistered,foundChild,res,message){
  var inserted = 0;
  var exists = false;
    var arrLength = foundChild.parentsemails.length;
     var name = foundChild.details[0].firstname+" "+foundChild.details[0].lastname;
     
     
    foundChild.parentsemails.forEach(function(element){
      ++inserted;
      if(element==email){
          exists = true;
        
      }
      if (inserted == arrLength && exists == true) {
       
         return res.send({
                parentOrTeacher: parentOrTeacher,
                email: email,
                childId: childId,
                name:name,
                success: message,
                isRegistered:isRegistered
              });
      }
      if (inserted == arrLength && exists == false) {
        foundChild.parentsemails.push(email);
          foundChild.save(function(err, savedChild) {
            if (err) {
              console.log(err);
            } else {
              return res.send({
                parentOrTeacher: parentOrTeacher,
                email: email,
                childId: childId,
                name:name,
                success: message,
                isRegistered:isRegistered
              });
            }
          });
      }
         
      });
}

/**
 * This function finds a child and ENTERS a parent email in its 'parentemails' array (in the Database), and this can be used to check that an email is associated with a child.
 * 
 * @param {Object} res - Express response object
 * @param {object} email - The email of the parent or teacher.
 * @param {string} parentOrTeacher - A string that can be either 'parent' or 'teacher'.
 * @param {string} childId - The child ID.
 * @param {Object} nurseryFound - nursery Object found.
 * @returns {function} checkLinkChildToParent - return this function.
 */
function linkChildToParent(email, parentOrTeacher, childId, isRegistered,nurseryFound,res) { //so when the parent registers with this email, he passes the isParentOf authorization process in the 'registerRouter'
  var message;
  var inserted = 0;
  var exists = false;

  if(!isRegistered){
      message = "Registration link successfully sent to " + email;
  }else{
      message = "User is already registered BUT a join-account link has been sent so the user can link his account to the child.";
  }
  
  Children.findById(childId, function(err, foundChild) {
          if (!isRegistered) {// add email to "waitingRegistrationParents"
                
                    nurseryFound.waitingRegistrationParents.push({
                      email: email,
                      childId: childId
                    });
                     nurseryFound.save(function(err,nurserySave){
                        if(err){
                          return res.send({
                              error: err
                            });
                        }else{
                          return checkLinkChildToParent(email,parentOrTeacher,childId,isRegistered,foundChild,res,message)
                        }
                    });

              }else{ // add email to "waitingLinkingParents"
                  var name = foundChild.details[0].firstname+" "+foundChild.details[0].lastname;
                    nurseryFound.waitingLinkingParents.push({
                      email: email,
                      childId: childId,
                      name: name
                    });
                    nurseryFound.save(function(err,nurserySave){
                        if(err){
                          return res.send({
                              error: err
                            });
                        }else{
                          return checkLinkChildToParent(email,parentOrTeacher,childId,isRegistered,foundChild,res,message)
                        }
                    });

              }
    
    
  
    });
   

};

/**
 * This function applies the checks of existance and returns the final responses, if 'parentOrTeacher' is parent then return the function 'findChildAndPushToParentsEmails',
 *  then, if successful, send return an object containing some properties needed to populate the AJAX request made on the client-side.
 *
 * @param {boolean} checkIfExistsInWaitingRegistration - A boolean that checks if email already exists in the teacher or parent waiting for registration list in the Nursery Database.
 * @param {Object} res - Express response object
 * @param {object} email - The email of the parent or teacher.
 * @param {string} parentOrTeacher - A string that can be either 'parent' or 'teacher'.
 * @param {string} childId - The child ID.
 * @param {Boolean} existsInPopulated - It's a boolean that will be used to check if the user already exists, if so then show an error saying the user is already registered.
 * @param {object} nurseryFound - This is the user found in the 'findUser' function.
 * @returns {function} findChildAndPushToParentsEmails - Return this function if 'parentOrTeacher' is a 'parent'.
 */
function mycheck(checkIfExistsInWaitingRegistration, existsInPopulated, email, parentOrTeacher, childId, nurseryFound, res) {
  if (checkIfExistsInWaitingRegistration) {
    return res.send({
      error: "Email has already been sent, try clicking on the 'Re-send Link' button in the Parents section."
    });
  }else {

    if (parentOrTeacher === 'parent') {
      
      
      sendEmail.sendConfirmationEmailToParents(email, nurseryFound.activationhash, nurseryFound._id, childId, function(statusCode,isRegistered) {
        if(statusCode == 202){
                    return linkChildToParent(email, parentOrTeacher, childId, isRegistered, nurseryFound,res);
   
         }else {
                      return res.send({
                        error: "Sorry,something went wrong and the email could not be sent. Please contact the Childev Administrator."
                      });
                }
        
      }); //sendEmail
    } else {
      
       if (existsInPopulated) {
          return res.send({
            error: "User is already registered."
          });
      
        }else{
      
                sendEmail.sendConfirmationEmail(email, nurseryFound.activationhash, parentOrTeacher, nurseryFound._id, function(statusCode) {
                  if (statusCode == 202) {
                    nurseryFound.waitingRegistrationTeachers.push(email);
                    nurseryFound.save(function(err, savedUser) {
                      if (err) {
                        return res.send({
                          error: err
                        });
          
                      } else {
                        return res.send({
                          parentOrTeacher: parentOrTeacher,
                          email: email,
                          success: "Registration link successfully sent to " + email
                        });
          
                      }
                    });
              
          
                  } else {
          
                    return res.send({
                      error: "Sorry,something went wrong and the email could not be sent. Please contact the Childev Administrator."
                    });
          
                  }
                
               }); //sendEmail
          }//if existsInPopulated

    }
  }

}


/**
 * 
 * @module app/childevFunctions/sendLink
 */
module.exports = {
  findUser: findUser,
  myloopnow: myloopnow,
  mycheck: mycheck
};