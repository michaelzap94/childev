var passport = require('passport');
var LocalStrategy = require('passport-local');

function sessionPassport(strategyName,schemaSession){  

   
     // pass passport for configuration
//create a NEW Local Strategy using the data from User(user.js) which uses the "passport-local-mongoose"
    passport.use(strategyName,new LocalStrategy(schemaSession.authenticate()));

  //USE SERIALIZE AND DESIRIALIZE USER from the user.js model which uses the "passport-local-mongoose"
    passport.serializeUser(schemaSession.serializeUser());//and then encode the data and put it back in the session
    passport.deserializeUser(schemaSession.deserializeUser());// reading session,taking the data from session that's encoded, unencode it 
//////////////////////////////
//------------------------------------
};

module.exports = sessionPassport;