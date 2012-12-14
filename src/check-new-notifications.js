(function() {
  var askForNewTopicsAndDisplay, checkForNewNotifications, countNumberOfUnreadTopics, countUnreadTopicsAndDisplay, handleExpressSessionId, showNumberOfUnreadTopics, userIsLoggedIn, _expressSessionId;

  _expressSessionId = null;

  checkForNewNotifications = function() {
    if (userIsLoggedIn()) {
      askForNewTopicsAndDisplay();
      return console.log("check for new notifications");
    }
  };

  userIsLoggedIn = function() {
    return _expressSessionId !== null;
  };

  askForNewTopicsAndDisplay = function() {
    return $.ajax({
      url: "https://rizzoma.com/api/rest/1/wave/searchBlipContent/",
      data: {
        queryString: '',
        lastSearchDate: 0,
        ACCESS_TOKEN: _expressSessionId
      },
      dataType: 'json',
      success: function(data) {
        return countUnreadTopicsAndDisplay(data.data);
      }
    });
  };

  countUnreadTopicsAndDisplay = function(searchAnswer) {
    var numUnreadTopics;
    numUnreadTopics = countNumberOfUnreadTopics(searchAnswer);
    showNumberOfUnreadTopics(numUnreadTopics);
    console.log("search answer", searchAnswer);
    return console.log("num unread topics", numUnreadTopics);
  };

  countNumberOfUnreadTopics = function(searchAnswer) {
    var numUnreadTopics, searchResult, searchResults, _i, _len;
    searchResults = searchAnswer.searchResults;
    numUnreadTopics = 0;
    for (_i = 0, _len = searchResults.length; _i < _len; _i++) {
      searchResult = searchResults[_i];
      if (searchResult.totalUnreadBlipCount > 0 && searchResult.follow === true) {
        numUnreadTopics++;
      }
    }
    return numUnreadTopics;
  };

  showNumberOfUnreadTopics = function(numUnreadTopics) {
    updateNumberOfNotifications(numUnreadTopics);
    return console.log("num unread topics", numUnreadTopics);
  };

  handleExpressSessionId = function(expressSessionId) {
    return _expressSessionId = expressSessionId;
  };

  chrome.extension.onMessage.addListener(function(messageString, sender, sendResponse) {
    handleExpressSessionId(messageString);
    return checkForNewNotifications();
  });

  setInterval(checkForNewNotifications, 60000);

  updateNumberOfNotifications(24);

}).call(this);
