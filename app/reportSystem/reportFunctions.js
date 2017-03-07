var Children = require("../schemas/children/childrenSchema.js");
var Report = require("../schemas/progressReports/reportSchema.js");

function calculateValuesIntellectual(intellectual,childAge){
    var realValuePrioritiesApplied;
    
    var mathematical = intellectual.mathematical;
    var language = intellectual.language;
    var attention = intellectual.attention;
    var recognition = intellectual.recognition;

    if(0<=childAge<2){
      realValuePrioritiesApplied= (recognition * 4) + (language * 3) + (attention *2) + (mathematical *1);
    }else if(2<=childAge<=3){
      realValuePrioritiesApplied= (language * 4) + (recognition * 3) + (attention *2) + (mathematical *1);
    }else if(3<childAge<=4){
      realValuePrioritiesApplied= (language * 4) + (attention * 3) + (mathematical *2) + (recognition *1);
    }else if(5<=childAge){
      realValuePrioritiesApplied= (attention * 4) + (language * 3) + (mathematical *2) + (recognition *1);
    }
    
    return realValuePrioritiesApplied;
}


function calculateValuesSocial(social,childAge){
    var realValuePrioritiesApplied;

    var respect = social.respect;
    var teamworking = social.teamworking;
    var independence = social.independence;
    var feelingsexpression = social.feelingsexpression;


    if(0<=childAge<2){
      realValuePrioritiesApplied= (feelingsexpression * 4) + (independence * 3) + (respect *2) + (teamworking *1);
    }else if(2<=childAge<=3){
      realValuePrioritiesApplied= (respect * 4) + (independence * 3) + (feelingsexpression *2) + (teamworking *1);
    }else if(3<childAge<=4){
      realValuePrioritiesApplied= (independence * 4) + (respect * 3) + (teamworking *2) + (feelingsexpression *1);
    }else if(5<=childAge){
      realValuePrioritiesApplied= (teamworking * 4) + (independence * 3) + (respect *2) + (feelingsexpression *1);
    }
    
    
    return realValuePrioritiesApplied;
}

function calculateValuesPhysical(physical,childAge){
    var realValuePrioritiesApplied;
    
    var motor = physical.motor;
    var manipulative = physical.manipulative;
    var hygiene = physical.hygiene;
    var diet = physical.diet;

    if(0<=childAge<2){
      realValuePrioritiesApplied= (motor * 4) + (manipulative * 3) + (hygiene *2) + (diet *1);
    }else if(2<=childAge<=3){
      realValuePrioritiesApplied= (manipulative * 4) + (motor * 3) + (hygiene *2) + (diet *1);
    }else if(3<childAge<=4){
      realValuePrioritiesApplied= (hygiene * 4) + (manipulative * 3) + (motor *2) + (diet *1);
    }else if(5<=childAge){
      realValuePrioritiesApplied= (hygiene * 4) + (diet * 3) + (manipulative *2) + (motor *1);
    }
    
    return realValuePrioritiesApplied;
}

function createReport(req,res){
    var childAge = req.body.childAge;
    var teacherName = req.user.details[0].firstname +' '+ req.user.details[0].lastname;
    
    var intellectual = req.body.intellectual;
    var social = req.body.social;
    var physical = req.body.physical;
    var realValueIntellectual = calculateValuesIntellectual(intellectual,childAge);
    var realValueSocial = calculateValuesSocial(social,childAge);
    var realValuePhysical = calculateValuesPhysical(physical,childAge);
    
    var avgValue = (realValueIntellectual + realValueSocial +realValuePhysical)/3;
    avgValue = Math.round(avgValue);
    
    var reportObject = new Report();//Report object, you need to save it for it to be added to the DB
    
    reportObject.childAge = childAge;
    reportObject.nursery.id = req.user.nursery.id;
    reportObject.children.id = req.params.childId;
    reportObject.avgValue = avgValue;
    reportObject.comments = req.body.comments;
    
    
    reportObject.teacher = { 
        id:req.user._id,
        name: teacherName,
        label:'teacher',
        username:req.user.username
            
    };

    
    reportObject.intellectual.push({
        skills : intellectual,
        realValue: realValueIntellectual
        
    }); 
    
    reportObject.social.push({
        skills : social,
        realValue : realValueSocial
    });
    
    reportObject.physical.push({
        skills: physical,
        realValue: realValuePhysical
    }); 


        reportObject.save(function(err,reportCreated){
            if(err){
                req.flash('error','Error creating Report');
                res.redirect('/');
                console.log(err);
            }else{
                req.flash('success','Success creating Report.');
                res.redirect('/dashboard/teacher/'+req.user._id+'/children');  
                
                
            }
        }); 
}

module.exports = {
    createReport:createReport
}