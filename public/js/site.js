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

  // $(".alert").hide();
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

  // poem registrations checkboxes
  $("input.form-check-input").each(function() {
    var mycookie = $.cookie($(this).attr('name'));
    if (mycookie && mycookie === "true") {
      $(this).prop('checked', mycookie);
    }
  });

  $("input.form-check-input").change(function() {
    $.cookie($(this).attr("name"), $(this).prop('checked'), {
      path: '/',
      expires: 365
    });
  });

  // Datepicker & Timepicker
  $('#competitionDate').datepicker();
  $('#competitionTime').timepicker();
}); // end document.ready

// form lockdown
localStorage.getItem('competitionformlockdown') || '0';
localStorage.getItem('competitionResultsformlockdown') || '0';
localStorage.getItem('poemRegistrationsformlockdown') || '0';

var competitionformlockdown = document.getElementsByClassName('competitionformlockdown')[0];
var competitionResultsformlockdown = document.getElementsByClassName('competitionResultsformlockdown')[0];
var poemRegistrationsformlockdown = document.getElementsByClassName('poemRegistrationsformlockdown')[0];

if (!!competitionformlockdown) {
  competitionformlockdown.addEventListener('submit', function(e) {
    localStorage.setItem('competitionformlockdown', '1');
    return false;
  });
};

if (!!competitionResultsformlockdown) {
  competitionResultsformlockdown.addEventListener('submit', function(e) {
    localStorage.setItem('competitionResultsformlockdown', '1');
    return false;
  });
};

if (!!poemRegistrationsformlockdown) {
  poemRegistrationsformlockdown.addEventListener('submit', function(e) {
    localStorage.setItem('poemRegistrationsformlockdown', '1');
    return false;
  });
};

if(localStorage.getItem('competitionformlockdown') == '1') {
  $(".competitionformlockdown input").prop('disabled', true);
  $(".competitionformlockdown input[type=submit]").prop('disabled', true);
}

if(localStorage.getItem('competitionResultsformlockdown') == '1') {
  $(".competitionResultsformlockdown input").prop('disabled', true);
  $(".competitionResultsformlockdown select").prop('disabled', true);
  $(".competitionResultsformlockdown textarea").prop('disabled', true);
  $(".competitionResultsformlockdown input[type=submit]").prop('disabled', true);
}

if(localStorage.getItem('poemRegistrationsformlockdown') == '1') {
  $(".poemRegistrationsformlockdown input").prop('disabled', true);
  $(".poemRegistrationsformlockdown input[type=submit]").prop('disabled', true);
}
