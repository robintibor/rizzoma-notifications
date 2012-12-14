_expressSessionId = null

checkForNewNotifications = ->
    if (userIsLoggedIn())
        askForNewTopicsAndDisplay()
        console.log("check for new notifications")

userIsLoggedIn = ->
    return _expressSessionId != null

askForNewTopicsAndDisplay = ->
    $.ajax(
        {
            url: "https://rizzoma.com/api/rest/1/wave/searchBlipContent/",
            data: {
                queryString: '',
                lastSearchDate: 0,
                ACCESS_TOKEN: _expressSessionId
            },
            dataType: 'json',
            success: (data) ->
                countUnreadTopicsAndDisplay(data.data)
        }
    )

countUnreadTopicsAndDisplay = (searchAnswer) ->
    numUnreadTopics = countNumberOfUnreadTopics(searchAnswer)
    showNumberOfUnreadTopics(numUnreadTopics)

countNumberOfUnreadTopics = (searchAnswer) ->
    searchResults = searchAnswer.searchResults;
    numUnreadTopics = 0
    for searchResult in searchResults
        if searchResult.totalUnreadBlipCount > 0 and searchResult.follow == true
            numUnreadTopics++;
    return numUnreadTopics

showNumberOfUnreadTopics = (numUnreadTopics) ->
    updateNumberOfNotifications(numUnreadTopics)
    
handleExpressSessionId = (expressSessionId) ->
    _expressSessionId = expressSessionId


chrome.extension.onMessage.addListener((messageString, sender, sendResponse) ->
    handleExpressSessionId(messageString)
    checkForNewNotifications()
)
setInterval(checkForNewNotifications, 60000)
