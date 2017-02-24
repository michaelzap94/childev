//childAge is the variable coming from EJS.
var childAge = childAge;
var intDev02='At these age, the “Recognition and perception skills” are the most important skills a child must develop since it is extremely important that children can recognise their parents, teachers, animals, objects.';
var intDev23='At these age, the Language and Communication Skills are the most important skills a child must develop and although Recognition and perception skills are also important, they should have already been gained at early ages.';
var intDev34='At these age, Language and communication Skills are still the ones with the highest priority as it is really important that children learn to communicate well to express their feelings. However, the development of the attention skills is also a priority since the ability for a person to concentrate and focus, is crucial for having a great capacity for learning and absorbing information.';
var intDev56='At these age, the attention skills become the ones with the highest priority, since a better capacity to concentrate will lead to a better capacity for learning. Language and communication skills must still be being developed together with Mathematical Skills.';
var socDev02='At these age, the “Expression of feelings and emotions” is the most important skill a child must develop since it is extremely important that children learn to express their feelings, not just cry for everything. Also, it is important that they start gaining some independence and personal autonomy.';
var socDev23='At these age, it is highly important that children respect and feel affection towards other children, so they do not become bullies in the future and understand there are different races in the world. Also, it is important that they start gaining some independence and personal autonomy so they do not demand so much attention from teachers and can adapt to playing and working well with other children.';
var socDev34='At these age, it is highly important that they gain Independence and personal autonomy as they should start taking part of activities that involve playing with other children. It is still important that children respect and feel affection towards other children, so they do not become bullies in the future and understand there are different races in the world.';
var socDev56='At these age, they should have already gained enough independence to be able to work well with others and also to accept other children’s opinions. It is also important that they become truly independent as they should start primary school next year and they will not have all the attention they received whilst in nursery.';
var phyDev02='At these age, it is extremely important that they develop their motor skills so they can crawl and later walk properly. Also, it is important that they start being able to manipulate and coordinate their hands and feet movements.';
var phyDev23='At these age, it is very important that they start being able to manipulate and coordinate their hand\'s movements, so they can start making figures using dough and drawing and painting using crayons, colour pencils or paint brushes. Also, it is important that they keep developing their motor skills so they can walk, run, jump and dance without falling off all the time.';
var phyDev34='At these age, it is very important that children become aware of their personal hygiene, they must learn to go to the toilet by themselves and start cleaning themselves up. Also, it is important that they can manipulate pens and pencils well because at these ages they will start learning how to write, and also so they can wash their own hands and learn how to use toilet paper and wipes.';
var phyDev56='At these age, it is very important that children are already aware of their personal hygiene and that they can go to the toilet by themselves and clean themselves up because next year children will go to primary school and teachers will not be able to go to the toilet with them. Moreover, they should learn about a healthy diet, and that they should not always eat sweets and fast food and that they should eat fruits and vegetables instead.';
 
var hp="<span class='label label-primary'>HP</span>";
var lp="<span class='label label-warning'>LP</span>";

/**
* description
*
*/
$('#intellectualInfo').on('click',function(){
    var intInfo;
    $('#myModalLabel').html('"Intellectual Development" information for children aged: '+childAge);

    
    if(0<=childAge<2){
        intInfo = intDev02;
    }else if(2<=childAge<=3){
        intInfo = intDev23;
    }else if(3<childAge<=4){
        intInfo = intDev34;
    }else if(5<=childAge){
        intInfo = intDev56;
    }
 
    $('#myModalBody').html(intInfo);
});

/**
 * description
 *
 */
$('#socialInfo').on('click',function(){
    var socInfo;
    $('#myModalLabel').html('"Social and Emotional Development" information for children aged: '+childAge);
    
    if(0<=childAge<2){
        socInfo = socDev02;
    }else if(2<=childAge<=3){
        socInfo = socDev23;
    }else if(3<childAge<=4){
        socInfo = socDev34;
    }else if(5<=childAge){
        socInfo = socDev56;
    }
    
    $('#myModalBody').html(socInfo);
});

/**
 * description
 *
 */
