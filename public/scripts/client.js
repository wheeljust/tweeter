/*
 * Client-side JS logic
 * jQuery is already loaded
 */

$(document).ready(function() {

  /**
   *
   * @param { string } str user entered text string
   * @returns safe text string by escaping unsafe chars - prevents XSS (cross-site scripting)
   */
   const escape = function(str) {
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
        <div class="icons">
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
    $('.tweets-container').empty();
    
    for (const tweet of tweets) {
      const $newTweet = createTweetElement(tweet);
      $('.tweets-container').prepend($newTweet);
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
        renderTweets(tweets);
      }
    });
  };

  /** Event listener for SUBMIT a form with id="new-tweet"
   * Filters and alerts submit events with no text, or events exceeding character limits
   * Completes an AJAX post request when tweetBody meets the input criteria for a valid post
   */
  $("#new-tweet").on("submit", function(event) {
    event.preventDefault();
    const $tweetBody = $(this).serialize();
    const $charCount = 140 - $(".counter").val();
    const error = $(".error-msg");
    error.slideUp();

    if (!$charCount) {
      error.text("Oops! You forgot to write your tweet, please enter some text first!");
      error.slideDown();
      return;
    }

    if ($charCount > 140) {
      error.text("Opps! Your tweet exceeds the character limit! Please make it less than 140 characters");
      error.slideDown();
      return;
    }
    
    $.post('/tweets', $tweetBody)
      .then(() => {
        loadTweets();
        this.reset();
      });
  });


  const $toTopBtn = $("#back-to-top");
  const $composeBtn = $("#compose-tweet");
  /**
   * Event listener for the compose-tweet button in the nav bar
   * Function toggles the new-tweet container (hide/show), and places the cursor (focus) in the tweet-text box
   */
  $composeBtn.on("click", function() {
    $(".new-tweet-container").slideToggle("fast", function() {
      $("#tweet-text").focus();
    });
  });

  /**
   * Event listener for scrolling that will display the "#back-to-top" button
   * Removes the CSS class "hidden" which has a property of display: none;
   * When the scroll bar is positioned at top of windown, add back hidden class
   */
  $(window).on("scroll", function() {
    $toTopBtn.removeClass("hidden");
    $composeBtn.addClass("hidden");

    let scrollPos = $(window).scrollTop();
    if (!scrollPos) {
      $toTopBtn.addClass("hidden");
      $composeBtn.removeClass("hidden");
    }
  });

  /**
   * Event listener for clicking the "#back-to-top" button
   * On click, the window will scroll to top of page and focus on the new tweet text input box
   */
  $toTopBtn.on("click", function() {
    window.scrollTo( { top: 0 } );
    $(".new-tweet-container").show();
    $("#tweet-text").focus();
  });

  // Need to call this function to load all of the tweets whenever the page is refreshed
  loadTweets();

});

