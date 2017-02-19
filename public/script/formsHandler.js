  $('#registerNursaryForm').validate({
      ignore: ".ignore",
        rules: {
            firstname: {
                minlength: 3,
                maxlength: 15,
                required: true
            },lastname: {
                minlength: 3,
                maxlength: 15,
                required: true
            },
            name: {
                minlength: 3,
                maxlength: 30,
                required: true
            },urn: {
                minlength: 3,
                maxlength: 20,
                required: true
            },managercontactnumber: {
                minlength: 3,
                maxlength: 15,
                required: true
            },nurserycontactnumber: {
                minlength: 3,
                maxlength: 15,
                required: true
            },address1: {
                minlength: 3,
                maxlength: 30,
                required: true
            },address2: {
                minlength: 3,
                maxlength: 30,
                required: false
            },city: {
                minlength: 3,
                maxlength: 20,
                required: true
            },country: {
                minlength: 3,
                maxlength: 20,
                required: true
            },postcode: {
                minlength: 3,
                maxlength: 10,
                required: true
            },termscond: {
                required: true
            },"hiddenRecaptcha": {
                 required: function(element) {
                     if(grecaptcha.getResponse() == '') {

                         return true;
                         
                     } else {

                         return false;
                     }
                 }
            }, username: {
                required: true,
                email: true
            },
            password: {
                minlength: 4,
                maxlength: 18,
                required: true,

            },
    password_again: {
      equalTo: "#password"
    }
        },messages:{
            termscond:'Please, Accept the Terms and Conditions before continuing.'
        },
        highlight: function(element) {
            $(element).closest('.input-group').addClass('has-error');
        },
        unhighlight: function(element) {
            $(element).closest('.input-group').removeClass('has-error');
        },
        errorElement: 'span',
        errorClass: 'help-block',
        errorPlacement: function(error, element) {
            if(element.parent('.input-group').length) {
                if(element[0].name==='termscond'){
                    error.insertAfter($('.termscondlabel'));
                }else{
                    error.insertAfter(element.parent());
                }
            } else {
                if(element[0].name==='termscond'){
                    error.insertAfter($('.termscondlabel'));
                }else{
                    error.insertAfter(element);
                }
            }
        }


    });
//---------------------------------------------------  
   $('#teacherRegisterForm').validate({
      ignore: ".ignore",
        rules: {
            firstname: {
                minlength: 3,
                maxlength: 15,
                required: true
            },lastname: {
                minlength: 3,
                maxlength: 15,
                required: true
            },contactnumber: {
                minlength: 3,
                maxlength: 15,
                required: true
            },
            password: {
                minlength: 4,
                maxlength: 18,
                required: true,

            },
    password_again: {
      equalTo: "#password"
    }
        },
        highlight: function(element) {
            $(element).closest('.input-group').addClass('has-error');
        },
        unhighlight: function(element) {
            $(element).closest('.input-group').removeClass('has-error');
        },
        errorElement: 'span',
        errorClass: 'help-block',
        errorPlacement: function(error, element) {
            if(element.parent('.input-group').length) {
                    error.insertAfter(element.parent());
            } else {
                    error.insertAfter(element);
            }
        }


    });
//---------------------------------------------------  
 $('#parentRegisterForm').validate({
      ignore: ".ignore",
        rules: {
            firstname: {
                minlength: 3,
                maxlength: 15,
                required: true
            },lastname: {
                minlength: 3,
                maxlength: 15,
                required: true
            },contactnumber: {
                minlength: 3,
                maxlength: 15,
                required: true
            },address1: {
                minlength: 3,
                maxlength: 30,
                required: true
            },address2: {
                minlength: 3,
                maxlength: 30,
                required: false
            },city: {
                minlength: 3,
                maxlength: 20,
                required: true
            },country: {
                minlength: 3,
                maxlength: 20,
                required: true
            },postcode: {
                minlength: 3,
                maxlength: 10,
                required: true
            },
            password: {
                minlength: 4,
                maxlength: 18,
                required: true,

            },
    password_again: {
      equalTo: "#password"
    }
        },
        highlight: function(element) {
            $(element).closest('.input-group').addClass('has-error');
        },
        unhighlight: function(element) {
            $(element).closest('.input-group').removeClass('has-error');
        },
        errorElement: 'span',
        errorClass: 'help-block',
        errorPlacement: function(error, element) {
            if(element.parent('.input-group').length) {
                    error.insertAfter(element.parent());
            } else {
                    error.insertAfter(element);
            }
        }


    });
