var currentUserId = userIdFromEjs;// userId coming fom ejs

var flashOpenning = '<div class="alert alert-'; 
var commonBody = ' alert-dismissable" role="alert"><button type="button" class="close" data-dismiss="alert" aria-hidden="true">&times;</button>';
var flashClosing= '</div>';
$('.rowUserChildren').on('click',function(){
    var objchildren = $(this).data('objchildren'); //obect passed using 'data' (HTML5 ATTRIBUTE)
    var objparentarr = $(this).data('objparentarr');
    console.log(objparentarr);
        
    var name = objchildren.details[0].firstname+' '+objchildren.details[0].lastname;
    
    
    /**children Info**/
    $('#myModalLabel').html(name);
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
            
            var sendMessageLink = '/dashboard/teacher/'+currentUserId+'/messages/new?userIdTo='+parent._id+'&labelTo=parent';

            var childrenInfo = $('<div>').attr('class', 'panel panel-info').append(
            $('<div>').attr('class','panel-heading').append($('<span>').attr('class','panel-title').append($('<a>').attr('data-toggle','collapse').attr('data-parent','#containerParent').attr('href','#col'+index).append(parent.details[0].firstname+' '+parent.details[0].lastname))).append(
           $('<a>').attr('class','btn btn-primary btn-xs pull-right').attr('href',sendMessageLink).attr('data-toggle','tooltip').attr('title','Send a message to this parent').append($('<i>').attr('class','fa fa-fw fa-paper-plane-o')))).append(
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
    //$('[data-toggle="collapse"]').collapse();
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
