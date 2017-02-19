 /**
  * This function checks if the user is logged in, if so, then it will redirect the user to his dashboard
  * otherwise it will continue to the next middleware/callback.
  * @param {Object} req - Request object
  * @param {Object} res - Response object
  * @param {requestCallback} next - Callback function that takes you to the next middleware.
  */

 var isLoggedInDashboard = function(req, res, next) {
   if (req.isAuthenticated()) { //comes with "passport package"

     res.redirect("/dashboard/" + req.user.label + "/" + req.user._id);

   } else {
     next(); //continue to callback
   }
 }

 /**
  * This function checks it the user is logged in, if so, then it will allow the user to move to the next middleware/callback
  * otherwise, it will redirect him to the home page, and an error message will appear saying that he needs to log in first.
  * @param {Object} req - Request object
  * @param {Object} res - Response object
  * @param {requestCallback} next - Callback function that takes you to the next middleware.
  */

 var isLoggedInNext = function(req, res, next) {
   if (req.isAuthenticated()) {
     next(); //continue to callback
   } else {
     req.flash('error', 'Please, Log in First');
     res.redirect("/");

   }
 }

 /**
  * This module checks that a user is logged in and export the functions created in this module, as an object to be called externally.
  * @module app/middlewares/isLoggedIn
  */

 module.exports = {
   isLoggedInNext: isLoggedInNext,
   isLoggedInDashboard: isLoggedInDashboard
 }