//---------------------------------------------------  
 $('#childrenRegisterForm').validate({
      ignore: ".ignore",
        rules: {
            firstname: {
                minlength: 3,
                maxlength: 15,
                required: true
            },lastname: {
                minlength: 3,
                maxlength: 15,
                required: true
            },p1contactnumber: {
                minlength: 3,
                maxlength: 20,
                number:true,
                required: true
            },address1: {
                minlength: 3,
                maxlength: 30,
                required: true
            },address2: {
                minlength: 3,
                maxlength: 30,
                required: false
            },city: {
                minlength: 3,
                maxlength: 20,
                required: true
            },country: {
                minlength: 3,
                maxlength: 20,
                required: true
            },postcode: {
                minlength: 3,
                maxlength: 10,
                required: true
            },p1username:{
                required: true,
                email: true
            }
        },
        highlight: function(element) {
            $(element).closest('.input-group').addClass('has-error');
        },
        unhighlight: function(element) {
            $(element).closest('.input-group').removeClass('has-error');
        },
        errorElement: 'span',
        errorClass: 'help-block',
        errorPlacement: function(error, element) {
            if(element.parent('.input-group').length) {
                    error.insertAfter(element.parent());
            } else {
                    error.insertAfter(element);
            }
        }


    });
    
//---------------------------------------------------------------------

 $('#passwordChangeForm').validate({
        rules: {
           password: {
                minlength: 4,
                maxlength: 18,
                required: true,

            },
            password_again: {
              equalTo: "#password"
            }
        
        },
        highlight: function(element) {
            $(element).closest('.input-group').addClass('has-error');
        },
        unhighlight: function(element) {
            $(element).closest('.input-group').removeClass('has-error');
        },
        errorElement: 'span',
        errorClass: 'help-block',
        errorPlacement: function(error, element) {
            if(element.parent('.input-group').length) {
                    error.insertAfter(element.parent());
            } else {
                    error.insertAfter(element);
            }
        }


    });

//-------------------------------------------------------------------
  function resetThisForm(event,btnId) {
        event.preventDefault(); //  IMPORTANT. THIS IS HOW YOU GET THE EVENT OF A CLICK.
        var form;
        var validator;
        if (btnId==='resetRegisterNursaryForm') {
          form =  $("#"+btnId).parents().find('#registerNursaryForm');
          validator = $( "#registerNursaryForm" ).validate();
        }
        else if(btnId==='resetPasswordChangeForm'){
          form =  $("#"+btnId).parents().find('#passwordChangeForm');
          validator = $( "#resetPasswordChangeForm" ).validate();
        }
        else if (btnId === 'resetTeacherRegisterForm') {
          form =  $("#"+btnId).parents().find('#teacherRegisterForm');
          validator = $( "#teacherRegisterForm" ).validate();

        }
        else if (btnId==='resetParentRegisterForm') {
          form =  $("#"+btnId).parents().find('#parentRegisterForm');
          validator = $( "#parentRegisterForm" ).validate();

        }else if(btnId==='resetChildrenRegisterForm'){
          form =  $("#"+btnId).parents().find('#childrenRegisterForm');
          validator = $( "#childrenRegisterForm" ).validate();

        }
        form[0].reset();

        for (var i = 0, elements = validator.elements(); elements[i]; i++) {
            validator.settings.unhighlight.call(validator, elements[i], validator.settings.errorClass, validator.settings.validClass);
        }
        validator.resetForm();
    };
//---------------------------------

 $( function() {
        Date.format = 'dd/mm/yyyy';
        $( "#datepicker" ).datepicker({
          dateFormat: 'dd/mm/yy',
          changeMonth: true,
          changeYear: true,
           yearRange: "-6:+0"
        });
      } );