//required initial packages
var express = require("express");
var app = express();
var bodyParser = require("body-parser");
var mongoose = require("mongoose");
var flash = require("connect-flash");
var passport = require('passport');
var expressSession = require("express-session");
var cookieParser = require('cookie-parser');
var LocalStrategy = require('passport-local');
var Nursery = require('./app/schemas/admin/nursery.js');
var Teacher = require('./app/schemas/teacher/teacherSchema.js');
var Parent = require('./app/schemas/parent/parentSchema.js');
var methodOverride = require("method-override");


//var myConfiguration = require('./config/configuration.js');
var passport = require('passport');

//DB
var dburl = process.env.DATABASEURL;
mongoose.connect(dburl);
//process.env.DATABASEURL || "mongodb://localhost/childevDB"


// configuration 

    //app.use(cookieParser()); 
    app.use(bodyParser.urlencoded({extended:true}));
    app.set("view engine", "ejs");
    app.use(express.static(__dirname + "/public"));
    app.use(methodOverride("_method"));
    app.use(flash()); 
    
    
//WE NEED THIS LINES FOR SESSIONS
  app.use(expressSession({
        secret:"I am a full stack developer",
        resave:false,
        saveUninitialized:false
    }));
    app.use(passport.initialize());
    app.use(passport.session());
    
    
    
passport.use("nursery",new LocalStrategy(Nursery.authenticate()));
passport.use("teacher",new LocalStrategy(Teacher.authenticate()));
passport.use("parent",new LocalStrategy(Parent.authenticate()));

    passport.serializeUser(function(user, done){
     done(null, user.id);
});

passport.deserializeUser(function(id, done){
   Nursery.findById(id, function(err, user){
     if(err) done(err);
       if(user){
         done(null, user);
       } else {
          Teacher.findById(id, function(err, user){
          if(err) done(err);
            if(user){
                done(null, user);
                
            }else{
                Parent.findById(id,function(err,user){
                    if(err) done(err);
                    done(null,user);
                });
            }
       });
   }
});
});

//------------------------


/** 
 * This is a middleware where req.user is included in Passport package and indicates current user, if none then null.
 * @function
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
app.use(function(req,res,next){
    res.locals.currentUser = req.user;// req.locals will pass currentUser to every ejs as variable.(in this case header.ejs)
    next(); // we need next() to move to the next middleware.
    
});


/** 
 * This is a middleware where res.locals.error can be used in any EJS document to specify 'error' and res.locals.success to specify 'success'
 * @function
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */

app.use(function(req,res,next){
    res.locals.error = req.flash("error");// req.locals will pass currentUser to every ejs as variable.(in this case header.ejs)
       res.locals.success = req.flash("success");// req.locals will pass currentUser to every ejs as variable.(in this case header.ejs)

    next(); // we need next() to move to the next middleware.
    
});


// routes used in Childev
var launcher = require("./app/routes/launcher.js");
var registerRouter = require("./app/routes/registerRouter.js");
var loginRouter = require("./app/routes/loginRouter.js");
var resetPassword = require("./app/routes/resetPassword.js");


var dashboardManagerRouter = require("./app/routes/manager/dashboardManagerRouter.js");
var dashboardTeacherRouter = require("./app/routes/teacher/dashboardTeacherRouter.js");
var dashboardParentRouter = require("./app/routes/parent/dashboardParentRouter.js");


var emailVerificationRouter = require("./app/routes/emailVerification.js");

var authorization = require("./app/middlewares/authorization.js");

app.use('/register',registerRouter);
app.use('/login',loginRouter);

app.use('/dashboard/manager/:currentUserId',authorization.isManager,dashboardManagerRouter);
app.use('/dashboard/teacher/:currentUserId',authorization.isTeacher,dashboardTeacherRouter);
app.use('/dashboard/parent/:currentUserId',authorization.isParent,dashboardParentRouter);


app.use('/',emailVerificationRouter);
app.use('/',resetPassword);


app.use('/',launcher);


 

app.listen(process.env.PORT, process.env.IP, function(){
   console.log("The Childev Server Has Started!");
});