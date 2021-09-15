/*
 * Client-side JS logic goes here
 * jQuery is already loaded
 * Reminder: Use (and do all your DOM work in) jQuery's document ready function
 */

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

  loadTweets();

  /** Event listener for SUBMIT a form with id="new-tweet"
   * Filters and alerts submit events with no text, or events exceeding character limits
   * Completes an AJAX post request when tweetBody meets the criteria to post
   */
  $("#new-tweet").on("submit", function(event) {
    event.preventDefault();
    const $tweetBody = $(this).serialize();
    const $charCount = 140 - $(".counter").val();

    if (!$charCount) return alert("Opps! Please enter some text for your tweet before posting");
    if ($charCount > 140) return alert("Opps! Your tweet exceeds the character limit!");
    
    $.post('/tweets', $tweetBody)
      .then(() => {
        console.log('ajax post is working');
        this.reset();
      });
  });
});

