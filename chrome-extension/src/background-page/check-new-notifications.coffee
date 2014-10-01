window.rizzomaNotifications = window.rizzomaNotifications || {}

_expressSessionId = null
_lastTimeOfGettingAuthId = null

checkForNewNotifications = ->
    if (expressSessionIdRetrievedFromRizzoma())
        askForNewMentionsAndDisplay()
        console.log("check for new notifications at #{new Date(Date.now())}")
    else 
      console.log("No express session id, reinserting iframe")
      reinsertRizzomaIFrame()

expressSessionIdRetrievedFromRizzoma = ->
    return _expressSessionId != null

askForNewMentionsAndDisplay = ->
    window.rizzomaNotifications.askForNewMentions(
        (data) ->
            handleUnreadMentions(data.data)
    )

window.rizzomaNotifications.askForNewMentions = (callback) ->
    $.ajax(
        {
            url: "https://rizzoma.com/api/rest/1/message/searchMessageContent/",
            data: {
                queryString: '',
                lastSearchDate: 0,
                ACCESS_TOKEN: _expressSessionId
            },
            dataType: 'json',
            success: callback
        }
    )

handleUnreadMentions = (searchAnswer) ->
    searchingWorked = searchAnswer.lastSearchDate? # if searching doesnt work, this property does not exist :)
    if (searchingWorked)
        countUnreadMentionsAndDisplay(searchAnswer)
    else if (timeSinceGettingAuthIdLongEnough())
        console.log ("searching didn't work mit #{_expressSessionId}, reinserting iframe")
        insertRizzomaIFrame() # inserting rizzoma iframe should get you new auth id
    else
        console.log ("searching didn't work mit #{_expressSessionId}, time not long enough to reinsert iframe")
        showNotLoggedInSymbol()
        

countUnreadMentionsAndDisplay = (searchAnswer) ->
    numUnreadMentions= countNumberOfUnreadMentions(searchAnswer)
    showNumberOfUnreadMentions(numUnreadMentions)

countNumberOfUnreadMentions = (searchAnswer) ->
    searchResults = searchAnswer.searchResults;
    numUnreadMentions = 0
    for searchResult in searchResults
        if not searchResult.isRead
            numUnreadMentions++;
    return numUnreadMentions

showNumberOfUnreadMentions = (numUnreadMentions) ->
    # this function is coming from draw-image.js
    updateNumberOfNotifications(numUnreadMentions)
    
timeSinceGettingAuthIdLongEnough = ->
    minutesToWait = 20
    minutesSinceGettingAuthId = (Date.now() - _lastTimeOfGettingAuthId) / (1000 * 60) # convert from ms to minutes
    return minutesSinceGettingAuthId > minutesToWait 

insertRizzomaIFrame = ->
    $('body').append('<iframe src="https://rizzoma.com/topic/" id="rizzomaNotificationsIFrame" name="rizzomaNotificationsIFrame"></iframe>')

reinsertRizzomaIFrame = ->
  removeRizzomaIFrame()
  insertRizzomaIFrame()

showNotLoggedInSymbol = ->
    chrome.browserAction.setIcon({
      path: '../../img/rizzoma-transparent-icon.png'
    })

handleExpressSessionId = (expressSessionIdMessage) ->
    _expressSessionId = expressSessionIdMessage["HAVE_EXPRESS_SESSION_ID: ".length..]
    _lastTimeOfGettingAuthId = Date.now()
    removeRizzomaIFrame()
    checkForNewNotifications()

removeRizzomaIFrame = ->
    $('#rizzomaNotificationsIFrame').remove()

listenForExpressId = (messageString, sender, sendResponse) ->
    if (messageString[0..."HAVE_EXPRESS_SESSION_ID: ".length] == "HAVE_EXPRESS_SESSION_ID: ")
        handleExpressSessionId(messageString)
    return true # has to be done for other messages to be handlable by other listeners

chrome.extension.onMessage.addListener(listenForExpressId)
insertRizzomaIFrame()
setInterval(checkForNewNotifications, 60000)
