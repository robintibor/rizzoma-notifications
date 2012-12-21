window.rizzomaNotifications = window.rizzomaNotifications || {}

_expressSessionId = null

checkForNewNotifications = ->
    if (userIsLoggedIn())
        askForNewMentionsAndDisplay()
        console.log("check for new notifications")

userIsLoggedIn = ->
    return _expressSessionId != null

askForNewMentionsAndDisplay = ->
    window.rizzomaNotifications.askForNewMentions(
        (data) ->
                countUnreadMentionsAndDisplay(data.data)
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
    
handleExpressSessionId = (expressSessionIdMessage) ->
    _expressSessionId = expressSessionIdMessage["HAVE_EXPRESS_SESSION_ID: ".length..]


chrome.extension.onMessage.addListener((messageString, sender, sendResponse) ->
    if (messageString[0..."HAVE_EXPRESS_SESSION_ID: ".length] == "HAVE_EXPRESS_SESSION_ID: ")
        handleExpressSessionId(messageString)       
        checkForNewNotifications()
    return true # has to be done for other messages to be handlable by other listeners
)

setInterval(checkForNewNotifications, 60000)
