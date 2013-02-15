// Copyright (c) 2012 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.

function start(){
    $("#rizzomaLink").click(function() {
        // /?from=mention_extension for google analytics :)
        var urlToMentionBlip = "https://rizzoma.com/topic/ce405f9c7a19e357d8a497235ac81ec0/0_b_44dc_2vauj/?from=mention_extension";
        window.open(urlToMentionBlip, "_blank");
    });
    getUnreadMentionsAndDisplayThem();
}

function getUnreadMentionsAndDisplayThem() {
    askForUnreadMentions(displayMentions);
}

function askForUnreadMentions(callback) {
    chrome.extension.sendMessage("GET_NEWEST_MENTIONS", callback);
}
function minimizePopup(){
   // $('#notifications').css({height: '10px'});
   // $('body').css({height: '10px'});
   // $('body').css({
   //     styleFloat: 'right'
   // });
    $('#notifications').css({
        width: '290px'
    });
    $('body').css({
        width: '290px'
    });
    var canvas = document.getElementById('canvas');
    var context = canvas.getContext('2d');
    // ...draw to the canvas...
    var img = new Image();
    img.onload = function(){
        context.drawImage(this, 0, 0, 19, 19);
        var imageData = context.getImageData(0, 0, 19, 19);
        chrome.browserAction.setIcon({
            imageData: imageData
        });
    };
    img.src = "../img/rizzoma-transparent-icon.png";
}
function loggedInButWithoutNewMentions(){
    var canvas = document.getElementById('canvas');
    var context = canvas.getContext('2d');
    // ...draw to the canvas...
    var img = new Image();
    img.onload = function(){
        context.drawImage(this, 0, 0, 19, 19);
        var imageData = context.getImageData(0, 0, 19, 19);
        chrome.browserAction.setIcon({
            imageData: imageData
        });
    };
    img.src = "rizzoma.png";
    $('#notifications').css({width: '599px'});
    $('body').css({width: '599px'});
    return;
}
function displayMentions(mentions) {
    var readedMentions = new Array();
    var unreadedMentions = new Array();
    for (var i = 0; i < mentions.length; i++) {
        var mention = mentions[i];
        if (!mention.isRead)
          unreadedMentions.push(mention);
        else
          readedMentions.push(mention);
    }
    if (mentions.length == 0)
        minimizePopup();
    else if (unreadedMentions.length == 0)
    {
        loggedInButWithoutNewMentions();
    } else if (unreadedMentions.length > 0) {
        $('#ynm').css({visibility: 'visible'});
        $('#notifications').css({width: '599px'});
        $('body').css({width: '599px'});
    }
    for (i = 0; i < unreadedMentions.length; i++)
        displayMention(unreadedMentions[i]);
    var n = Math.min(30 - unreadedMentions.length, readedMentions.length);
    for (i = 0; i < n; i++)
        displayMention(readedMentions[i]);
    // repair design of mentions in case 
    // of to few mentions (scrollbar is unvisible)
    if (readedMentions.length + unreadedMentions.length < 8) {
        $('.date').css({marginRight: '9px'});
        $('.avatar').css({marginRight: '4px'});
        
    }
}

function displayMention(mention) {
    console.dir(mention);
    addNotification(mention, function() {
        // /?from=mention_extension for google analytics :)
        var urlToMentionBlip = "https://www.rizzoma.com/topic/" + mention.waveId + "/" + mention.blipId + "/?from=mention_extension" ;
        window.open(urlToMentionBlip, "_blank");
    })
}
function getTimeString(time)
{
    // "Fri, 25 Jan 2013 16:29:06 GMT"
    var timeStr = time.toString();
    var timeNow = (new Date(Date.now())).toString();
    var timeArray = timeStr.split(' ');
    var resultTime;
    if (!(timeNow.split(' ')[1] == timeArray[1] 
        && timeNow.split(' ')[2] == timeArray[2])) { 
        resultTime = timeArray[1] + " " + timeArray[2];
    } else {
        var hm = timeArray[4].split(':');
        resultTime = hm[0] + ":" + hm[1];
    }
    return resultTime;
}
function addNotification(mention, callback){
    var text = mention.title;
    var b = new Date(Date.now());
    var lSent = parseInt(mention.lastSent)*1000 + b.getTimezoneOffset();
    var date = new Date(lSent);
    //var date = new Date(1000 * parseInt(mention.lastSent));
    var timeStr = getTimeString(date);
    var backGroundColor;
    //console.log(timeStr);
    var avatarUrl = mention.senderAvatar;
    if (avatarUrl == null)
        avatarUrl = "https://rizzoma.com/s/img/user/unknown.png";
    var name = mention.senderName;
    var readStatus = mention.isRead;
    var nfs = document.getElementById('notifications');
    var k = $('.notification').size() + 1;
    if (text.length > 160){
        text = text.substring(0, 160) + " ... ";
    }
    var id  = 'notification'+ k;
    var str ='<div  class="notification" id="'+ id +'"><span class="snipets" >' 
            + text 
            + '</span></div>';
    $('#notifications').append(str);
    var imgStr = '<img class="avatar" title ="' 
            + name
            +'" src="' + avatarUrl
            +'"height="40" width="40">';
    // console.log($('#notifications'));
    var timeDivStr = '<div class="date" title ="' 
            + date.toString()
            +'">' 
            + timeStr
            +'</div>';
    id = '#' + id;
    $(id).append(imgStr);
    if (readStatus){
        $(id).css({fontWeight: 'normal'});
        backGroundColor = "white";
    }
    else {
        $(id).css({fontWeight: 'bold'});
        backGroundColor = "white";
    }
    $(id).append(timeDivStr);
    $(id).mouseover(function(){
        $(id).css({backgroundColor: '#6badf3'});
        $(id).css({color: 'white'});
    });
    
    $(id).mouseout(function(){
        $(id).css({backgroundColor: backGroundColor});
        $(id).css({color: 'black'});
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
