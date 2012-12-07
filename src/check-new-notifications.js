(function() {
  var checkForNewNotifications;

  checkForNewNotifications = function() {
    return console.log("check for new notifications");
  };

  setInterval(checkForNewNotifications, 1000);

}).call(this);
