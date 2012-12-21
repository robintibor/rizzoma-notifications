// Copyright (c) 2012 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.

function start(){
    getUnreadMentionsAndDisplayThem();
}

function getUnreadMentionsAndDisplayThem() {
    askForUnreadMentions(displayMentions);
}

function askForUnreadMentions(callback) {
    chrome.extension.sendMessage("GET_NEWEST_MENTIONS", callback);
}

function displayMentions(mentions) {
    for (var i = 0; i < mentions.length; i++) {
        var mention = mentions[i];
        displayMention(mention);
    }
}

function displayMention(mention) {
    addNotification(mention.title, function() {
        var urlToMentionBlip = "https://www.rizzoma.com/topic/" + mention.waveId + "/" + mention.blipId;
        window.open(urlToMentionBlip, "_blank");
    })
}

function addNotification(text, callback){
    var nfs = document.getElementById('notifications');
    var k = $('.notification').size() + 1;
    var str ='<div  class="notification" id="notification'+ k +'">' + text + '</div>';
    $('#notifications').append(str);
    console.log($('#ntoifications'));
    var id = '#notification' + k;
    
    $(id).mouseover(function(){
        $(id).css({backgroundColor: '#3184D6'});
    });
    
    $(id).mouseout(function(){
        $(id).css({backgroundColor: "rgb(227,234,240)"});
    });
    $(id).click(callback);
}

function main() {
    
    start();
  // Initialization work goes here.
}

// Add event listeners once the DOM has fully loaded by listening for the
// `DOMContentLoaded` event on the document, and adding your listeners to
// specific elements when it triggers.
document.addEventListener('DOMContentLoaded', function () {
  //document.querySelector('div').addEventListener("mouseover", markNotification());
  //document.querySelector('div').addEventListener("mouseout", remarkNotification());
  main();
});