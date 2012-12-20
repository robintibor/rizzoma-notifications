// Copyright (c) 2012 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.
var k=0;
function start(){
    addNotification("S tochki zrenija banal'noj erudicii kazhdyj banal'no mysljashchij ...");
    addNotification("dva");
    addNotification("dva");
    addNotification("tri");
    addNotification("dva");
    addNotification("tri");
    addNotification("dva");
    addNotification("tri");
    addNotification("dva");
    addNotification("tri");    
    addNotification("dva");
    addNotification("tri");
    addNotification("dva");
    addNotification("tri");
    
    addNotification("tri");
    
}

function markNotification(obj){
    var nf = document.getElementById('notification'+obj);
    nf.style.backgroundColor="white";
 //   alert(obj.id);
}
function remarkNotification(obj){
    var nf = document.getElementById('notification'+obj);
    nf.style.backgroundColor="rgb(227,234,240)";
}
function addNotification(text){
    var nfs = document.getElementById('notifications');
    console.log(nfs);
    if (nfs.innerHTML == null) nfs.innerHTML = " ";
    k++;
    var str = '<div  class="notification" id="notification'+ k +'">' + text + '</div>';
    nfs.innerHTML = nfs.innerHTML + str;
    var nf = document.getElementById('notification'+k);
    nf.addEventListener("onmouseover", markNotification(k));
    nf.addEventListener("onmouseout", remarkNotification(k));
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
