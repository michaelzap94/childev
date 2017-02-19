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
 * @param {object} newUser - The new user Object containing details and username of parent.
 * @param {string} password - the password the user wants to use.
 * @param {object} foundNursery - The nursery to which the parent will be registered to.
 * @param {string} childId - The child ID.
 * @param {string} email - The parent's email address.
 * @returns {function} registerParent - A callback function is returned if user has permision to register as a parent.
 * 
 */
function checkIsParentOfChild(req, res, newUser, password, foundNursery, childId, email) {
  var inserted = 0, //This variable is a counter used to make sure that all of the elements in the array have been checked.
    exists = false;
  Children.findById(childId, function(error, foundChild) {
    if (error) {
      console.log(error);
    } else {
      var arr = foundChild.parentsemails; //Array of found children

      arr.forEach(function(emailFoundArr) {
        ++inserted;
        if (email == emailFoundArr) {
          exists = true;
        }
        if (inserted == arr.length && exists == true) {
          return registerParent(req, res, newUser, password, foundNursery, childId, foundChild);
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
 * @param {object} userRegisterd - The new Parent Object that has already been registered.
 * @param {object} foundChild - The Child Object to which the parent will be related to.
 * @returns {function} addChildToParentSchema - A callback function is returned if parent was added to Children Schema successfully.
 */
function addParentToChildrenSchema(req, res, userRegisterd, foundChild) {
  foundChild.parent.push(userRegisterd);
  foundChild.save(function(err, newChildData) {
    if (err) {
      console.log(err);
    } else {
      return addChildToParentSchema(req, res, userRegisterd, newChildData);
    }
  });
}

/**
 * This function adds a Child Object to the corresponding Parent Schema and redirects the user, if no errors, to his dashboard.
 * 
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {object} userRegisterd - The new Parent Object that has already been registered.
 * @param {object} newChildData - The Child Object to which the parent is related to.
 */
function addChildToParentSchema(req, res, userRegisterd, newChildData) {
  userRegisterd.children.push(newChildData);
  userRegisterd.save(function(err, userRegisterdNewData) {
    if (err) {
      console.log(err);
    } else {
      passport.authenticate('parent')(req, res, function() {

        req.flash("success", "Successfully registered " + userRegisterdNewData.username);
        res.redirect("/dashboard/parent/" + req.user._id);

      });

    }
  });

}

/**
 * This function register the parent and then removes the email from the 'waitingRegistrationParents' array.
 *
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {object} newUser - The new user Object containing details and username of parent.
 * @param {string} password - the password the user wants to use.
 * @param {object} foundNursery - The nursery to which the parent will be registered to.
 * @param {string} childId - The child ID.
 * @param {object} foundChild - The Child Object to which the parent will be related to.
 * @returns {function} registerParent - A callback function is returned if user has permision to register as a parent.
 * 
 */
function registerParent(req, res, newUser, password, foundNursery, childId, foundChild) {

  Parent.register(newUser, password, function(err, userRegisterd) { //then register
    if (err) {
      req.flash("error", err.message); //err is from "passport package"
      return res.redirect("back");
      console.log('error happened when registering');
    } else {

      //then add teacher to that nursery
      foundNursery.parent.push(userRegisterd);
      foundNursery.save(function(err, data) {
        if (err) {
          console.log(err);
        } else {
          /**
           * This will delete this email from the 'waitingRegistrationParents' array in the Nursery Schema and then will proceed to the next function.                                         *
           */
          foundNursery.update({
            $pull: { 
        "waitingRegistrationParents": {email: userRegisterd.username}
      
            }
          }, function(err, dataRet) {
            if (err) {
              req.flash('error', 'Sorry, something went wrong when trying to remove element from Waiting Registration List.');
              res.redirect('back');
              console.log('error removing');
            } else {

              return addParentToChildrenSchema(req, res, userRegisterd, foundChild);
            }
          }); //foundNursary.update, removes the teacher from the waiting registration list in the manager's view

        }
      });
    }

  }); //Teacher.register
}

/**
 * 
 * @module app/childevFunctions/parentRegister
 */
module.exports = {
  checkIsParentOfChild: checkIsParentOfChild
}