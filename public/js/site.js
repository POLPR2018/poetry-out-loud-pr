$(document).ready(function(){
  $('[data-toggle="tooltip"]').tooltip();

  $(".navbar a, footer a[href='#myPage']").on('click', function(event) {
    if (this.hash !== "") {
      event.preventDefault();
      var hash = this.hash;
      $('html, body').animate({
        scrollTop: $(hash).offset().top
      }, 900, function(){
        window.location.hash = hash;
      });
    } // end if
  }); // end  scrollspy

  $(".alert").hide();
  // $(".alert").fadeTo(2000, 500).slideUp(500, function(){
  //   $(".alert").slideUp(500);
  // });

  $('button').click(function(){
    $('.alert').show()
  }) ;

  // Register Form
  $('#addressCheck').on('change', function(){
    if ( $(this).is(':checked') ) {
      $('.postalAddress-fields').hide();
    } else {
      $('.postalAddress-fields').show();
    }
  });

  $('#schoolType').change(function(){
    selection = $(this).val();
    switch(selection) {
      case 'public':
        $('.schoolInformation-fields').show();
      break;
      default:
        $('.schoolInformation-fields').hide();
      break;
    }
  });

  $("input[type=radio]").change(function() {
    if($(this).prop('value') == 'yes'){
      $(".participationYears-field").show();
    } else {
      $(".participationYears-field").hide();
    }
  });

  // todo save checkboxes
  $("input.todo-item").each(function() {
    var mycookie = $.cookie($(this).attr('name'));
    if (mycookie && mycookie === "true") {
      $(this).prop('checked', mycookie);
    }
  });

  $("input.todo-item").change(function() {
    $.cookie($(this).attr("name"), $(this).prop('checked'), {
      path: '/',
      expires: 365
    });
  });

  // Datepicker & Timepicker
  $('#competitionDate').datepicker();
  $('#competitionTime').timepicker();
}); // end document.ready
