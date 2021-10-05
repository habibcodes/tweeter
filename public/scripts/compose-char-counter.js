
$(document).ready(function() {
  characterLimit = 140;

  $('.counter').text(characterLimit);

  $('#tweet-text').bind('keyup keydown', function() {
    let count = $('.counter');
    let characters = $(this).val().length;

    if (characters > characterLimit) {
      count.addClass('over');
    } else {
      count.removeClass('over');
    }

    count.text(characterLimit - characters);
  });

});

