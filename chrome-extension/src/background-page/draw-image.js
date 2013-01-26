/*document.addEventListener('DOMContentLoaded', function() {
  updateNumberOfNotifications(5);  
});*/
function updateNumberOfNotifications(num){
    if (num == 0) return;
    var canvas = document.getElementById('canvas');
    var context = canvas.getContext('2d');
    // ...draw to the canvas...
    var img = new Image();
    img.onload = function(){
      context.drawImage(this, 0, 0, 19, 19);
      context.font = "bold 7pt Arial";
      context.fillStyle = "white";
      if (num != 0)
        if (num < 10)
          context.fillText(num, 10, 17);
        else
          context.fillText(num, 7, 17);
      var imageData = context.getImageData(0, 0, 19, 19);
      chrome.browserAction.setIcon({
        imageData: imageData
      });
    };
    img.src = "../../img/unread-mentions-icon.png";
}