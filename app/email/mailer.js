var helper = require('sendgrid').mail;
var sg = require('sendgrid')(process.env.SENDGRID_API);
var crypto = require('crypto');
var assert = require('assert');
var Parent = require("../schemas/parent/parentSchema.js");


/**
 * This function sends a confirmation email to teachers.
 * @param {String} username - This parameter is the email of the user.
 * @param {String} activationhash - This parameter is the activation code.
 * @param {String} nurseryFound - This is the nursery found in the previus middleware.
 * @param {String} accountType - This is the type of the account, can be 'manager', 'teacher' or 'parent'.
 * @param {String} nurseryId - This is the ID to which the user should be registerd to.
 * @param {Function} fn - This is the callback function that has as input parameter the status code: 'response.statusCode'.
 */

function sendConfirmationEmail(username, nurseryFound, accountType, nurseryId, fn) {
  var from_email = new helper.Email('noreply@admin.childev.com', 'Childev Team');
  var to_email = new helper.Email(username);
  var activationhash = nurseryFound.activationhash;
  var nurseryName = nurseryFound.details[0].name || 'a nursery';
  var subject = 'Please verify your Childev account';
  var purpose ="monitor the development of the children registered in your nusery";;
  var link;
  var bodyContent;
  /**
   * If nursaryId is not equals to 'noneyet', it means that the email will be sent either to Teachers or Parents
   * otherwise the email will be sent to a Manager. This is useful because, when the Teacher or Parent
   * registers, he/she has to belong to a nursary, hence the nursery id is sent as a parameter in the url.
   *
   */

  if (nurseryId === 'noneyet') {
    //activation link for nurseries
    link = 'https://childev.herokuapp.com/activate/' + accountType + '?username=' + username + '&activationhash=' + activationhash;
    bodyContent = 'To finish your nursery registration, <br/><br/> Please, confirm your email address by clicking on the button below.';

  } else {
     //activation link for teachers
    link = 'https://childev.herokuapp.com/activate/' + accountType + '/' + nurseryId + '?username=' + username + '&activationhash=' + activationhash;
    bodyContent = 'You have been invited to join <strong>'+nurseryName+'</strong> as a teacher. <br/><br/> Please confirm your email address by clicking on the button below.';
  }



    var btntitle = "Confirm email";
    
  
    var content = new helper.Content('text/html', bodyContent);
    var mail = new helper.Mail(from_email, subject, to_email, content);
     mail.personalizations[0].addSubstitution(new helper.Substitution('-btnlink-', link));
     mail.personalizations[0].addSubstitution(new helper.Substitution('-purpose-', purpose));
     mail.personalizations[0].addSubstitution(new helper.Substitution('-btntitle-', btntitle));
     mail.setTemplateId(process.env.SENDGRID_TEMPLATE_WARNING);
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
 * @param {String} nurseryFound - This is the nursery found in the previus middleware.
 * @param {String} childId - This is the Id of the child this user is a parent of.
 * @param {Function} fn - This is the callback function that has as input parameter the status code: 'response.statusCode'.
 */
function sendConfirmationEmailToParents(username, nurseryFound, childId, fn) {
  var from_email = new helper.Email('noreply@admin.childev.com', 'Childev Team');
  var to_email = new helper.Email(username);
  var activationhash = nurseryFound.activationhash;
  var nurseryId = nurseryFound._id;
  var nurseryName = nurseryFound.details[0].name || 'a nursery';
  var purpose="monitor the development of your child";

    Parent.findOne({username:username},function(err, userFound) {
      if(err){
          return
        }
      else{
             if(userFound){
                    var subject = 'Link your account to a new child.';
                    var link = 'https://childev.herokuapp.com/linkaccount/parent/' + nurseryId + '?username=' + username + '&activationhash=' + activationhash + '&childId=' + childId;
                    var bodyContent = 'You are receiving this email because you requestes to be linked to a child. <br/><br/> Please, Click on the button below to be linked to the child account.';
                    var btntitle = "Link to child";
                    var content = new helper.Content('text/html', bodyContent);
                    var mail = new helper.Mail(from_email, subject, to_email, content);
                     mail.personalizations[0].addSubstitution(new helper.Substitution('-btnlink-', link));
                     mail.personalizations[0].addSubstitution(new helper.Substitution('-purpose-', purpose));
                     mail.personalizations[0].addSubstitution(new helper.Substitution('-btntitle-', btntitle));
                     mail.setTemplateId(process.env.SENDGRID_TEMPLATE_WARNING);
                    var request = sg.emptyRequest({
                      method: 'POST',
                      path: '/v3/mail/send',
                      body: mail.toJSON(),
                    });
                  
                    sg.API(request, function(error, response) {
                  
                      fn(response.statusCode, true); //callback to access it in the functin that calls this.
                  
                    });
                            
           }else{
                    var subject = 'Please verify your Childev account';
                    var link = 'https://childev.herokuapp.com/activate/parent/' + nurseryId + '?username=' + username + '&activationhash=' + activationhash + '&childId=' + childId;
                    var bodyContent = 'You have been invited to join <strong>'+nurseryName+'</strong> as a parent. <br/><br/> Please confirm your email address by clicking on the button below.';
                    var btntitle = "Link to child";
                    var content = new helper.Content('text/html', bodyContent);
                    var mail = new helper.Mail(from_email, subject, to_email, content);
                     mail.personalizations[0].addSubstitution(new helper.Substitution('-btnlink-', link));
                     mail.personalizations[0].addSubstitution(new helper.Substitution('-purpose-', purpose));
                     mail.personalizations[0].addSubstitution(new helper.Substitution('-btntitle-', btntitle));
                     mail.setTemplateId(process.env.SENDGRID_TEMPLATE_WARNING);
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

/*****************************************/

/**
 * This function sends a link for users to reset their passwords.
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Object} userRet - This is the User object passed.
 * @param {Function} fn - This is the callback function that has as input parameter the status code: 'response.statusCode'.
 */

function sendResetPasswordLink(req, res,userRet,fn) {
    // Not the movie transporter!
    var id = userRet._id;
    var username = userRet.username;
    var label = userRet.label;
    var purpose;
    
    var from_email = new helper.Email('noreply@admin.childev.com', 'Childev Team');
    var to_email = new helper.Email(username);
    var subject =  "Reset your password request";

    var token = saveToken(userRet);
    
    if(label==='parent'){
      purpose="monitor the development of your child";
    }else{
      purpose="monitor the development of the children registered in your nusery";
    }
  
    var link="https://"+req.get('host')+"/"+label+"/newpassword?"+"id="+id+"&token="+token;
    var bodyContent = 'You are receiving this email because you forgot your password. <br/><br/> Please, Click on the button below to reset your password';
    var btntitle = "Reset Password";
    
  
    var content = new helper.Content('text/html', bodyContent);
    var mail = new helper.Mail(from_email, subject, to_email, content);
     mail.personalizations[0].addSubstitution(new helper.Substitution('-btnlink-', link));
     mail.personalizations[0].addSubstitution(new helper.Substitution('-purpose-', purpose));
     mail.personalizations[0].addSubstitution(new helper.Substitution('-btntitle-', btntitle));
     mail.setTemplateId(process.env.SENDGRID_TEMPLATE_WARNING);
    var request = sg.emptyRequest({
      method: 'POST',
      path: '/v3/mail/send',
      body: mail.toJSON(),
    });
  
    sg.API(request, function(error, response) {
  
      fn(response.statusCode); //callback to access it in the functin that calls this.
  
    });

    
}

/**
 * This function will save or reset the token neccessary to change the password of a user.
 * @param {Object} userRet - This is the User object passed.
 * @param {Function} fn - This is a callback function.
 */
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


/******************************/

/**
 * This function sends a warning link to parents.
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Object} childFound - This is the child Found in the previus function.
 * @param {Object} comment - This is the comment the teacher has made about a child.
 * @param {Function} fn - This is the callback function that has as input parameter the status code: 'response.statusCode'.
 */
function warnParent(req, res,childFound,comment, fn) {
    // Not the movie transporter!
    var usernames = childFound.parentsemails;

    
    var subject =  "Warning about your latest child report.";
    var bodyContent = 'You are receiving this email because one of the "High Priority" evaluated skills was "Needs Special Attention" in the latest Report.';
    var link="https://"+req.get('host')+"/";
    var btntitle = "Access Childev";
    var purpose="monitor the development of your child";
    
    var mail = new helper.Mail();
    var from_email = new helper.Email('noreply@admin.childev.com', 'Childev Team');
    mail.setFrom(from_email);
    mail.setSubject(subject);
    
    
    var personalization = new helper.Personalization();
    usernames.forEach(function(email,i){
      if(i!==0){
          var  to_email = new helper.Email(email)
         personalization.addTo(to_email);   
      }

    });
    

    mail.addPersonalization(personalization)


    var content = new helper.Content('text/html', bodyContent);
     mail.personalizations[0].addSubstitution(new helper.Substitution('-btnlink-', link));
     mail.personalizations[0].addSubstitution(new helper.Substitution('-purpose-', purpose));
     mail.personalizations[0].addSubstitution(new helper.Substitution('-btntitle-', btntitle));
     mail.setTemplateId(process.env.SENDGRID_TEMPLATE_WARNING);
    
    mail.addContent(content);
    var request = sg.emptyRequest({
      method: 'POST',
      path: '/v3/mail/send',
      body: mail.toJSON(),
    });
  
    sg.API(request, function(error, response) {
        if(error){
          console.log(error);
        }
      fn(response.statusCode); //callback to access it in the functin that calls this.
  
    });

    
}

/***************************************/

/**
 * This function handles the contact me message from the home page
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} fn - This is the callback function that has as input parameter the status code: 'response.statusCode'.
 */
 function contactme(req, res,fn) {
    // Not the movie transporter!
    var from = req.body.email;
    var name = req.body.name;
    var phone = req.body.phone;
    var message = req.body.message;
    var to = process.env.ADMIN_EMAIL || "childev.manager@gmail.com";
    
    var from_email = new helper.Email(from, name);
    var to_email = new helper.Email(to);

    var subject =  "Information request about Childev";
    var purpose="keep developing the Childev application";
    var bodyContent = 'New Message From: <strong>'+name+'</strong>, <br/>Phone number: '+phone+'. <br/>'+'Message: <br/><br/>'+message;
    var link="https://"+req.get('host')+"/";
    var btntitle = "Access Childev";
   

    var content = new helper.Content('text/html', bodyContent);
    var mail = new helper.Mail(from_email, subject, to_email, content);
     mail.personalizations[0].addSubstitution(new helper.Substitution('-btnlink-', link));
     mail.personalizations[0].addSubstitution(new helper.Substitution('-purpose-', purpose));
     mail.personalizations[0].addSubstitution(new helper.Substitution('-btntitle-', btntitle));
     mail.setTemplateId(process.env.SENDGRID_TEMPLATE_WARNING);
    var request = sg.emptyRequest({
      method: 'POST',
      path: '/v3/mail/send',
      body: mail.toJSON(),
    });
  
    sg.API(request, function(error, response) {
  
      fn(error,response); //callback to access it in the functin that calls this.
  
    });

    
}




/**
 * This module contains the methods that are responsible for sending emails and exports them as an object to be called externally.
 * @module app/email/mailer
 */
module.exports = {
  sendConfirmationEmail: sendConfirmationEmail,
  sendConfirmationEmailToParents: sendConfirmationEmailToParents,
  sendResetPasswordLink:sendResetPasswordLink,
  warnParent:warnParent,
  contactme:contactme
};

