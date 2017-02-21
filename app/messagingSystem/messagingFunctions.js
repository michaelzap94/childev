var Message = require("../schemas/messages/messagesSchema.js");



function sendNewMessage(req,res){
    var nurseryId;
    if(req.user.label==='manager'){
        nurseryId = req.user._id;
    }else{
        nurseryId = req.user.nursery.id;
    }
    
    var userToObject = JSON.parse(req.body.userToObject);
    var message = req.body.messageContent;

    var toObject = {
        id:userToObject.userIdTo,
        username: userToObject.usernameTo,
        name:userToObject.messageToName,
        label:userToObject.label,
    }
    var nameFrom = req.user.details[0].firstname+" "+req.user.details[0].lastname;
    var fromObject ={
        id: req.user._id,
        username: req.user.username,
        name: nameFrom,
        label: req.user.label,
     }
      var messageObject = {
          nursery:{ id:nurseryId },
          from:fromObject,
          to:toObject,
          message:message,
          
      }
     
     Message.create(messageObject, function (err, messageSaved) {
      if (err){
          req.flash('errors','Error sending message.');
          res.redirect('/dashboard/'+req.user.label+'/'+req.user._id+'/messages/sent');
      }else{
          req.flash('success','Success sending message.');
          res.redirect('/dashboard/'+req.user.label+'/'+req.user._id+'/messages/sent');
      }
    })
         
}

function deleteMessage(req,res){
     Message.findByIdAndRemove(req.params.messageId, function (err, messageDeleted) {
      if (err){
          req.flash('errors','Error sending message.');
          res.redirect('/messages');
      }else{
          req.flash('success','Success deleting message.');
          res.redirect('back');
      }
    });
}

module.exports = {
    sendNewMessage:sendNewMessage,
    deleteMessage:deleteMessage
}
