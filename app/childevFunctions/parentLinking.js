//imported packages
var Parent = require("../schemas/parent/parentSchema.js");
var Children = require("../schemas/children/childrenSchema.js");
var passport = require('passport');

/**
 * This function checks if a user has persmision to register as a parent of a child,
 * if so, proceed to register the parent in the callback function 'registerParent()',
 * otherwise, show an error message saying this user doesn't have permision to register as a parent of this child.
 * 
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {object} foundNursery - The nursery to which the parent will be registered to.
 * @param {string} childId - The child ID.
 * @param {string} username - The parent's email address.
 * @returns {function} addChildToParentSchema - A callback function is returned if user has permision to register as a parent.
 * 
 */
function checkIsParentOfChild(req, res,foundNursery, childId, username) {
  var inserted = 0, //This variable is a counter used to make sure that all of the elements in the array have been checked.
    exists = false;
  Children.findById(childId, function(error, foundChild) {
    if (error) {
      console.log(error);
    } else {
      var arr = foundChild.parentsemails; //Array of found children

      arr.forEach(function(emailFoundArr) {
        ++inserted;
        if (username == emailFoundArr) {
          exists = true;
        }
        if (inserted == arr.length && exists == true) {
          return addChildToParentSchema(req, res,foundNursery, foundChild, username);
        }
        if (inserted == arr.length && exists == false) {

          req.flash('error', "You don't have permision to register as a parent for this child, ask the manager to send you a registration link.");
          return res.redirect('/');
        }
      }); //loop

    }
  });
}

/**
 * This function adds a parent to Children Schema.
 * 
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {object} foundParent - The new Parent Object that has already been registered.
 * @param {object} foundChild - The Child Object to which the parent will be related to.
 * @returns {function} addChildToParentSchema - A callback function is returned if parent was added to Children Schema successfully.
 */
function addParentToChildrenSchema(req, res,foundNursery,foundChild, foundParent ) {
  foundChild.parent.push(foundParent);
  foundChild.save(function(err, newChildData) {
    if (err) {
      console.log(err);
    } else {
        /**
           * This will delete this email from the 'waitingLinkingParents' array in the Nursery Schema and then will proceed to the next function.                                         *
           */
         foundNursery.update({
            $pull: { 
        "waitingLinkingParents": {email: foundParent.username, childId: foundChild._id}
      
            }
          }, function(err, dataRet) {
            if (err) {
              req.flash('error', 'Sorry, something went wrong when trying to remove element from Waiting Registration List.');
              res.redirect('back');
              console.log('error removing');
            } else {

             req.flash("success", "Successfully linked to child. ");
             return res.redirect("/");
            }
          }); //foundNursary.update, removes the teacher from the waiting registration list in the manager's view
            
    }
  });
}

/**
 * This function adds a Child Object to the corresponding Parent Schema and redirects the user, if no errors, to his dashboard.
 * 
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {object} foundNursery - The nursery object the child belongs to.
 * @param {object} foundChild - The Child Object to which the parent is related to.
 * @param {string} username - Username of parent.
 * @returns {function} addParentToChildrenSchema - A callback function is returned if parent was added to Children Schema successfully.
 */
function addChildToParentSchema(req, res,foundNursery, foundChild, username) {
Parent.findOne({username:username},function(err,foundParent){
    if(err){
        
    }else{
         foundParent.children.push(foundChild);
         foundParent.save(function(err, userRegisterdNewData) {
            if (err) {
              console.log(err);
            } else {
                
                return addParentToChildrenSchema(req,res,foundNursery,foundChild, foundParent);
    
                }
            });
  

    }


});
  
}

/**
 * 
 * @module app/childevFunctions/parentRegister
 */
module.exports = {
  checkIsParentOfChild: checkIsParentOfChild
}