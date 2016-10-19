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
            
             $('#teachersWaitingRegistration').append(
             $('<li>').attr('class','list-group-item').append(
            $('<span>').append(dataRet.email)).append(
            $('<span>').attr('class','pull-right').append(
            $('<a>').attr('class',' btn btn-xs btn-danger').attr('id',dataRet.email).attr('onClick',"removeFromStillToRegister(event,this.id,'"+dataRet.parentOrTeacher+"');").append($('<i>').attr('class',"fa fa-fw fa-trash-o").attr('aria-hidden',"true")))
            .append(" ").append(
            $('<a>').attr('class',' btn btn-xs btn-info').attr('id',dataRet.email).attr('onClick',"removeFromStillToRegister(event,this.id,'"+dataRet.parentOrTeacher+"');").append($('<i>').attr('class',"fa fa-fw fa-paper-plane-o").attr('aria-hidden',"true")))
            .append(" ").append(
            $('<a>').attr('class',' btn btn-xs btn-warning').attr('id',dataRet.email).attr('onClick',"removeFromStillToRegister(event,this.id,'"+dataRet.parentOrTeacher+"');").append($('<i>').attr('class',"fa  fa-fw fa-user-plus").attr('aria-hidden',"true") ))
            ));
        }
    
    }
});
    
});

function resendLink(event, id,parentOrTeacher){
    var resendurl = '/dashboard/manager/'+currentUserId+'/resendlink/'+id+'?parentOrTeacher='+parentOrTeacher;
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


function removeFromStillToRegister(event, id,parentOrTeacher){
    var resendurl = '/dashboard/manager/'+currentUserId+'/removeFromPending/'+id+'?_method=DELETE&parentOrTeacher='+parentOrTeacher;
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
 
$('.rowUser').on('click',function(){
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
     /*   $(this).removeData('bs.modal');
        $(this).find('.modal-body').html("");*/
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