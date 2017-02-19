var express = require("express");
var router = express.Router();

var sendEmail = require('../email/mailer.js');

var Nursery = require("../schemas/admin/nursery.js");
var Teacher = require("../schemas/teacher/teacherSchema.js");
var Parent = require("../schemas/parent/parentSchema.js");




router.post("/:label/newpassword/link",function(req,res){
    var label = req.params.label;
    var schema;
    switch (label) {
        case 'teacher':
            schema = Teacher;
            break;
        case 'parent':
            schema = Parent;
            break;
        case 'manager':
            schema = Nursery;
            break;
        
        default:
            req.flash('error','Sorry there was an error deciding the type of account.');
            res.redirect('/');
    }
    //find the user by the username sent in the form.
    schema.findOne({username:req.body.username},function(err, userRet){
       if(err){
            req.flash('error','Sorry, there was an error in the database.');
            res.redirect('/');
       } 
       else{
           console.log(userRet);
           if(userRet){
               sendEmail.sendResetPasswordLink(req,res,userRet,function(statusCode){
                    if (statusCode == 202) {
                      req.flash('success', 'Success sending reset link.');
                      res.redirect('/');
                    
                    } else {
                      req.flash('error', 'Error sending the email.');
                      res.redirect('/');
                    }
                  }); //sendEmail
            
           }else{
               req.flash('error','Sorry, this user is not registerd with us as a '+label+".");
            res.redirect('/');
           }           
        }
    });
    
});

//new password Form;
router.get("/:label/newpassword",function(req,res){
    var token = req.query.token;
    var id = req.query.id;
    var label = req.params.label;
    var schema;
    switch (label) {
        case 'teacher':
            schema = Teacher;
            break;
        case 'parent':
            schema = Parent;
            break;
        case 'manager':
            schema = Nursery;
            break;
        
        default:
            req.flash('error','Sorry there was an error deciding the type of account.');
            res.redirect('/');
    }
 
    if(token.length>0&&id.length>0){
    schema.findById(id,function(err, userFound) {
        if(err){
            res.send("Something went wrong, try again later.")
        }
        else{
            if(userFound.resetPasswordToken===parseInt(token)){
            res.render("./partials/newPasswordForm",{userPassId:userFound._id, label:label});
        } else{
            req.flash("error","The token has expired. \n\n Please, request a new Password Again and try the new link that will be sent to your email");
            res.redirect('/');
            
        }
            
        }
    });
    }
    else{
       req.flash('error',"You need to have a token to access this link, try getting a token first.");
       res.redirect('/');
    }
    
});



//new Password set up.
router.put("/:label/newpassword/:id",function(req,res){
    var id = req.params.id;
    var label = req.params.label;
    var schema;
    switch (label) {
        case 'teacher':
            schema = Teacher;
            break;
        case 'parent':
            schema = Parent;
            break;
        case 'manager':
            schema = Nursery;
            break;
        
        default:
            req.flash('error','Sorry there was an error deciding the type of account.');
            res.redirect('/');
    }
    schema.findById(id,function(err, userFound) {
      if(err){
       req.flash("error","Password was not updated.")
       res.redirect('/');
        }
      else{
            userFound.setPassword(req.body.password,function(){
            userFound.resetPasswordToken = null;//sets the token to null when the token has been used, thus, the user will have to request a new link.
            userFound.save();
              
            req.flash("success","Password updated successfully. Try logging in with your new password.");
            res.redirect("/");
          });
       
      }
    });
    
    
});



module.exports = router;