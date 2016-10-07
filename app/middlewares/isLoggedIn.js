 //CHECK IF USER IS LOGGED IN, if so go to dashboard, otherwise next()
   var isLoggedInDashboard= function(req, res, next){
        if(req.isAuthenticated()){ //comes with "passport package"
        
           res.redirect("/dashboard"); 
    
        }
        else{
             //req.flash('error','Please, Log in First');
             next(); //continue to callback
        }
    }
    //////////////
    //CHECK IF USER IS LOGGED IN, if so go to the next function, otherwise redirect.
    var isLoggedInNext = function(req, res, next){
        if(req.isAuthenticated()){ 
            next(); //continue to callback
          }
        else{
            req.flash('error','Please, Log in First');
            res.redirect("/"); 

        }
    }
    //////////////
    
module.exports = {
    isLoggedInNext:isLoggedInNext,
    isLoggedInDashboard:isLoggedInDashboard
}