var express = require("express");
var router = express.Router();
//var middlewares = require("../config/middlewares");//an object with my custom middleware functions

var passport = require('passport');
var isLoggedIn = require("../middlewares/isLoggedIn");

/**
 * This function first check if the user isLoggedIn, if so, it redirects the user to his dashboard,
 * otherwise, the home page presented to unauthenticated users will be rendered.
 * 
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
router.get('/', isLoggedIn.isLoggedInDashboard, function(req, res) {
  res.render('home.ejs');
});

/**
 * This function first check if the user isLoggedIn, if so, it redirects the user to his dashboard,
 * otherwise, the home page presented to unauthenticated users will be rendered.
 * 
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
router.get('/evaluation', isLoggedIn.isLoggedInDashboard, function(req, res) {
  res.render('evaluation.ejs');
});

/**
 * This function first check if the user isLoggedIn, if so, it redirects the user to his dashboard,
 * otherwise, the home page presented to unauthenticated users will be rendered.
 * 
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
router.get('/dashboard', isLoggedIn.isLoggedInDashboard, function(req, res) {
  res.redirect('back');
});


/**
 * This function will catch a get request to '/logout' and will log the current user out of the session.
 * 
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
router.get("/logout", function(req, res) {

  req.logout(); //passport destroys all user data in the session.(this comes with "passport package")
  req.flash("success", "Logged you out");
  res.redirect('/'); //Inside a callback… bulletproof!

});

/**
 * This function will catch any non-existance route/path to the childev website and will render a '404' error page.
 * 
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
router.get('*', function(req, res) {
  res.render('404.ejs');
});

/**
 * 
 * @module app/routes/launcher
 */
module.exports = router;