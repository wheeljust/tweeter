$(document).ready(function() {

  $("#tweet-text").on("keyup", function() {
    const charRemaining = 140 - $(this).val().length;
    $(".counter").val(charRemaining);
    (charRemaining < 0) ? $(".counter").addClass("invalid") : $(".counter").removeClass("invalid");
  });

});