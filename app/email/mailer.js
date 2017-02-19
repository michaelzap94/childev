var helper = require('sendgrid').mail;
var sg = require('sendgrid')(process.env.SENDGRID_API);
var crypto = require('crypto');
var assert = require('assert');
var Parent = require("../schemas/parent/parentSchema.js");


/**
 * This function sends a confirmation email to teachers.
 * @param {String} username - This parameter is the email of the user.
 * @param {String} activationhash - This parameter is the activation code.
 * @param {String} accountType - This is the type of the account, can be 'manager', 'teacher' or 'parent'.
 * @param {String} nurseryId - This is the ID to which the user should be registerd to.
 * @param {Function} fn - This is the callback function that has as input parameter the status code: 'response.statusCode'.
 */

function sendConfirmationEmail(username, activationhash, accountType, nurseryId, fn) {
  var from_email = new helper.Email('noreply@admin.childev.com', 'Childev Team');
  var to_email = new helper.Email(username);
  var subject = 'Please verify your Childev account';

  var customStarter = 'Hi, \n Thanks for using Childev! Please confirm your email address by clicking on the link below. \n';
  var acticationLink;

  /**
   * If nursaryId is not equals to 'noneyet', it means that the email will be sent either to Teachers or Parents
   * otherwise the email will be sent to a Manager. This is useful because, when the Teacher or Parent
   * registers, he/she has to belong to a nursary, hence the nursery id is sent as a parameter in the url.
   *
   */

  if (nurseryId === 'noneyet') {
    //activation link for nurseries
    acticationLink = 'https://childev.herokuapp.com/activate/' + accountType + '?username=' + username + '&activationhash=' + activationhash;

  } else {
     //activation link for teachers
    acticationLink = 'https://childev.herokuapp.com/activate/' + accountType + '/' + nurseryId + '?username=' + username + '&activationhash=' + activationhash;

  }

  var customEnding = '\n Thank you.'

  var finalMessage = customStarter + acticationLink + customEnding;

  var content = new helper.Content('text/plain', finalMessage);
  var mail = new helper.Mail(from_email, subject, to_email, content);
  var request = sg.emptyRequest({
    method: 'POST',
    path: '/v3/mail/send',
    body: mail.toJSON(),
  });

  sg.API(request, function(error, response) {

    fn(response.statusCode); //callback to access it in the function that calls this.

  });
}

/**
 * This function sends a confirmation email to parents to register for the first time.
 * and also, sends a link to ALREADY registered parents, so they can link their account to the specified child.
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {String} username - This parameter is the email of the user.
 * @param {String} activationhash - This parameter is the activation code.
 * @param {String} nurseryId - This is the ID to which the user should be registerd to.
 * @param {String} childId - This is the Id of the child this user is a parent of.
 * @param {Function} fn - This is the callback function that has as input parameter the status code: 'response.statusCode'.
 */
function sendConfirmationEmailToParents(username, activationhash, nurseryId, childId, fn) {
  var from_email = new helper.Email('noreply@admin.childev.com', 'Childev Team');
  var to_email = new helper.Email(username);
  var subject;
  var activationLink;
  var customStarter;
  var customEnding = '\n Thank you.'
  var finalMessage;
   
    Parent.findOne({username:username},function(err, userFound) {
      if(err){
          return
        }
      else{
             if(userFound){
                  subject = 'Link your account to a new child.';
                  customStarter = 'Hi, \n Thanks for using Childev! Please confirm your email address by clicking on the link below. \n';
                  activationLink = 'https://childev.herokuapp.com/linkaccount/parent/' + nurseryId + '?username=' + username + '&activationhash=' + activationhash + '&childId=' + childId;
                    finalMessage = customStarter + activationLink + customEnding;
                    var content = new helper.Content('text/plain', finalMessage);
                    var mail = new helper.Mail(from_email, subject, to_email, content);
                    var request = sg.emptyRequest({
                      method: 'POST',
                      path: '/v3/mail/send',
                      body: mail.toJSON(),
                    });
                  
                    sg.API(request, function(error, response) {
                  
                      fn(response.statusCode, true); //callback to access it in the functin that calls this.
                  
                    });
                            
           }else{
                  subject = 'Please verify your Childev account';
                   customStarter = 'Hi, \n Thanks for using Childev! Please confirm your email address by clicking on the link below. \n';
                   activationLink = 'https://childev.herokuapp.com/activate/parent/' + nurseryId + '?username=' + username + '&activationhash=' + activationhash + '&childId=' + childId;
                    finalMessage = customStarter + activationLink + customEnding;
                    var content = new helper.Content('text/plain', finalMessage);
                    var mail = new helper.Mail(from_email, subject, to_email, content);
                    var request = sg.emptyRequest({
                      method: 'POST',
                      path: '/v3/mail/send',
                      body: mail.toJSON(),
                    });
                  
                    sg.API(request, function(error, response) {
                  
                      fn(response.statusCode, false); //callback to access it in the functin that calls this.
                  
                    });
           }           
       
      }
    });
       
        
            

  


 



}



/**
 * This function sends a link for users to reset their passwords.
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {String} userRet - This is the User object passed.
 * @param {Function} fn - This is the callback function that has as input parameter the status code: 'response.statusCode'.
 */
function sendResetPasswordLink(req, res,userRet,fn) {
    // Not the movie transporter!
    var id = userRet._id;
    var username = userRet.username;
    var label = userRet.label;
    
    var from_email = new helper.Email('noreply@admin.childev.com', 'Childev Team');
    var to_email = new helper.Email(username);
    var subject =  "Please click on the following link to change your password";

    var customStarter = 'Hi, \n Thanks for using Childev! Please Click on the link below to change your password. \n';
  
    var token = saveToken(userRet);
  
    var link="https://"+req.get('host')+"/"+label+"/newpassword?"+"id="+id+"&token="+token;

  
    var customEnding = '\n Thank you.'
  
    var finalMessage = customStarter + link + customEnding;
  
    var content = new helper.Content('text/plain', finalMessage);
    var mail = new helper.Mail(from_email, subject, to_email, content);
    var request = sg.emptyRequest({
      method: 'POST',
      path: '/v3/mail/send',
      body: mail.toJSON(),
    });
  
    sg.API(request, function(error, response) {
  
      fn(response.statusCode); //callback to access it in the functin that calls this.
  
    });

    
}


function saveToken(userRet,fn){
  
    if(userRet.resetPasswordToken){
        return userRet.resetPasswordToken;
    }
    else{
        var token = Math.round(Math.random() * 1000000);
        userRet.resetPasswordToken = token;
        userRet.save();
        return token;
        
    }
}




/**
 * This module contains the methods that are responsible for sending emails and exports them as an object to be called externally.
 * @module app/email/mailer
 */
module.exports = {
  sendConfirmationEmail: sendConfirmationEmail,
  sendConfirmationEmailToParents: sendConfirmationEmailToParents,
  sendResetPasswordLink:sendResetPasswordLink
};