(function() {
  var addScriptThatWillSaveAuthIdInDiv, sendAuthIdToExtension, weAreInNotificationsIFrame, writeAuthTokenIntoDiv;

  weAreInNotificationsIFrame = function() {
    return window.name === 'rizzomaNotificationsIFrame';
  };

  writeAuthTokenIntoDiv = function() {
    var expressSessionId;
    expressSessionId = '';
    if ((window.expressSession != null)) {
      expressSessionId = window.expressSession.id;
    } else {
      expressSessionId = "undefined";
    }
    return $('body').append("<div id='expressSessionId'>" + expressSessionId + "</div>");
  };

  addScriptThatWillSaveAuthIdInDiv = function() {
    var javascriptCode, script;
    $('#expressSessionId').remove();
    javascriptCode = '(' + writeAuthTokenIntoDiv + ')();';
    script = document.createElement('script');
    script.textContent = javascriptCode;
    (document.head || document.documentElement).appendChild(script);
    return script.parentNode.removeChild(script);
  };

  sendAuthIdToExtension = function() {
    var expressSessionId;
    expressSessionId = $('#expressSessionId').text();
    return chrome.extension.sendMessage(expressSessionId);
  };

  if (weAreInNotificationsIFrame()) {
    addScriptThatWillSaveAuthIdInDiv();
    sendAuthIdToExtension();
  }

}).call(this);
