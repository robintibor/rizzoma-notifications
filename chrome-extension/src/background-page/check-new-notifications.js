(function() {
  var askForNewMentionsAndDisplay, checkForNewNotifications, countNumberOfUnreadMentions, countUnreadMentionsAndDisplay, handleExpressSessionId, handleUnreadMentions, insertRizzomaIFrame, listenForExpressId, removeRizzomaIFrame, showNotLoggedInSymbol, showNumberOfUnreadMentions, timeSinceGettingAuthIdLongEnough, userIsLoggedIn, _expressSessionId, _lastTimeOfGettingAuthId;

  window.rizzomaNotifications = window.rizzomaNotifications || {};

  _expressSessionId = null;

  _lastTimeOfGettingAuthId = null;

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
      return handleUnreadMentions(data.data);
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

  handleUnreadMentions = function(searchAnswer) {
    var searchingWorked;
    searchingWorked = searchAnswer.lastSearchDate != null;
    if (searchingWorked) {
      return countUnreadMentionsAndDisplay(searchAnswer);
    } else if (timeSinceGettingAuthIdLongEnough()) {
      console.log("searching didn't work mit " + _expressSessionId + ", reinserting iframe");
      return insertRizzomaIFrame();
    } else {
      console.log("searching didn't work mit " + _expressSessionId + ", time not long enough to reinsert iframe");
      return showNotLoggedInSymbol();
    }
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

  timeSinceGettingAuthIdLongEnough = function() {
    var minutesSinceGettingAuthId, minutesToWait;
    minutesToWait = 20;
    minutesSinceGettingAuthId = (Date.now() - _lastTimeOfGettingAuthId) / (1000 * 60);
    return minutesSinceGettingAuthId > minutesToWait;
  };

  insertRizzomaIFrame = function() {
    return $('body').append('<iframe src="https://rizzoma.com/topic/" id="rizzomaNotificationsIFrame"></iframe>');
  };

  showNotLoggedInSymbol = function() {
    return chrome.browserAction.setIcon({
      path: '../../img/rizzoma-transparent-icon.png'
    });
  };

  handleExpressSessionId = function(expressSessionIdMessage) {
    _expressSessionId = expressSessionIdMessage.slice("HAVE_EXPRESS_SESSION_ID: ".length);
    _lastTimeOfGettingAuthId = Date.now();
    removeRizzomaIFrame();
    return checkForNewNotifications();
  };

  removeRizzomaIFrame = function() {
    return $('#rizzomaNotificationsIFrame').remove();
  };

  listenForExpressId = function(messageString, sender, sendResponse) {
    if (messageString.slice(0, "HAVE_EXPRESS_SESSION_ID: ".length) === "HAVE_EXPRESS_SESSION_ID: ") {
      handleExpressSessionId(messageString);
    }
    return true;
  };

  chrome.extension.onMessage.addListener(listenForExpressId);

  insertRizzomaIFrame();

  setInterval(checkForNewNotifications, 60000);

}).call(this);
