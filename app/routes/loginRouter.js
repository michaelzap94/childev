var express = require("express");
var router = express.Router();
var passport = require('passport');
var isLoggedIn = require("../middlewares/isLoggedIn");

var Nursery = require("../schemas/admin/nursery.js");
var Teacher = require("../schemas/teacher/teacherSchema.js");
var Parent = require("../schemas/parent/parentSchema.js");

//--------------------------------------------------------------------------   

/**
 * This function catches a GET request and renders the form 'stuffLogin' for users to register
 * 
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
function logoutFirst(req, res, next) {
  req.logout(); //passport destroys all user data in the session.(this comes with "passport package")
  next();
}

//login logic -----------------------------------------------------------------------------

/**
 * This function catches a POST submission and uses the data so managers can login. Before this, the 'logoutFirst' middleware will log any user out of the browser being used.
 * 
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
router.post('/staff/manager', logoutFirst, passport.authenticate("nursery", {
  failureRedirect: "/",
  failureFlash: true // allow flash messages

}), function(req, res) {

  res.redirect('/dashboard/manager/' + req.user._id);

});

/**
 * This function catches a POST submission and uses the data so teachers can login. Before this, the 'logoutFirst' middleware will log any user out of the browser being used.
 * 
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
router.post('/staff/teacher', logoutFirst, passport.authenticate("teacher", {
  failureRedirect: "/",
  failureFlash: true // allow flash messages

}), function(req, res) {
  res.redirect('/dashboard/teacher/' + req.user._id);
});

/**
 * This function catches a POST submission and uses the data so parents can login. Before this, the 'logoutFirst' middleware will log any user out of the browser being used.
 * 
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
router.post('/parent', logoutFirst, passport.authenticate("parent", {
  failureRedirect: "/",
  failureFlash: true // allow flash messages

}), function(req, res) {
  res.redirect('/dashboard/parent/' + req.user._id);

});

//--------------------------------------------------------------------------    
/**
 * 
 * @module app/routes/loginRouter
 */
module.exports = router;