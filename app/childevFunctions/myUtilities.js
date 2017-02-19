//imported packages
var Parent = require("../schemas/parent/parentSchema.js");
var Children = require("../schemas/children/childrenSchema.js");
var Teacher = require("../schemas/teacher/teacherSchema.js");
var Nursery = require("../schemas/admin/nursery.js")
var passport = require('passport');



/**
 * This function resets the password of user
 * 
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
function resetPassword(req, res) {
   var id = req.user._id;
   var label = req.user.label;
   var schema;
   if(label==="parent"){
       schema = Parent;
   }else if(label==="teacher"){
       schema = Teacher;
   }else if(label==="manager"){
       schema = Nursery;
   }else{
        req.flash("error","Password was not updated.")
        res.redirect("/");

   }

    schema.findById(id,function(err, userFound) {
      if(err){
        req.flash("error","Password was not updated.")
        res.redirect("/");

        }
      else{
            userFound.setPassword(req.body.password,function(){
            userFound.save();
              
            req.flash("success","Password updated successfully.")
            res.redirect("/");
          });
       
      }
    });
  

}

  /**
   * schema.authenticate(password,cb); Checks the password submitted matches with the actual password of user.
   *
   */
function deleteUser(req,res){
   var label = req.user.label;
   var schema;
   if(label==="parent"){
       schema = Parent;
   }else if(label==="teacher"){
       schema = Teacher;
   }else if(label==="manager"){
       schema = Nursery;
   }else{
        req.flash("error","Password was not updated.")
        res.redirect("/");

   }
   var passwordSubmitted = req.body.delete_password;

    schema.findById(req.user._id,function(err, userFound){
          userFound.authenticate(passwordSubmitted, function(err, isMatch) {
           if (err){
            console.log(err);
           } else{
                if(isMatch){
                    
                    userFound.remove(function(err){
                        if(err){
                            console.log(err);
                          req.flash('error', 'Error deleting your profile.');
                          res.redirect('back');
                        }else{
                          
                          req.flash('success', 'Success deleting your profile.');
                          res.redirect('/');
                
                          
                        }
                    });
                    
                }else{
                    req.flash('error', "The submitted password does not match our records.");
                    res.redirect('back');
                }
           }
            
        });
    });
}




/**
 * This function capitalizes the first letter of each word.
 * 
 * @param {String} req - Express request object
 */
function capitalizeStarter(str) {
    if(str!=undefined){
  var arrOfWords = str.split(/\s+/).filter(Boolean); //filters out white spaces

  var capitalizedWordArr = [];

  arrOfWords.forEach(function(word) {
    capitalizedWordArr.push(word.charAt(0).toUpperCase() + word.slice(1));
  });
   

  return capitalizedWordArr.join(' '); //returns every word passed capitalized
    }else{
        return str;
    }
}



function unlinkParentFromChild(req,res,parentId,childId){
        
        Parent.findById(parentId,function(err, parentFound) {
        parentFound.update({
            $pull: { 
              "children": childId
            }
          }, function(err, dataRet) {
            if (err) {
              return res.send({
                error: 'Sorry, something went wrong when trying to remove element.'
              });
            } else {
              return unlinkChildFromParent(req,res,parentId,childId,parentFound);
            }
          });
        });
  
  

  
  
}


function unlinkChildFromParent(req,res,parentId,childId,parentFound){
     Children.update({
            _id: childId
          }, {
            $pull: { 
              "parent": parentId, "parentsemails": parentFound.username
            }
          }, function(err, dataRet) {
            if (err) {
              return res.send({
                error: 'Sorry, something went wrong when trying to remove element.'
              });
            } else {
              req.flash('success','Success unlinking parent from child.');
              res.redirect('back');
            }
          });
}

/**
 * 
 * @module app/childevFunctions/parentRegister
 */
module.exports = {
  resetPassword: resetPassword,
  capitalizeStarter:capitalizeStarter,
  deleteUser:deleteUser,
  unlinkParentFromChild:unlinkParentFromChild
}