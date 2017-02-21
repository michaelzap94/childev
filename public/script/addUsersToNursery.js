var currentUserId = userIdFromEjs;// userId coming fom ejs

var flashOpenning = '<div class="alert alert-'; 
var commonBody = ' alert-dismissable" role="alert"><button type="button" class="close" data-dismiss="alert" aria-hidden="true">&times;</button>';
var flashClosing= '</div>';
var linkDeleteOpenning = "/dashboard/manager/"+currentUserId;
var linkDeleteClosing = "?_method=DELETE"

$('#emailToRegisterForm').on('submit',function(e){
    e.preventDefault();
    var emailToRegister= $('#emailToRegister').val();
    var formData= $(this).serialize();
    var url = '/dashboard/manager/'+currentUserId+'/sendlink';
     
    
    $.ajax({
    url:url,
    method:'POST',
    data:formData,
    success:function(dataRet){
        
        if(dataRet.error){
            
            $('#flashContainer').html(flashOpenning+"danger"+commonBody+dataRet.error+flashClosing);
        }else{
            $('#flashContainer').html(flashOpenning+"success"+commonBody+dataRet.success+flashClosing);
            if(dataRet.isRegistered){
                console.log(dataRet);
                $('#waitingLinkingParents').append(
                $('<li>').attr('class','list-group-item').append(
                $('<div>').attr('class','row').append(
                $('<div>').attr('class','col-lg-10 col-md-10 col-sm-10 col-xs-9').append(
                $('<strong>').attr('class','list-group-item-heading').append(dataRet.email)).append(
                $('<p>').attr('class','list-group-item-text').append('To Child: '+dataRet.name))).append(
                $('<div>').attr('class','col-lg-2 col-md-2 col-sm-2 col-xs-1').append(
                $('<span>').attr('class','pull-right').append(
                $('<a>').attr('class',' btn btn-xs btn-danger').attr('id',dataRet.email).attr('onClick',"removeFromStillToRegister(event,this.id,'"+dataRet.parentOrTeacher+"','"+dataRet.childId+"','isRegistered');").append($('<i>').attr('class',"fa fa-fw fa-trash-o").attr('aria-hidden',"true")))
                .append(" ").append(
                $('<a>').attr('class',' btn btn-xs btn-info').attr('id',dataRet.email).attr('onClick',"resendLink(event,this.id,'"+dataRet.parentOrTeacher+"','"+dataRet.childId+"');").append($('<i>').attr('class',"fa fa-fw fa-paper-plane-o").attr('aria-hidden',"true")))
                ))));
                
            }else{
                $('#teachersWaitingRegistration').append(
                $('<li>').attr('class','list-group-item').append(
                $('<span>').append(dataRet.email)).append(
                $('<span>').attr('class','pull-right').append(
                $('<a>').attr('class',' btn btn-xs btn-danger').attr('id',dataRet.email).attr('onClick',"removeFromStillToRegister(event,this.id,'"+dataRet.parentOrTeacher+"');").append($('<i>').attr('class',"fa fa-fw fa-trash-o").attr('aria-hidden',"true")))
                .append(" ").append(
                $('<a>').attr('class',' btn btn-xs btn-info').attr('id',dataRet.email).attr('onClick',"resendLink(event,this.id,'"+dataRet.parentOrTeacher+"','');").append($('<i>').attr('class',"fa fa-fw fa-paper-plane-o").attr('aria-hidden',"true")))
                ));
                
            }
        }
    
    }
});
    
});

function resendLink(event, id,parentOrTeacher,childId){
    var resendurl;
    if(childId){
        resendurl = '/dashboard/manager/'+currentUserId+'/resendlink/'+id+'?parentOrTeacher='+parentOrTeacher+'&childId='+childId;
    }else{
        resendurl = '/dashboard/manager/'+currentUserId+'/resendlink/'+id+'?parentOrTeacher='+parentOrTeacher;

    }
    console.log(resendurl);
    event.preventDefault();
   
    $.ajax({
        type: "GET",
        url: resendurl,
        success: function (dataRet){
            if(dataRet.error){
                $('#flashContainer').html(flashOpenning+"danger"+commonBody+dataRet.error+flashClosing);
            }else{
                $('#flashContainer').html(flashOpenning+"success"+commonBody+dataRet.success+flashClosing);
            }
        },
        error: function (xhr, ajaxOptions, thrownError){
            $('#flashContainer').html(flashOpenning+"danger"+commonBody+'Something out of our hands happened when sending the email.'+flashClosing);
        }
    });
}

