weAreInNotificationsIFrame = ->
    return (window.name == 'rizzomaNotificationsIFrame')

writeAuthTokenIntoDiv = ->
    expressSessionId = ''
    if (window.expressSession?)
        expressSessionId = window.expressSession.id
    else
        expressSessionId = "undefined"
    $('body').append("<div id='expressSessionId' style='display: none'>#{expressSessionId}</div>") 
    

addScriptThatWillSaveAuthIdInDiv = ->
    $('#expressSessionId').remove()
    javascriptCode = '(' + writeAuthTokenIntoDiv + ')();'
    script = document.createElement('script');
    script.textContent = javascriptCode;
    (document.head||document.documentElement).appendChild(script);
    script.parentNode.removeChild(script);

sendAuthIdToExtension = ->
    expressSessionId = $('#expressSessionId').text()
    chrome.extension.sendMessage("HAVE_EXPRESS_SESSION_ID: #{expressSessionId}")

removeAuthIdDiv = ->
    $('#expressSessionId').remove()
    
if (weAreInNotificationsIFrame())
    addScriptThatWillSaveAuthIdInDiv()
    sendAuthIdToExtension()
    removeAuthIdDiv()