var Nursery = require("../schemas/admin/nursery.js");
var sendEmail=require("../email/mailer.js");
var Children = require("../schemas/children/childrenSchema.js");


   /***********CALLBACK INSIDE CALLBACK INSIDE CALLBACK to beat Async ****/
    function findUser(req,res,email,parentOrTeacher,childId,loopnow,cb){
        //populates teachers or parents and return Teacher or Parent Fields empty if email does not exists in that db
             var existsInPopulated = false;
         Nursery.findById(req.user._id).populate(parentOrTeacher,null,{username:email}).exec(function(err,userFound){
            if(err){
               return res.send({error:'Sorry this id was not found'});
            }else{
               
               if(userFound[parentOrTeacher].length>0){
                   existsInPopulated = true;
                    return loopnow(res,email,parentOrTeacher,childId,existsInPopulated,userFound,cb);
               }else{
                    return loopnow(res,email,parentOrTeacher,childId,existsInPopulated,userFound,cb);
               }
              
                
            }
    });
    
    }
    function findChildAndPushToParentsEmails(res,email,parentOrTeacher,childId){//so when the parent registers with this email, he passes the isParentOf authorization process in the 'registerRouter'
        Children.findById(childId,function(err,foundChild) {
           foundChild.parentsemails.push(email);
           foundChild.save(function(err,savedChild){
               if(err){
                   console.log(err);
               }else{
                 return res.send({parentOrTeacher:parentOrTeacher,email:email,childId:childId, success:"Registration link successfully sent to "+email});
               }
           });
        });
    };
    function myloopnow(res,email,parentOrTeacher,childId,existsInPopulated,userFound,checktosend){
         var inserted = 0;
          var exists = false;
         
            var arr;
            if(parentOrTeacher==='teacher'){
               arr= userFound.waitingRegistrationTeachers; 
               arr.forEach(function(emailFoundArr){
                    ++inserted;
                    if(email==emailFoundArr){
                           exists = true;
                        
                       }  
                       if(inserted==arr.length && exists==true){
                            
                           return checktosend(exists,existsInPopulated,email,parentOrTeacher,childId, userFound,res);
                        }
                       if(inserted==arr.length && exists==false){
                           return checktosend(exists,existsInPopulated,email,parentOrTeacher,childId,userFound,res);
                        }
                    });//loop
            }else if(parentOrTeacher==='parent'){
               arr= userFound.waitingRegistrationParents; 
                arr.forEach(function(emailFoundArr){
                    ++inserted;
                    if(email==emailFoundArr.email){
                           exists = true;
                        
                       }  
                       if(inserted==arr.length && exists==true){
                            
                           return checktosend(exists,existsInPopulated,email,parentOrTeacher, childId,userFound,res);
                        }
                       if(inserted==arr.length && exists==false){
                           return checktosend(exists,existsInPopulated,email,parentOrTeacher,childId,userFound,res);
                        }
                    });//loop
            }
            
            
          
                  
    }
    
    function mycheck(check,existsInPopulated,email,parentOrTeacher,childId,userFound,res){
        if(check){
            return res.send({error:"Email has already been sent, try clicking on the 'Re-send Link' button in the Parents section."});
        }else if(existsInPopulated){
            return res.send({error:"User is already registered."});

            }else{
                
                 if(parentOrTeacher==='parent'){
                        sendEmail.sendConfirmationEmailToParents(email,userFound.activationhash,userFound._id,childId,function(statusCode){
                                if(statusCode==202){
                                    userFound.waitingRegistrationParents.push({email:email, childId:childId});
                                    userFound.save(function(err, savedUser){
                                        if(err){
                                            return res.send({error:err});
                                            
                                        }else{
                                            return findChildAndPushToParentsEmails(res,email,parentOrTeacher,childId);
                                       }
                                    });  
                                       
                                }else{
 
                                    return res.send({error:"Sorry,something went wrongSorry and the email could not be sent. Please contact the Childev Administrator."});
                                    
                                }
                        });//sendEmail
                }else{
                        sendEmail.sendConfirmationEmail(email,userFound.activationhash,parentOrTeacher,userFound._id,function(statusCode){
                                if(statusCode==202){
                                    userFound.waitingRegistrationTeachers.push(email);
                                    userFound.save(function(err, savedUser){
                                        if(err){
                                            return res.send({error:err});
                                            
                                        }else{
                                             return res.send({parentOrTeacher:parentOrTeacher,email:email, success:"Registration link successfully sent to "+email});
                                             
                                       }
                                    });  
                                       
                                }else{
 
                                    return res.send({error:"Sorry,something went wrongSorry and the email could not be sent. Please contact the Childev Administrator."});
                                    
                                }
                            });//sendEmail
        
                }
            }
        
       
    }
    
module.exports = {
    findUser:findUser,
    myloopnow:myloopnow,
    mycheck:mycheck
};