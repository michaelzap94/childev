var Message = require("../schemas/messages/messagesSchema.js");


/**
 * This function sends a new message to a user
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
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

/**
 * This function deletes a message from the Inbox of a user.
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
function deleteMessageInbox(req,res){
    var deletingUser = req.user._id;
    
     Message.findById(req.params.messageId, function (err, messageToDelete) {
      if (err){
          req.flash('errors','Error sending message.');
          res.redirect('/messages');
      }else{
          messageToDelete.to.deleted = true;
          
          if(messageToDelete.from.deleted == true){
              messageToDelete.remove(function(err,result){
                  if(err){
                    req.flash('error','Error deleting message from database.');
                    res.redirect('back');
                  }else{
                    req.flash('success','Success deleting message from database.');
                    res.redirect('back');                      
                  }
                  
              });
          }else{
              messageToDelete.save(function(err,objSaved){
                  if(err){
                    req.flash('error','Error deleting message.');
                    res.redirect('back');
                  }else{
                    req.flash('success','Success deleting message.');
                    res.redirect('back');                      
                  }

              });
          }
          

      }
    });
}

/**
 * This function deletes the message from the sent page of a user.
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
function deleteMessageSent(req,res){
    var deletingUser = req.user._id;
    
     Message.findById(req.params.messageId, function (err, messageToDelete) {
      if (err){
          req.flash('errors','Error sending message.');
          res.redirect('/messages');
      }else{
          messageToDelete.from.deleted = true;
          
          if(messageToDelete.to.deleted == true){
              messageToDelete.remove(function(err,result){
                  if(err){
                    req.flash('error','Error deleting message from database.');
                    res.redirect('back');
                  }else{
                    req.flash('success','Success deleting message from database.');
                    res.redirect('back');                      
                  }
                  
              });              
          }else{
              messageToDelete.save(function(err,objSaved){
                  if(err){
                    req.flash('error','Error deleting message.');
                    res.redirect('back');
                  }else{
                    req.flash('success','Success deleting message.');
                    res.redirect('back');                      
                  }

              });
          }

      }
    });
}

/**
 * This function marks a message as read.
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
function messageRead(req,res){
      Message.findById(req.params.messageId).exec(function(err, messageFound){
          if(err){
              res.send({error:'Something went wrong while accessing the database.'});
          }else{
              messageFound.to.read = true;
              messageFound.save(function(err,savedMessage){
                  if(err){
                      res.send({error:'Something went wrong while accessing the database.'});
                  }else{
                      res.send({ success:  'Success'}); 
                  }
              });
            
             
          }
      });
}

module.exports = {
    sendNewMessage:sendNewMessage,
    deleteMessageInbox:deleteMessageInbox,
    deleteMessageSent:deleteMessageSent,
    messageRead:messageRead
}
