document.addEventListener('DOMContentLoaded', function() {
  updateNumberOfNotifications(5);  
});
function updateNumberOfNotifications(num){
    var canvas = document.getElementById('canvas');
    var context = canvas.getContext('2d');
    // ...draw to the canvas...
    var img = new Image();
    img.onload = function(){
      context.drawImage(this,0,0, 19, 19);
      if (num != 0)
        context.fillText(num, 2, 10);
      var imageData = context.getImageData(0, 0, 19, 19);
      chrome.browserAction.setIcon({
        imageData: imageData
      });
    };
    img.src = "../rizzoma.png";
}