/* eslint-disable no-undef */
/*
 * Client-side JS logic goes here
 * jQuery is already loaded
 * Reminder: Use (and do all your DOM work in) jQuery's document ready function
 */

// Fake data taken from initial-tweets.json
// const data = [
//   {
//     "user": {
//       "name": "Newton",
//       "avatars": "https://i.imgur.com/73hZDYK.png"
//       ,
//       "handle": "@SirIsaac"
//     },
//     "content": {
//       "text": "If I have seen further it is by standing on the shoulders of giants"
//     },
//     "created_at": 1461116232227
//   },
//   {
//     "user": {
//       "name": "Descartes",
//       "avatars": "https://i.imgur.com/nlhLi3I.png",
//       "handle": "@rd" },
//     "content": {
//       "text": "Je pense , donc je suis"
//     },
//     "created_at": 1461113959088
//   }
// ];


$(() => {
  const loadTweets = () => {
    $.ajax({
      url: '/tweets/',
      method: 'GET',
      dataType: 'json',
      success: (data) => {
        console.log('data', data);
        // re-render all tweets after successful POST
        renderTweets(data);
      },
      error: (err) => {
        console.log(`There was an error: ${err}`);
      }
    });
  };

  loadTweets();

  // query DB and display all tweets
  const renderTweets = function(userObj) {
    // loops through tweets
    // calls createTweetElement for each tweet
    // takes return value and appends it to the tweets container
    const $tweetContainer = $("#tweet-container");
    $tweetContainer.empty();

    // repopulate tweet-container
    for (const tweet of userObj) {
      // console.log('logging userObj:', userObj);
      const $tweet = createTweetElement(tweet);
      $tweetContainer.prepend($tweet);
    }
  };

  // new tweet HTML template and dynamic data insertion
  const createTweetElement = (userObj) => {
    let $tweet = $(`
    <div class="tweet-container">
      <article class="article-class">
        <header>
          <div class="avatar-pic">
            <img src=${userObj.user.avatars} alt="">
            <p>${userObj.user.name}</p>
          </div>
          <div class="name">
            <p>${userObj.user.handle}</p> 
          </div>
        </header>

        <div class="posted-tweet">
          <p>${(escape(userObj.content.text)).replace(/%20/g, " ").replace("%3F", "?").replace("%21", "!").replace(/%2C/g,",")}</p>
          <hr>
        </div>
    
        <footer>
          <div class="posted-on">
            <p>${timeago.format(userObj.created_at)}</p>
          </div>

          <div class="flag-retweet-like">
            <span class="icon flag">
              <i class="fas fa-flag"></i>
            </span>
            <span class="icon retweet">
              <i class="fas fa-retweet"></i>
            </span>
            <span class="icon like">
              <i class="fas fa-heart"></i>
            </span>
          </div>
        </footer>    
      </article>
    </div>
    `);
    
    return $tweet;
  };

  // const $tweet = createTweetElement(data);
  // const $tweet = $(`<article class="tweet">Hello world</article>`);

  // console.log($tweet);

  // $('#tweet-container').prepend($tweet);

  // tweet form POST submission route/endpoint
  const $form = $('#new-tweet-form');
  $form.on('submit', function(event) {
    event.preventDefault();

    const text = $('#tweet-text').val();
    
    // form validation
    if (!text) {
      $('.error-section').slideDown('slow');
      $('#error-message').text('Please enter text');
      return;
    }
    if (text.length > 140) {
      $('.error-section').slideDown('slow');
      $('#error-message').text('Max characters exceeded');
      return;
    }
    
    const serializedData = $(this).serialize();
    
    $.post('/tweets/', serializedData, (response) => {
      $('.error-section').slideUp('slow');
      $('#tweet-text').val('');
      $('.counter').val('140');
      console.log(response);
      loadTweets();
    });
  });


});