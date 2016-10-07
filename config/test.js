
function sessionPassport(passport,schemaSession){  

   

  //USE SERIALIZE AND DESIRIALIZE USER from the user.js model which uses the "passport-local-mongoose"
    passport.serializeUser(schemaSession.serializeUser());//and then encode the data and put it back in the session
    passport.deserializeUser(schemaSession.deserializeUser());// reading session,taking the data from session that's encoded, unencode it 
//////////////////////////////
//------------------------------------
};

module.exports = sessionPassport;