$('#physicalInfo').on('click',function(){
    var phyInfo;
    $('#myModalLabel').html('"Psychomotor and Physical Development" information for children aged: '+childAge);
    
    if(0<=childAge<2){
        phyInfo = phyDev02;
    }else if(2<=childAge<=3){
        phyInfo = phyDev23;
    }else if(3<childAge<=4){
        phyInfo = phyDev34;
    }else if(5<=childAge){
        phyInfo = phyDev56;
    }
    
    $('#myModalBody').html(phyInfo);
});


/**LABEL**************************/
//----------INTELLECTUAL---------------------------/
    if(0<=childAge<2){
        $('#mathematical').find('.infoLabel').html(lp);
        $('#language').find('.infoLabel').html(hp);
        $('#attention').find('.infoLabel').html(lp);
        $('#recognition').find('.infoLabel').html(hp);
        
    }else if(2<=childAge<=3){
        $('#mathematical').find('.infoLabel').html(lp);
        $('#language').find('.infoLabel').html(hp);
        $('#attention').find('.infoLabel').html(lp);
        $('#recognition').find('.infoLabel').html(hp);        
    }else if(3<childAge<=4){
        $('#mathematical').find('.infoLabel').html(lp);
        $('#language').find('.infoLabel').html(hp);
        $('#attention').find('.infoLabel').html(hp);
        $('#recognition').find('.infoLabel').html(lp);        
    }else if(5<=childAge){
        $('#mathematical').find('.infoLabel').html(lp);
        $('#language').find('.infoLabel').html(hp);
        $('#attention').find('.infoLabel').html(hp);
        $('#recognition').find('.infoLabel').html(lp);        
    }

//-----------SOCIAL------------------------------------------/
    if(0<=childAge<2){
        $('#respect').find('.infoLabel').html(lp);
        $('#teamworking').find('.infoLabel').html(lp);
        $('#independence').find('.infoLabel').html(hp);
        $('#feelingsexpression').find('.infoLabel').html(hp);
        
    }else if(2<=childAge<=3){
        $('#respect').find('.infoLabel').html(hp);
        $('#teamworking').find('.infoLabel').html(lp);
        $('#independence').find('.infoLabel').html(hp);
        $('#feelingsexpression').find('.infoLabel').html(lp);
        
    }else if(3<childAge<=4){
        $('#respect').find('.infoLabel').html(hp);
        $('#teamworking').find('.infoLabel').html(lp);
        $('#independence').find('.infoLabel').html(hp);
        $('#feelingsexpression').find('.infoLabel').html(lp);
        
    }else if(5<=childAge){
        $('#respect').find('.infoLabel').html(lp);
        $('#teamworking').find('.infoLabel').html(hp);
        $('#independence').find('.infoLabel').html(hp);
        $('#feelingsexpression').find('.infoLabel').html(lp);
        
    }

//-------PHYSICAL---------------------------------------------------/
    if(0<=childAge<2){
        $('#motor').find('.infoLabel').html(hp);
        $('#manipulative').find('.infoLabel').html(hp);
        $('#hygiene').find('.infoLabel').html(lp);
        $('#diet').find('.infoLabel').html(lp);

    }else if(2<=childAge<=3){
        $('#motor').find('.infoLabel').html(hp);
        $('#manipulative').find('.infoLabel').html(hp);
        $('#hygiene').find('.infoLabel').html(lp);
        $('#diet').find('.infoLabel').html(lp);
        
    }else if(3<childAge<=4){
        $('#motor').find('.infoLabel').html(lp);
        $('#manipulative').find('.infoLabel').html(hp);
        $('#hygiene').find('.infoLabel').html(hp);
        $('#diet').find('.infoLabel').html(lp);
        
    }else if(5<=childAge){
        $('#motor').find('.infoLabel').html(lp);
        $('#manipulative').find('.infoLabel').html(lp);
        $('#hygiene').find('.infoLabel').html(hp);
        $('#diet').find('.infoLabel').html(hp);
        
    }

//-----------------------------------------------------------------/


/**
 * fades the window when modal is shown.
 *
 */
 $('body').on('show.bs.modal', '.modal', function () {
        $('#page-wrapper').css('opacity','0.4');
    });

 
$('body').on('hidden.bs.modal', '.modal', function () {
        $(this).find('#myModalLabel').html("");//delete children info being displayed
        $(this).find('#myModalBody').html("");//delete children info being displayed
        $('#page-wrapper').css('opacity','');
    });
    
//------------------------------------------------------------
$('[data-toggle="tooltip"]').tooltip();
//------------------------------------------------