//id is the username.
function removeFromStillToRegister(event, id,parentOrTeacher,childId,isRegistered){
    console.log(childId);
    var resendurl;
    if(childId){
        if(isRegistered){
             resendurl = '/dashboard/manager/'+currentUserId+'/removeFromPending/'+id+'?parentOrTeacher='+parentOrTeacher+'&childId='+childId+'&isRegistered='+true;
        }else{
            resendurl = '/dashboard/manager/'+currentUserId+'/removeFromPending/'+id+'?parentOrTeacher='+parentOrTeacher+'&childId='+childId;
        
        }
    }else{
        resendurl = '/dashboard/manager/'+currentUserId+'/removeFromPending/'+id+'?parentOrTeacher='+parentOrTeacher;

    }
    
    event.preventDefault();
    $.ajax({
        type: "GET",
        url: resendurl,
        success: function (dataRet){
            if(dataRet.error){
                $('#flashContainer').html(flashOpenning+"danger"+commonBody+dataRet.error+flashClosing);
            }else{
                $('#flashContainer').html(flashOpenning+"success"+commonBody+dataRet.success+flashClosing);
                $(event.target).closest('li').remove();
            }
        },
        error: function (xhr, ajaxOptions, thrownError){
            $('#flashContainer').html(flashOpenning+"danger"+commonBody+'Something out of our hands happened when sending the email.'+flashClosing);
        }
    });
}

/**
 * gets the useer's data from the clicked row.
 *
 */
 
$('.rowUserTeacher').on('click',function(){
    var objTeacher = $(this).data('objteacher'); //obect passed using 'data' (HTML5 ATTRIBUTE)

        
       var name = $('<h3>').append(objTeacher.details[0].firstname+' '+objTeacher.details[0].lastname);
    
 
    $('#justName').html(name);
    $('#firstnameLIst').find('.info').html(objTeacher.details[0].firstname);
    $('#lastnameLIst').find('.info').html(objTeacher.details[0].lastname);
    $('#contactnumberLIst').find('.info').html(objTeacher.details[0].contactnumber);
    $('#usernameLIst').find('.info').html(objTeacher.username);
    $('#deleteUser').attr('value',objTeacher._id);
    
    var sendMessageTeacherLink = '/dashboard/manager/'+currentUserId+'/messages/new?userIdTo='+objTeacher._id+'&labelTo=teacher';
    $('#sendMessageTeacher').attr('href', sendMessageTeacherLink);

  

});
/**
 * gets the useer's data from the clicked row. dashboadChildren
 *
 */
 
