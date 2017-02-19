var express = require("express");
var router = express.Router({mergeParams: true});//parameters in routes cannot be read if specified outside this file unless you merge params.
var passport = require("passport");
//var User = require("../schemas/user");
var Poll = require("../schemas/voting/votingSchema");


//-----POLLS OF USER AUTHENTICATED

//GET dashboard /dashboard FORM
function getUserPolls(req,res,next){
    var query; 
    
    if(req.user.label!=="manager"){
        query = {"author.id":req.user.nursery.id};

        Poll.find(query).exec(function(err, userPollsRet){
           if(err){
               console.log(err);
           } else {
            
               req.userPollsRet= userPollsRet;
               next();
           }
    }); 
    }else{
        query = {"author.id":req.user._id};

         Poll.find(query).exec(function(err, userPollsRet){
           if(err){
               console.log(err);
           } else {
            
               req.userPollsRet= userPollsRet;
               next();
           }
        }); 
    
    }
}

//------------------------

   var randomNumber = function () {
        var rgbArray = [];
        for (var i = 0; i < 3; i++) {
            var x = Math.random(); //random number
            x = 255 * x; //if we want "say" a random number 0-255
            x = Math.round(x);//////  rounds a number;
            rgbArray.push(x);
        }

        return rgbArray;
    };

    var randomColor = function () {
        var rgbArrayRandomGenerator = randomNumber();

        var rgbColor = "rgb(" + rgbArrayRandomGenerator[0] + ", " + rgbArrayRandomGenerator[1] + ", " + rgbArrayRandomGenerator[2] + ")";

        return rgbColor;
    };


function createPollWithOptions(req,res){
    var ArrayWithEmptyFields = req.body.option;
    
        var optionsArray = ArrayWithEmptyFields.filter(function(val) { //returns true if array is not empty.
          return val !== "";
        });
    
      var author = {id:req.user._id, username:req.user.username, label:req.user.label};
        
        // get data from form and add to campgrounds array
        var title = req.body.title;
        var desc = req.body.description;
        var newPoll = {title: title, description: desc, author: author};
        
       var createdPoll = new Poll(newPoll);
       
       optionsArray.forEach(function(element){
                            var obj ={
                                label:element,
                                color: randomColor()
                            }
                        
                        createdPoll.optionsArray.push(obj);
                     });
                     
       // req.createPoll = createdPoll;
         createdPoll.save(function(err,dataRet){
             if(err){
                 req.flash("error","Sorry, The poll could not be created.");
                res.redirect("/");
             }else{
                 req.flash("success","Successfully created");
                res.redirect("/");
             }
            
        });
       
                 
}

function deletePoll(req,res){
    Poll.findByIdAndRemove(req.params.id,function(err,pollDeleted){
         if(err){
                       req.flash("error","ERROR deleting poll with id: "+req.params.comment_id);

                        res.redirect("back");

        }
        else{
             req.flash("success","Successfully deleted");

            res.redirect("/dashboard");
        }
        
    });

}


//SHOW SPECIFIC POLL :id

function showOnePoll(req,res,next){
     Poll.findById(req.params.id).populate("optionsArray").exec(function(err, showOnePoll){
        if(err){
            console.log(err);
            res.redirect("back");
        } else {
            req.showOnePoll = showOnePoll;
           next();
        }
    });
   
}
//----------------------------------------------------------------------
/**
 * Checks that only people register in the Nursery that created the poll can vote.
 *
 */
function checkNursery(req,res){
    
     Poll.findById(req.params.id,function(err, showOnePoll){
         if(err){
             req.flash("error","Error fetching poll.");
             res.redirect("back");
         }else{
             if(req.user.label!=="manager"){
                if(showOnePoll.author.id.equals(req.user.nursery.id)){
                    oneVote(req,res,showOnePoll);
                }
              }else{
                if(showOnePoll.author.id.equals(req.user._id)){
                    oneVote(req,res,showOnePoll);
                }
       
            }
            
         }
     });
}
    
  



/**
 * This function makes sure a user can vote only only.
 *
 */
function oneVote(req,res,showOnePoll){

             if(showOnePoll.voters.length > 0){ //check the array of voter is not empty otherwise it would not iterate.
               for (var i = 0; i < showOnePoll.voters.length; i++){
                 
                        if(req.user){
                            if(req.user._id.equals(showOnePoll.voters[i].id)){
                                req.flash("error","You have already voted.");
                                 res.redirect("back");
                            }else{
                                saveVote(req,res);
                            }
                        }
                    }
             }else{
                saveVote(req,res);
        }

}

function saveVote(req,res){

        Poll.findById(req.params.id, function(err, showOnePoll){
            if(err){
                console.log("error beg: "+err);
                res.redirect("back");

            }
            else{
                 //loops through the optionsArray so when there's a match increase the value of the option and register user as a voter.
                 for (var i = 0; i < showOnePoll.optionsArray.length; i++){
                
                    //check the option submitted is equal to one option
                    if(showOnePoll.optionsArray[i]._id.equals(req.body.optionSubmitted)){
                        //increase value of option   
                        showOnePoll.optionsArray[i].value = showOnePoll.optionsArray[i].value+1; 
                            
                        //register vote with user credentials 
                        showOnePoll.voters.push({id:req.user._id,username:req.user.username});

                        showOnePoll.save(function(err,dataRet){
                            if(err){
                                req.flash("error","Something went wrong when saving the vote.");
                                res.redirect("back");
                                
                            }
                            else{
                                req.flash("success","Successfully voted.");
                                res.redirect("back");
        
                            }
                            
                        });
        
        
                    }else{
                        req.flash("error","You are not allowed to vote in this poll.");
                         res.redirect("back");

                    }
                        
                }
            }
        });

       
}
////////////////////////////////////////////////////////





module.exports = {
                  getUserPolls:getUserPolls,
                  createPollWithOptions:createPollWithOptions,
                  deletePoll:deletePoll,
                  showOnePoll:showOnePoll,
                  checkNursery:checkNursery,
                  saveVote:saveVote
                  
                  
                  
};