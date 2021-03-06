# just a listener sending the newest mentions if the popup requests them
window.rizzomaNotifications = window.rizzomaNotifications || {}

getNewestMentionsAndSendback = (sendResponse) ->
    window.rizzomaNotifications.askForNewMentions((mentions) ->
        sendResponse(mentions.data.searchResults)
    )

chrome.extension.onMessage.addListener((messageString, sender, sendResponse) ->
    if (messageString == "GET_NEWEST_MENTIONS")
        getNewestMentionsAndSendback(sendResponse)
)