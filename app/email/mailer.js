var helper = require('sendgrid').mail;
var sg = require('sendgrid')(process.env.SENDGRID_API);

 


function sendConfirmationEmail(username,activationhash,accountType,nurseryId,fn){
    var from_email = new helper.Email('noreply@admin.childev.com','Childev Team');
    var to_email = new helper.Email(username);
    var subject = 'Please verify your Childev account';
    
    var customStarter='Hi, \n\n Thanks for using Childev! Please confirm your email address by clicking on the link below. \n\n';
    var acticationLink;
    
    /**
     * If nursaryId is not equals to 'noneyet', it means that the email will be sent either to Teachers or Parents
     * otherwise the email will be sent to a Manager. This is useful because, when the Teacher or Parent
     * registers, he/she has to belong to a nursary, hence the nursery id is sent as a parameter in the url.
     *
     */
    
    if(nurseryId==='noneyet'){
        acticationLink = 'https://fyp-michaelzap94.c9users.io/activate/'+accountType+'?username='+username+'&activationhash='+activationhash;

    }else{
        acticationLink = 'https://fyp-michaelzap94.c9users.io/activate/'+accountType+'/'+nurseryId+'?username='+username+'&activationhash='+activationhash;

    }
    
    var customEnding = '\n\n Thank you.'
    
    var finalMessage = customStarter+acticationLink+customEnding;
    
    var content = new helper.Content('text/plain', finalMessage);
    var mail = new helper.Mail(from_email, subject, to_email, content);
    var request = sg.emptyRequest({
      method: 'POST',
      path: '/v3/mail/send',
      body: mail.toJSON(),
    });
     
    sg.API(request, function(error, response) {
     
       fn(response.statusCode);//callback to access it in the functin that calls this.
      
    });
}

module.exports = {sendConfirmationEmail:sendConfirmationEmail};
