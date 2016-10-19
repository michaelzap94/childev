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
            if(dataRet.childId){
                  $('#teachersWaitingRegistration').append(
                 $('<li>').attr('class','list-group-item').append(
                $('<span>').append(dataRet.email)).append(
                $('<span>').attr('class','pull-right').append(
                $('<a>').attr('class',' btn btn-xs btn-danger').attr('id',dataRet.email).attr('onClick',"removeFromStillToRegister(event,this.id,'"+dataRet.parentOrTeacher+"');").append($('<i>').attr('class',"fa fa-fw fa-trash-o").attr('aria-hidden',"true")))
                .append(" ").append(
                $('<a>').attr('class',' btn btn-xs btn-info').attr('id',dataRet.email).attr('onClick',"resendLink(event,this.id,'"+dataRet.parentOrTeacher+"','"+dataRet.childId+"');").append($('<i>').attr('class',"fa fa-fw fa-paper-plane-o").attr('aria-hidden',"true")))
                .append(" ").append(
                $('<a>').attr('class',' btn btn-xs btn-warning').attr('id',dataRet.email).attr('onClick',"removeFromStillToRegister(event,this.id,'"+dataRet.parentOrTeacher+"');").append($('<i>').attr('class',"fa  fa-fw fa-user-plus").attr('aria-hidden',"true") ))
                ));
                
            }else{
                 $('#teachersWaitingRegistration').append(
                 $('<li>').attr('class','list-group-item').append(
                $('<span>').append(dataRet.email)).append(
                $('<span>').attr('class','pull-right').append(
                $('<a>').attr('class',' btn btn-xs btn-danger').attr('id',dataRet.email).attr('onClick',"removeFromStillToRegister(event,this.id,'"+dataRet.parentOrTeacher+"');").append($('<i>').attr('class',"fa fa-fw fa-trash-o").attr('aria-hidden',"true")))
                .append(" ").append(
                $('<a>').attr('class',' btn btn-xs btn-info').attr('id',dataRet.email).attr('onClick',"resendLink(event,this.id,'"+dataRet.parentOrTeacher+"','');").append($('<i>').attr('class',"fa fa-fw fa-paper-plane-o").attr('aria-hidden',"true")))
                .append(" ").append(
                $('<a>').attr('class',' btn btn-xs btn-warning').attr('id',dataRet.email).attr('onClick',"removeFromStillToRegister(event,this.id,'"+dataRet.parentOrTeacher+"');").append($('<i>').attr('class',"fa  fa-fw fa-user-plus").attr('aria-hidden',"true") ))
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


function removeFromStillToRegister(event, id,parentOrTeacher,childId){
    var resendurl;
    if(childId){
        resendurl = '/dashboard/manager/'+currentUserId+'/removeFromPending/'+id+'?parentOrTeacher='+parentOrTeacher+'&childId='+childId;
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
//------------------------------------------------------------
$('[data-toggle="tooltip"]').tooltip();
//------------------------------------------------

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

  

});
/**
 * gets the useer's data from the clicked row.
 *
 */
 
$('.rowUserChildren').on('click',function(){
    var objchildren = $(this).data('objchildren'); //obect passed using 'data' (HTML5 ATTRIBUTE)

        
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
   

    $('#deleteUser').attr('value',objchildren._id);
    
   /* var fragment =$('#containerParent'); 

    if($(this).data('objparentarr')){
        $(this).data('objparentarr').forEach(function(child,index){
            
            var childrenInfo = $('<div>').attr('class', 'panel panel-info').append(
            $('<div>').attr('class','panel-heading').append($('<h4>').attr('class','panel-title').append($('<a>').attr('data-toogle','collapse').attr('data-parent','#containerChildren').attr('href','#coll'+index).append(child.details[0].firstname+' '+child.details[0].lastname)))).append(
            $('<div>').attr('id','coll'+index).attr('class','panel-collapse collapse in').append($('<div>').attr('class','panel-body').append(
                $('<ul>').append($('<li>').append($('<strong>').append('Firstname: ')).append(child.details[0].firstname))
                        .append($('<li>').append($('<strong>').append('Lastname: ')).append(child.details[0].lastname))
                        .append($('<li>').append($('<strong>').append('Gender: ')).append(child.details[0].gender))
                        .append($('<li>').append($('<strong>').append('Date Of Birth: ')).append(child.details[0].dob))
                    
            )));
            fragment.append(childrenInfo);
        });
          
    }  
            */
});

/**
 * parent info in the 'dashboardChildren' file
 *
 */

$('.rowUserParent').on('click',function(){
    var objParent = $(this).data('objparent'); //obect passed using 'data' (HTML5 ATTRIBUTE)

        
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
    
    var fragment =$('#containerChildren'); 

    if($(this).data('objchildrenarr')){
        $(this).data('objchildrenarr').forEach(function(child,index){
            
            var childrenInfo = $('<div>').attr('class', 'panel panel-info').append(
            $('<div>').attr('class','panel-heading').append($('<h4>').attr('class','panel-title').append($('<a>').attr('data-toogle','collapse').attr('data-parent','#containerChildren').attr('href','#coll'+index).append(child.details[0].firstname+' '+child.details[0].lastname)))).append(
            $('<div>').attr('id','coll'+index).attr('class','panel-collapse collapse in').append($('<div>').attr('class','panel-body').append(
                $('<ul>').append($('<li>').append($('<strong>').append('Firstname: ')).append(child.details[0].firstname))
                        .append($('<li>').append($('<strong>').append('Lastname: ')).append(child.details[0].lastname))
                        .append($('<li>').append($('<strong>').append('Gender: ')).append(child.details[0].gender))
                        .append($('<li>').append($('<strong>').append('Date Of Birth: ')).append(child.details[0].dob))
                    
            )));
            fragment.append(childrenInfo);
        });
          
    }  
            
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