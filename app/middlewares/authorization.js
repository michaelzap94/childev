var Nursery = require("../schemas/admin/nursery.js");
var Teacher = require("../schemas/teacher/teacherSchema.js");
var Parent = require("../schemas/parent/parentSchema.js");


/**
 * This function checks that the user ir a Manager, if so proceed, otherwise redirect him back and show an error message.
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */

var isManager = function(req, res, next) {
  if (req.user !== undefined) {
    if (req.params.currentUserId == req.user._id) {
      Nursery.findById(req.user._id, function(error, foundUser) {
        if (error) {
          req.logout();
          req.flash('error', "You don't have authorization to access this type of account.");
          return res.redirect('/');
        } else {
          if (foundUser) {
            return next();
          } else {
            req.logout();
            req.flash('error', "You don't have authorization to access this type of account.");
            return res.redirect('/');
          }
        }
      });

    } else {
      req.logout();
      req.flash('error', "You don't have authorization to access this type of account.");
      res.redirect('/');
    }

  } else {

    req.flash('error', "You don't have authorization to access this type of account.");
    res.redirect('/');
  }
}

/**
 * This function checks that the user ir a Teacher, if so proceed, otherwise redirect him back and show an error message.
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
var isTeacher = function(req, res, next) {
  if (req.user !== undefined) {
    if (req.params.currentUserId == req.user._id) {
      Teacher.findById(req.user._id, function(error, foundUser) {
        if (error) {
          req.logout();
          req.flash('error', "You don't have authorization to access this type of account.");
          res.redirect('/');
        } else {
          if (foundUser) {
            return next();
          } else {
            req.logout();
            req.flash('error', "You don't have authorization to access this type of account.");
            return res.redirect('/');
          }
        }
      });

    } else {
      req.logout();
      req.flash('error', "You don't have authorization to access this type of account.");
      res.redirect('/');
    }

  } else {

    req.flash('error', "You don't have authorization to access this type of account.");
    res.redirect('/');
  }
}

/**
 * This function checks that the user ir a Parent, if so proceed, otherwise redirect him back and show an error message.
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
var isParent = function(req, res, next) {
  if (req.user !== undefined) {
    if (req.params.currentUserId == req.user._id) {
      Parent.findById(req.user._id, function(error, foundUser) {
        if (error) {
          req.logout();
          req.flash('error', "You don't have authorization to access this type of account.");
          res.redirect('/');
        } else {
          if (foundUser) {
            return next();
          } else {
            req.logout();
            req.flash('error', "You don't have authorization to access this type of account.");
            return res.redirect('/');
          }
        }
      });

    } else {
      req.logout();
      req.flash('error', "You don't have authorization to access this type of account.");
      res.redirect('/');
    }

  } else {

    req.flash('error', "You don't have authorization to access this type of account.");
    res.redirect('/');
  }
}

/**
 * This module checks that a user has authorization to log in as a specific type of user, such as: manager, parent or teacher.
 * Also, it exports the functions created in this module, as an object to be called externally.
 * @module app/middlewares/authorization
 */
module.exports = {
  isManager: isManager,
  isTeacher: isTeacher,
  isParent: isParent
}