weAreInNotificationsIFrame = ->
    return (window.name == 'rizzomaNotificationsIFrame')

writeAuthTokenIntoDiv = ->
    expressSessionId = ''
    if (window.expressSession?)
        expressSessionId = window.expressSession.id
    else
        expressSessionId = "undefined"
    $('body').append("<div id='expressSessionId'>#{expressSessionId}</div>") 
    

addScriptThatWillSaveAuthIdInDiv = ->
    javascriptCode = '(' + writeAuthTokenIntoDiv + ')();'#"console.log('hihi', window.expressSession.id);"
    script = document.createElement('script');
    script.textContent = javascriptCode;
    (document.head||document.documentElement).appendChild(script);
    script.parentNode.removeChild(script);

sendAuthIdToExtension = ->
    expressSessionId = $('#expressSessionId').text()
    chrome.extension.sendMessage(expressSessionId)

if (weAreInNotificationsIFrame())
    addScriptThatWillSaveAuthIdInDiv()
    sendAuthIdToExtension()