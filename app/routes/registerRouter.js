var express = require("express");
var router = express.Router();
var crypto = require("crypto");

var sendEmail = require('../email/mailer.js');

var Nursery = require("../schemas/admin/nursery.js");
var Teacher = require("../schemas/teacher/teacherSchema.js");
var Parent = require("../schemas/parent/parentSchema.js");

var teacherFunctions = require("../childevFunctions/teacherRegister.js");
var parentFunctions = require("../childevFunctions/parentRegister.js");

/**
 * This function capitalizes the first letter of each word.
 * 
 * @param {String} req - Express request object
 */
function capitalizeStarter(str) {
  var arrOfWords = str.split(/\s+/).filter(Boolean); //filters out white spaces

  var capitalizedWordArr = [];

  arrOfWords.forEach(function(word) {
    capitalizedWordArr.push(word.charAt(0).toUpperCase() + word.slice(1));
  });

  return capitalizedWordArr.join(' '); //returns every word passed capitalized
}
//------------------------------------------------------------------

/**
 * This function renders the Nursery Register Form.
 * 
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
router.get('/nursery', function(req, res) {
  res.render('./registrationForms/nurseryRegister.ejs');
});

//-----------------------------------------------------------------   

/**
 * This function catches a POST submission and uses the data register a nursery and also, it sends a confirmation email.
 * 
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
router.post('/nursery', function(req, res) {
  req.logout();
  //------------------//
  var newUser = new Nursery({
    username: req.body.username
  });
  var activationhash = crypto.createHash('md5').update(req.body.username).digest('hex');

  newUser.label = 'manager';
  newUser.active = 0;
  newUser.activationhash = activationhash;
  newUser.waitingRegistrationTeachers = ""; // so it works when I do a forEach loop;
  newUser.waitingRegistrationParents = ""; // so it works when I do a forEach loop;
  newUser.waitingLinkingParents = ""; // so it works when I do a forEach loop;
  var address = {
    address1: capitalizeStarter(req.body.address1),
    address2: capitalizeStarter(req.body.address2),
    city: capitalizeStarter(req.body.city),
    country: capitalizeStarter(req.body.country),
    postcode: req.body.postcode
  };

  newUser.details.push({
    name: capitalizeStarter(req.body.name),
    nurserycontactnumber: req.body.nurserycontactnumber,
    address: address,
    firstname: capitalizeStarter(req.body.firstname),
    lastname: capitalizeStarter(req.body.lastname),
    managerlabel: 'manager',
    urn:req.body.urn,
    managercontactnumber: req.body.managercontactnumber
  });

  //--------------------------//
  Nursery.register(newUser, req.body.password, function(err, nurseryFound) {
    if (err) {

      req.flash("error", err.message); //err is from "passport package"
      return res.redirect("back");

    } else {

      sendEmail.sendConfirmationEmail(req.body.username, nurseryFound, 'nursery', 'noneyet', function(statusCode) {
        if (statusCode == 202) {
          req.flash("success", "Please, check your mail and confirm the link we have sent you to access the platform as a Manager.");
          res.redirect('/');
        } else {
          req.flash("error", "Sorry,something went wrongSorry and the email could not be sent. Please contact the Childev Administrator.");
          res.redirect('/');
        }

      });

    }

  });

});

//--------------------------------------------------------------------------------

/**
 * This function catches POST submissions and uses the data to register a user as a teacher.
 * User got here because the activationhash and nurseryid matched and the form was rendered,
 * if they didn't match, he would not have got here.
 * 
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
router.post('/teacher/:nurseryId', function(req, res) {
  req.logout();
  var nurseryId = req.params.nurseryId;
  var password = req.body.password;
  var newUser = new Teacher({
    username: req.body.username
  });
  newUser.label = 'teacher';
  newUser.details.push({
    firstname: capitalizeStarter(req.body.firstname),
    lastname: capitalizeStarter(req.body.lastname),
    contactnumber: req.body.contactnumber
  });
  //variables to check if the manager actually sent the link to user, if so continue, otherwise no/
  var inserted = 0,
    exists = false,
    parentOrTeacher = 'teacher';

  Nursery.findById(nurseryId, function(err, foundNursery) { //first find Nursery it belongs to
    if (err) {

    } else {
      newUser.nursery = {
        id: foundNursery._id,
        username: foundNursery.username
      }
      var arr = foundNursery.waitingRegistrationTeachers;
      arr.forEach(function(emailFoundArr) {
        ++inserted;
        if (req.body.username == emailFoundArr) {
          exists = true;

        }
        if (inserted == arr.length && exists == true) {
          return teacherFunctions.registerTeacher(req, res, newUser, password, foundNursery);
        }
        if (inserted == arr.length && exists == false) {

          req.flash('error', "You don't have permision to register as a teacher, ask the manager to send you a registration link.");
          return res.redirect('/');
        }
      }); //loop
    }
  });
});
//-------------------------------------------------------------------------------------------------------------------------------------

/**
 * This function catches POST submissions and uses the data to register a user as a parent.
 * User got here, because the activationhash and nurseryid and childID matched and the form was rendered,
 * if they didn't match, he would not have got here.
 * 
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 *
 */
router.post('/parent/:nurseryId', function(req, res) {
  req.logout();
  var childId = req.body.childId;
  var nurseryId = req.params.nurseryId;
  var password = req.body.password;
  var address = {
    address1: capitalizeStarter(req.body.address1),
    address2: capitalizeStarter(req.body.address2),
    city: capitalizeStarter(req.body.city),
    country: capitalizeStarter(req.body.country),
    postcode: req.body.postcode
  };
  var newUser = new Parent({
    username: req.body.username
  });

  newUser.label = 'parent';

  newUser.carertype = req.body.carertype;

  newUser.details.push({
    firstname: capitalizeStarter(req.body.firstname),
    lastname: capitalizeStarter(req.body.lastname),
    contactnumber: req.body.contactnumber,
    address: address
  });

  //variables to check if the manager actually sent the link to user, if so continue, otherwise no/
  var inserted = 0,
    exists = false;

  Nursery.findById(nurseryId, function(err, foundNursery) { //first find Nursery it belongs to
    if (err) {

    } else {

      newUser.nursery = {
        id: foundNursery._id,
        username: foundNursery.username
      }
      var arr = foundNursery.waitingRegistrationParents;
      arr.forEach(function(emailFoundArr) {
        ++inserted;
        if (req.body.username == emailFoundArr.email) {
          exists = true;

        }
        if (inserted == arr.length && exists == true) {
          return parentFunctions.checkIsParentOfChild(req, res, newUser, password, foundNursery, childId, req.body.username);
        }
        if (inserted == arr.length && exists == false) {

          req.flash('error', "You don't have permision to register as a parent, ask the manager to send you a registration link.");
          return res.redirect('/');
        }
      }); //loop
    }
  });
});

/**
 * 
 * @module app/routes/registerRouter
 */
module.exports = router;