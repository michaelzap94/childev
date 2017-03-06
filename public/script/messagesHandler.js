var currentUserId = userIdFromEjs;// userId coming fom ejs
var currentUserLabel = userLabelFromEjs;//User label coming from ejs
$('#accordion').on('show.bs.collapse', function (e) {
    var targetId = e.target.id;
    var s = document.getElementById(targetId);
    var messageid = s.dataset.messageid
    var url = '/dashboard/'+currentUserLabel+'/'+currentUserId+'/messages/'+messageid+'/read';
    var mydata = {read:true};
    if(messageid){
         $.ajax({
            url:url,
            method:'POST',
            data:mydata,
            success:function(dataRet){
                if(dataRet.success){
                    s.dataset.messageid = '';
                    s.parentElement.className = "panel panel-info";
                }
            
            }
        });
    }
   

})