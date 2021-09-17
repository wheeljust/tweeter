/*
 * Client-side JS logic goes here
 * jQuery is already loaded
 * Reminder: Use (and do all your DOM work in) jQuery's document ready function
 */

$(document).ready(function() {
  
  /**
   * 
   * @param { string } str user entered text string
   * @returns safe text string by escaping unsafe chars - prevents XSS (cross-site scripting)
   */
  const escape = function (str) {
    let div = document.createElement("div");
    div.appendChild(document.createTextNode(str));
    return div.innerHTML;
  };

  /**
   * createTweetElement
   * @param { object } tweet
   * @returns { html element } < article >
   */
  const createTweetElement = function(tweet) {
    return $(`
    <article class="tweet">
      <header>
        <div class="user-head">
          <img src="${tweet.user.avatars}">
          <span>${tweet.user.name}</span>
        </div>
        <span class="handle">${tweet.user.handle}</span>
      </header>
      <p>${escape(tweet.content.text)}</p>
      <footer>
        <time>${timeago.format(tweet.created_at)}</time>
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
    $('#tweets-container').empty();
    
    for (const tweet of tweets) {
      const $newTweet = createTweetElement(tweet);
      $('#tweets-container').prepend($newTweet);
    }
  };

  /**
   * loadTweets
   * Perfoms an AJAX get request to /tweets and then calls renderTweets function
   */
  const loadTweets = function() {
    $.ajax({
      method: "GET",
      url: "/tweets",
      dataType: "json",
      success: (tweets) => {
        console.log(tweets); // remove later
        renderTweets(tweets);
      }
    });
  };

  /** Event listener for SUBMIT a form with id="new-tweet"
   * Filters and alerts submit events with no text, or events exceeding character limits
   * Completes an AJAX post request when tweetBody meets the criteria to post
   */
  $("#new-tweet").on("submit", function(event) {
    event.preventDefault();
    const $tweetBody = $(this).serialize();
    const $charCount = 140 - $(".counter").val();
    const error = $("#error-msg");
    error.slideUp();

    if (!$charCount) {
      error.text("Oops! You forgot to write your tweet, please enter some text first!");
      error.slideDown();
      return;
    };

    if ($charCount > 140) {
      error.text("Opps! Your tweet exceeds the character limit! Please make it less than 140 characters");
      error.slideDown();
      return;
    };
    
    $.post('/tweets', $tweetBody)
      .then(() => {
        loadTweets();
        this.reset();
      });
  });

  /**
   * Event listener for the compose-tweet button in the nav bar
   * Function toggles the new-tweet container (hide/show), and places the cursor (focus) in the tweet-text box
   */
  $("#compose-tweet").on("click", function() {
    $("#new-tweet-container").slideToggle("fast", function() {
      $("#tweet-text").focus();
    });
  });

  // Need to call this function to load all of the tweets whenever the page is refreshed
  loadTweets();

});

