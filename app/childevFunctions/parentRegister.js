var Parent = require("../schemas/parent/parentSchema.js");
var Children = require("../schemas/children/childrenSchema.js");
var passport = require('passport');


function checkIsParentOfChild(req,res,newUser,password,foundNursery,childId,email){
     var inserted = 0,
          exists = false;
    Children.findById(childId,function(error,foundChild){
        if(error){
            console.log(error);
        }else{
            console.log(foundChild);
              var arr = foundChild.parentsemails;
                arr.forEach(function(emailFoundArr){
                        ++inserted;
                        if(email==emailFoundArr){
                               exists = true;
                            
                           }  
                           if(inserted==arr.length && exists==true){
                            return registerParent(req,res,newUser,password,foundNursery,childId,foundChild);
                            }
                           if(inserted==arr.length && exists==false){
                               
                            req.flash('error',"You don't have permision to register as a parent for this child, ask the manager to send you a registration link.");
                              return res.redirect('/');
                            }
                });//loop
        }
    });
} 
function addParentToChildrenSchema(req,res,userRegisterd,foundChild){
    foundChild.parent.push(userRegisterd);
    foundChild.save(function(err, newChildData){
        if(err){
            console.log(err);
        } else {
            return addChildToParentSchema(req,res,userRegisterd,newChildData);
        }
    });
}

function addChildToParentSchema(req,res,userRegisterd,newChildData){
    userRegisterd.children.push(newChildData);
    userRegisterd.save(function(err, userRegisterdNewData){
        if(err){
            console.log(err);
        } else {
            passport.authenticate('parent')(req,res,function(){
                                                     
                req.flash("success","Successfully registered " +userRegisterdNewData.username);
                res.redirect("/dashboard/parent/"+req.user._id);
        
            });        
            
        }
    });
     
}

function registerParent(req,res,newUser, password,foundNursery,childId,foundChild){
                

                    Parent.register(newUser,password,function(err,userRegisterd){ //then register
                       if(err){
                           req.flash("error",err.message);//err is from "passport package"
                                  return res.redirect("back");
                                console.log('error happened when registering');
                         }else{
                             
                             //then add teacher to that nursery
                             foundNursery.parent.push(userRegisterd);
                             foundNursery.save(function(err, data){
                                if(err){
                                    console.log(err);
                                } else {
                  
                                        foundNursery.update({ $pull: { waitingRegistrationParents: { $in: [ userRegisterd.username ] }  } },function(err,dataRet){
                                              if(err){
                                                  req.flash('error','Sorry, something went wrong when trying to remove element.');
                                                  res.redirect('back');
                                                  console.log('error removing');
                                              }else{
                                                
                                                  return addParentToChildrenSchema(req,res,userRegisterd,foundChild);
                                              }
                                          }
                                        );//foundNursary.update, removes the teacher from the waiting registration list in the manager's view

                                }
                            });
                        }
               
                   });//Teacher.register
    }

module.exports = {
    checkIsParentOfChild:checkIsParentOfChild
}