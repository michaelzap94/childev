var currentUserId = userIdFromEjs;// userId coming fom ejs
var basicPath = '/dashboard/parent/'+currentUserId;
var flashOpenning = '<div class="alert alert-'; 
var commonBody = ' alert-dismissable" role="alert"><button type="button" class="close" data-dismiss="alert" aria-hidden="true">&times;</button>';
var flashClosing= '</div>';
$('.rowUserChildren').on('click',function(){
    var objchildren = $(this).data('objchildren'); //obect passed using 'data' (HTML5 ATTRIBUTE)

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
   

   $('#seeProgress').attr('href',basicPath+'/children/'+objchildren._id+'/progress');
   $('#editChildInfo').attr('href',basicPath+'/children/'+objchildren._id+'/profile');
   $('#editMedicalInfo').attr('href',basicPath+'/children/'+objchildren._id+'/medical');
    
  
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
