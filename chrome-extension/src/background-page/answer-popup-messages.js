(function() {
  var getNewestMentionsAndSendback;

  window.rizzomaNotifications = window.rizzomaNotifications || {};

  getNewestMentionsAndSendback = function(sendResponse) {
    return window.rizzomaNotifications.askForNewMentions(function(mentions) {
      return sendResponse(mentions.data.searchResults);
    });
  };

  chrome.extension.onMessage.addListener(function(messageString, sender, sendResponse) {
    if (messageString === "GET_NEWEST_MENTIONS") {
      return getNewestMentionsAndSendback(sendResponse);
    }
  });

}).call(this);