$('.rowUserChildren').on('click',function(){
    var objchildren = $(this).data('objchildren'); //obect passed using 'data' (HTML5 ATTRIBUTE)
    var objparentarr = $(this).data('objparentarr');
    console.log(objparentarr);
        
    var name = objchildren.details[0].firstname+' '+objchildren.details[0].lastname;
    
    /**children Info**/
    $('#justName').html(name);
    $('#chfirstnameLIst').find('.info').html(objchildren.details[0].firstname);
    $('#chlastnameLIst').find('.info').html(objchildren.details[0].lastname);
    $('#chgenderLIst').find('.info').html(objchildren.details[0].gender);
    $('#chdobLIst').find('.info').html(objchildren.details[0].dob);
    $('#chaddressLIst').find('.info').html(objchildren.details[0].address.address1+', '+objchildren.details[0].address.address2);
    $('#chcityLIst').find('.info').html(objchildren.details[0].address.city);
    $('#chcountryLIst').find('.info').html(objchildren.details[0].address.country);
    $('#chpostcodeLIst').find('.info').html(objchildren.details[0].address.postcode);

    /**main carer Info**/
    $('#firstnameLIst').find('.info').html(objchildren.details[0].maincarerfirstname);
    $('#lastnameLIst').find('.info').html(objchildren.details[0].maincarerlastname);
    $('#contactnumberLIst').find('.info').html(objchildren.details[0].maincarercontactnumber);
    $('#usernameLIst').find('.info').html(objchildren.details[0].maincareremail);
    $('#relationship').find('.info').html(objchildren.details[0].maincarertype);
    
      /**Medical Information**/
    $('#illnesses').find('.info').html(objchildren.medicalInfo[0].illnesses);
    $('#allergies').find('.info').html(objchildren.medicalInfo[0].allergies);
    $('#medications').find('.info').html(objchildren.medicalInfo[0].medications);
    $('#foodNotAllowed').find('.info').html(objchildren.medicalInfo[0].dob);
    $('#disabilities').find('.info').html(objchildren.medicalInfo[0].disabilities);
    $('#specialSupport').find('.info').html(objchildren.medicalInfo[0].specialSupport);
    $('#doctorName').find('.info').html(objchildren.medicalInfo[0].doctorName);
    $('#doctorContactnumber').find('.info').html(objchildren.medicalInfo[0].doctorContactnumber);
    $('#doctorAddress').find('.info').html(objchildren.medicalInfo[0].doctorAddress);
   

    $('#deleteUser').attr('value',objchildren._id);
    
            var fragment =$('#containerParent'); 

    if(objparentarr.length>0){
        objparentarr.forEach(function(parent,index){
            var sendMessageParentLink = '/dashboard/manager/'+currentUserId+'/messages/new?userIdTo='+parent._id+'&labelTo=parent';
            var unlinkPath = '/dashboard/manager/'+ currentUserId + '/unlink?parentId='+parent._id+'&childId='+objchildren._id;

            var childrenInfo = $('<div>').attr('class', 'panel panel-info').append(
            $('<div>').attr('class','panel-heading').append($('<span>').attr('class','panel-title').append($('<a>').attr('data-toggle','collapse').attr('data-parent','#containerParent').attr('href','#col'+index).append(parent.details[0].firstname+' '+parent.details[0].lastname))).append(
           $('<a>').attr('class','btn btn-danger btn-xs pull-right').attr('style','margin-left:5px;').attr('href',unlinkPath).attr('data-toggle','tooltip').attr('title','Unlink parent from child.').append($('<i>').attr('class','fa fa-fw fa-chain-broken'))).append(
           $('<a>').attr('class','btn btn-primary btn-xs pull-right').attr('href',sendMessageParentLink).attr('data-toggle','tooltip').attr('title','Send message to this parent.').append($('<i>').attr('class','fa fa-fw fa-paper-plane-o')))).append(
            $('<div>').attr('id','col'+index).attr('class','panel-collapse collapse').append($('<div>').attr('class','panel-body').append(
                $('<ul>').append($('<li>').append($('<strong>').append('Firstname: ')).append(parent.details[0].firstname))
                        .append($('<li>').append($('<strong>').append('Lastname: ')).append(parent.details[0].lastname))
                        .append($('<li>').append($('<strong>').append('Contact Number: ')).append(parent.details[0].contactnumber))
                        .append($('<li>').append($('<strong>').append('Email: ')).append(parent.username))
                        .append($('<li>').append($('<strong>').append('Relationship to child: ')).append(parent.carertype))
            )));
            fragment.html(childrenInfo);
        });
          
    }else{
        $('#containerParent').empty();
    }  
     $('[data-toggle="tooltip"]').tooltip();         
});

/**
 * parent info in the 'dashboardParent' file
 *
 */

