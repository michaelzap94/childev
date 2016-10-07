var helper = require('sendgrid').mail;
var from_email = new helper.Email('noreply@admin.childev.com');
var to_email = new helper.Email('mikeyfriends@gmail.com');
var subject = 'Hello World from the SendGrid Node.js Library!';
var content = new helper.Content('text/plain', 'Hello, Email!');
var mail = new helper.Mail(from_email, subject, to_email, content);
 
var sg = require('sendgrid')(process.env.SENDGRID_API);
var request = sg.emptyRequest({
  method: 'POST',
  path: '/v3/mail/send',
  body: mail.toJSON(),
});
 
function sendEmail(req,res){
 sg.API(request, function(error, response) {
  if(response.statusCode===202){
      req.flash('success', 'Email Sent, Please check your Spam Folder and mark it as safe.');
      res.redirect('/');
      
  }else{
      console.log(response.statusCode+''+response.headers);
       req.flash('error', 'Sorry, Email could not be sent. Please contact the Childev Administrator.');
      res.redirect('/');
    
  }
});
}

module.exports = sendEmail;
