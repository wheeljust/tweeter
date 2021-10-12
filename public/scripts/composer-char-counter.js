// This is a more common syntax for writing the document.ready statement
// Note: good practice to only call event listeners inside the document.ready, and declare functions outside.

$(function() {

  $("#tweet-text").on("input", onTextInput);

});

const onTextInput = function() {

  let $len = $(this).val().length;
  const charRemaining = 140 - $len;

  const $counter = $(".counter");
  $counter.val(charRemaining);

  if (charRemaining < 0) {
    return $counter.addClass("invalid");
  }
  $counter.removeClass("invalid");

};