$('.rowUserParent').on('click',function(){
    var objParent = $(this).data('objparent'); //obect passed using 'data' (HTML5 ATTRIBUTE)
    var objchildrenarr = $(this).data('objchildrenarr');
   var name = objParent.details[0].firstname+' '+objParent.details[0].lastname;
    
 
    $('#justName').html(name);
    $('#firstnameLIst').find('.info').html(objParent.details[0].firstname);
    $('#lastnameLIst').find('.info').html(objParent.details[0].lastname);
    $('#contactnumberLIst').find('.info').html(objParent.details[0].contactnumber);
    $('#usernameLIst').find('.info').html(objParent.username);
    $('#relationship').find('.info').html(objParent.carertype);
    $('#addressLIst').find('.info').html(objParent.details[0].address.address1+', '+objParent.details[0].address.address2);
    $('#cityLIst').find('.info').html(objParent.details[0].address.city);
    $('#countryLIst').find('.info').html(objParent.details[0].address.country);
    $('#postcodeLIst').find('.info').html(objParent.details[0].address.postcode);

    $('#deleteUser').attr('value',objParent._id);
    
    var sendMessageParentLink = '/dashboard/manager/'+currentUserId+'/messages/new?userIdTo='+objParent._id+'&labelTo=parent';
    $('#sendMessageParent').attr('href', sendMessageParentLink);
    
    var fragment =$('#containerChildren'); 

    if(objchildrenarr.length>0){
       objchildrenarr.forEach(function(child,index){
            
             var unlinkPath = '/dashboard/manager/'+ currentUserId + '/unlink?parentId='+objParent._id+'&childId='+child._id;

            var childrenInfo = $('<div>').attr('class', 'panel panel-info').append(
            $('<div>').attr('class','panel-heading').append($('<span>').attr('class','panel-title ').append($('<a>').attr('data-toggle','collapse').attr('data-parent','#containerChildren').attr('href','#col'+index).append(child.details[0].firstname+' '+child.details[0].lastname))).append(
            $('<a>').attr('class','btn btn-danger btn-xs pull-right').attr('href',unlinkPath).attr('data-toggle','tooltip').attr('title','Unlink parent from child.').append($('<i>').attr('class','fa fa-chain-broken')))).append(
            $('<div>').attr('id','col'+index).attr('class','panel-collapse collapse').append($('<div>').attr('class','panel-body').append(
                $('<ul>').append($('<li>').append($('<strong>').append('Firstname: ')).append(child.details[0].firstname))
                        .append($('<li>').append($('<strong>').append('Lastname: ')).append(child.details[0].lastname))
                        .append($('<li>').append($('<strong>').append('Gender: ')).append(child.details[0].gender))
                        .append($('<li>').append($('<strong>').append('Date Of Birth: ')).append(child.details[0].dob))
                    
            )));
            fragment.html(childrenInfo);
        });
          
    }else{
        $('#containerParent').empty();
    }    
     $('[data-toggle="tooltip"]').tooltip();       
});
         
/**
 * Search users by name
 *
 */    

function mySearchFunction() {
    var input, filter, bodyTable, row, a, i;
    input = document.getElementById("searchUser");
    filter = input.value.toLowerCase();
    bodyTable = document.getElementById("bodyTableUsers");
    row = bodyTable.getElementsByTagName("tr");
    for (i = 0; i < row.length; i++) {
        a = row[i].getElementsByTagName("td")[0];
        if (a.innerHTML.toLowerCase().indexOf(filter) > -1) {
            row[i].style.display = "";
        } else {
            row[i].style.display = "none";

        }
    }
}


/**
 * fades the window when modal is shown.
 *
 */
 $('body').on('show.bs.modal', '.modal', function () {
        $('#page-wrapper').css('opacity','0.4');
    });

 
$('body').on('hidden.bs.modal', '.modal', function () {
     /*   $(this).removeData('bs.modal');*/
        $(this).find('#containerChildren').html("");//delete children info being displayed
        $('#page-wrapper').css('opacity','');
    });
    
$('#deleteUser').on('click',function() {
    var idToDelete=$(this).val();
    $('#deleteUserPermanently').attr('value', idToDelete);
});    

$('#deleteUserPermanently').on('click',function() {
    var idToDelete=$(this).val();
    var label = $(this).data('label');
    
    var url;
    if(label==='teacher'){
        url = '/dashboard/manager/'+currentUserId+'/deleteUser/'+label+'/'+idToDelete;
    }else if(label==='parent'){
        url = '/dashboard/manager/'+currentUserId+'/deleteUser/'+label+'/'+idToDelete;
    }else if(label==='children'){
         url = '/dashboard/manager/'+currentUserId+'/deleteUser/'+label+'/'+idToDelete;
    }
    $.ajax({
        type:'GET',
        url: url,
         success: function (dataRet){
            if(dataRet.error){
                $('#flashContainer').html(flashOpenning+"danger"+commonBody+dataRet.error+flashClosing);
            }else{
                $('#flashContainer').html(flashOpenning+"success"+commonBody+dataRet.success+flashClosing);
                $('#'+idToDelete).remove();
                $('#myConfirmation').modal('hide');
                $('#myModal').modal('hide');
            }
        },
        error: function (xhr, ajaxOptions, thrownError){
            $('#flashContainer').html(flashOpenning+"danger"+commonBody+'Something out of our hands happened when trying to delete user'+flashClosing);
        }
        
        
        
    });
    
    
    
});
//------------------------------------------------------------
$('[data-toggle="tooltip"]').tooltip();
$( document ).tooltip();
//------------------------------------------------
