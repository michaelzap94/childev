//childAge is the variable coming from EJS.
var childAge = childAge;
var intDev02='At these age, the “Recognition and perception skills” are the most important skills a child must develop since it is extremely important that children can recognise their parents, teachers, animals, objects.';
var intDev23='At these age, the Language and Communication Skills are the most important skills a child must develop and although Recognition and perception skills are also important, they should have already been gained at early ages.';
var intDev34='At these age, Language and communication Skills are still the ones with the highest priority as it is really important that children learn to communicate well to express their feelings. However, the development of the Attention skills is also a priority since the ability for a person to concentrate and focus, is crucial for having a great capacity for learning and absorbing information.';
var intDev56='At these age, the Attention skills become the ones with the highest priority, since a better capacity to concentrate will lead to a better capacity for learning. Language and communication skills must still be being developed together with Mathematical Skills.';
var socDev02='At these age, the “Expression of feelings and emotions” is the most important skill a child must develop since it is extremely important that children learn to express their feelings, not just cry for everything. Also, it is important that they start gaining some Independence and personal autonomy.';
var socDev23='At these age, it is highly important that children Respect and feel affection towards other children, so they do not become bullies in the future and understand there are different races in the world. Also, it is important that they start gaining some Independence and personal autonomy so they do not demand so much Attention from teachers and can adapt to playing and working well with other children.';
var socDev34='At these age, it is highly important that they gain Independence and personal autonomy as they should start taking part of activities that involve playing with other children. It is still important that children Respect and feel affection towards other children, so they do not become bullies in the future and understand there are different races in the world.';
var socDev56='At these age, they should have already gained enough Independence to be able to work well with others and also to accept other children’s opinions. It is also important that they become truly independent as they should start primary school next year and they will not have all the Attention they received whilst in nursery.';
var phyDev02='At these age, it is extremely important that they develop their Motor skills so they can crawl and later walk properly. Also, it is important that they start being able to manipulate and coordinate their hands and feet movements.';
var phyDev23='At these age, it is very important that they start being able to manipulate and coordinate their hand\'s movements, so they can start making figures using dough and drawing and painting using crayons, colour pencils or paint brushes. Also, it is important that they keep developing their Motor skills so they can walk, run, jump and dance without falling off all the time.';
var phyDev34='At these age, it is very important that children become aware of their personal Hygiene, they must learn to go to the toilet by themselves and start cleaning themselves up. Also, it is important that they can manipulate pens and pencils well because at these ages they will start learning how to write, and also so they can wash their own hands and learn how to use toilet paper and wipes.';
var phyDev56='At these age, it is very important that children are already aware of their personal Hygiene and that they can go to the toilet by themselves and clean themselves up because next year children will go to primary school and teachers will not be able to go to the toilet with them. Moreover, they should learn about a healthy Diet, and that they should not always eat sweets and fast food and that they should eat fruits and vegetables instead.';
 
var hp="<span class='label label-primary'>HP</span>";
var lp="<span class='label label-warning'>LP</span>";
var notifyParent = false;

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
    $('#myModalLabel').html('"PsychoMotor and Physical Development" information for children aged: '+childAge);
    
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
//----------INTELLECTUAL-----/
    if(0<=childAge<2){
        $('#Mathematical').find('.infoLabel').html(lp);
        $('#Language').find('.infoLabel').html(hp);
        $('#Attention').find('.infoLabel').html(lp);
        $('#Recognition').find('.infoLabel').html(hp);
        
    }else if(2<=childAge<=3){
        $('#Mathematical').find('.infoLabel').html(lp);
        $('#Language').find('.infoLabel').html(hp);
        $('#Attention').find('.infoLabel').html(lp);
        $('#Recognition').find('.infoLabel').html(hp);        
    }else if(3<childAge<=4){
        $('#Mathematical').find('.infoLabel').html(lp);
        $('#Language').find('.infoLabel').html(hp);
        $('#Attention').find('.infoLabel').html(hp);
        $('#Recognition').find('.infoLabel').html(lp);        
    }else if(5<=childAge){
        $('#Mathematical').find('.infoLabel').html(lp);
        $('#Language').find('.infoLabel').html(hp);
        $('#Attention').find('.infoLabel').html(hp);
        $('#Recognition').find('.infoLabel').html(lp);        
    }

//-----------SOCIAL----/
    if(0<=childAge<2){
        $('#Respect').find('.infoLabel').html(lp);
        $('#Team-working').find('.infoLabel').html(lp);
        $('#Independence').find('.infoLabel').html(hp);
        $('#Emotional-expression').find('.infoLabel').html(hp);
        
    }else if(2<=childAge<=3){
        $('#Respect').find('.infoLabel').html(hp);
        $('#Team-working').find('.infoLabel').html(lp);
        $('#Independence').find('.infoLabel').html(hp);
        $('#Emotional-expression').find('.infoLabel').html(lp);
        
    }else if(3<childAge<=4){
        $('#Respect').find('.infoLabel').html(hp);
        $('#Team-working').find('.infoLabel').html(lp);
        $('#Independence').find('.infoLabel').html(hp);
        $('#Emotional-expression').find('.infoLabel').html(lp);
        
    }else if(5<=childAge){
        $('#Respect').find('.infoLabel').html(lp);
        $('#Team-working').find('.infoLabel').html(hp);
        $('#Independence').find('.infoLabel').html(hp);
        $('#Emotional-expression').find('.infoLabel').html(lp);
        
    }

//-------PHYSICAL------/
    if(0<=childAge<2){
        $('#Motor').find('.infoLabel').html(hp);
        $('#Manipulative').find('.infoLabel').html(hp);
        $('#Hygiene').find('.infoLabel').html(lp);
        $('#Diet').find('.infoLabel').html(lp);

    }else if(2<=childAge<=3){
        $('#Motor').find('.infoLabel').html(hp);
        $('#Manipulative').find('.infoLabel').html(hp);
        $('#Hygiene').find('.infoLabel').html(lp);
        $('#Diet').find('.infoLabel').html(lp);
        
    }else if(3<childAge<=4){
        $('#Motor').find('.infoLabel').html(lp);
        $('#Manipulative').find('.infoLabel').html(hp);
        $('#Hygiene').find('.infoLabel').html(hp);
        $('#Diet').find('.infoLabel').html(lp);
        
    }else if(5<=childAge){
        $('#Motor').find('.infoLabel').html(lp);
        $('#Manipulative').find('.infoLabel').html(lp);
        $('#Hygiene').find('.infoLabel').html(hp);
        $('#Diet').find('.infoLabel').html(hp);
        
    }

//----------/



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
    
//--------------
$('[data-toggle="tooltip"]').tooltip();
//------------

