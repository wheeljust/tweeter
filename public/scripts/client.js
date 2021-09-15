/*
 * Client-side JS logic goes here
 * jQuery is already loaded
 * Reminder: Use (and do all your DOM work in) jQuery's document ready function
 */

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
// ]

$(document).ready(function() {
  
  /**
   * createTweetElement
   * @param { object } tweet 
   * @returns { html element } < article >
   */
  const createTweetElement = function(tweet) {
  return $(`
  <article class="tweet">
    <header>
      <div>
        <img src="${tweet.user.avatars}">
        <span>${tweet.user.name}</span>
      </div>
      <span class="handle">${tweet.user.handle}</span>
    </header>
    <p>${tweet.content.text}</p>
    <footer>
      <time>${tweet.created_at}</time>
      <div>
        <i class="fas fa-flag"></i>
        <i class="fas fa-retweet"></i>
        <i class="fas fa-heart"></i>
      </div>
    </footer>
  </article>
  `);
  };
  
  /**
   * renderTweets
   * @param { array } tweets 'is an array of tweet objects'
   * no return, used to call createTweetElement
   */
  const renderTweets = function(tweets) {
    for (const tweet of tweets) {
      const $newTweet = createTweetElement(tweet);
      $('#tweets-container').append($newTweet); 
    }
  }

  const loadTweets = function() {
    $.ajax({
      method: "GET",
      url: "/tweets",
      dataType: "json",
      success: (tweets) => {
        console.log(tweets); // remove later
        renderTweets(tweets);
      }
    })
  };

  loadTweets();

  /** Event listener for New Tweet Submit
   *  Completes an AJAX post request when triggered
   */
  const $form = $("#new-tweet");
  $form.on("submit", function(event) {
    event.preventDefault();
    const $tweetBody = $(this).serialize();
    
    $.post('/tweets', $tweetBody)
      .then((res) => {
        console.log('ajax post is working');  // do I need this .then()? also where is the $tweetBody data going
        // loadTweets();
      });

  });

  // renderTweets(data);

});

