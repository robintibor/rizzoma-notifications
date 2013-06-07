(function() {
  var askForNewMentionsAndDisplay, checkForNewNotifications, countNumberOfUnreadMentions, countUnreadMentionsAndDisplay, handleExpressSessionId, removeRizzomaIFrame, showNumberOfUnreadMentions, userIsLoggedIn, _expressSessionId;

  window.rizzomaNotifications = window.rizzomaNotifications || {};

  _expressSessionId = null;

  checkForNewNotifications = function() {
    if (userIsLoggedIn()) {
      askForNewMentionsAndDisplay();
      return console.log("check for new notifications at " + (new Date(Date.now())));
    }
  };

  userIsLoggedIn = function() {
    return _expressSessionId !== null;
  };

  askForNewMentionsAndDisplay = function() {
    return window.rizzomaNotifications.askForNewMentions(function(data) {
      return countUnreadMentionsAndDisplay(data.data);
    });
  };

  window.rizzomaNotifications.askForNewMentions = function(callback) {
    return $.ajax({
      url: "https://rizzoma.com/api/rest/1/message/searchMessageContent/",
      data: {
        queryString: '',
        lastSearchDate: 0,
        ACCESS_TOKEN: _expressSessionId
      },
      dataType: 'json',
      success: callback
    });
  };

  countUnreadMentionsAndDisplay = function(searchAnswer) {
    var numUnreadMentions;
    numUnreadMentions = countNumberOfUnreadMentions(searchAnswer);
    return showNumberOfUnreadMentions(numUnreadMentions);
  };

  countNumberOfUnreadMentions = function(searchAnswer) {
    var numUnreadMentions, searchResult, searchResults, _i, _len;
    searchResults = searchAnswer.searchResults;
    numUnreadMentions = 0;
    for (_i = 0, _len = searchResults.length; _i < _len; _i++) {
      searchResult = searchResults[_i];
      if (!searchResult.isRead) {
        numUnreadMentions++;
      }
    }
    return numUnreadMentions;
  };

  showNumberOfUnreadMentions = function(numUnreadMentions) {
    return updateNumberOfNotifications(numUnreadMentions);
  };

  handleExpressSessionId = function(expressSessionIdMessage) {
    return _expressSessionId = expressSessionIdMessage.slice("HAVE_EXPRESS_SESSION_ID: ".length);
  };

  chrome.extension.onMessage.addListener(function(messageString, sender, sendResponse) {
    if (messageString.slice(0, "HAVE_EXPRESS_SESSION_ID: ".length) === "HAVE_EXPRESS_SESSION_ID: ") {
      handleExpressSessionId(messageString);
      removeRizzomaIFrame();
      checkForNewNotifications();
    }
    return true;
  });

  removeRizzomaIFrame = function() {
    return $('#rizzomaNotificationsIFrame').remove();
  };

  setInterval(checkForNewNotifications, 60000);

}).call(this);
