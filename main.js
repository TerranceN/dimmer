var startDim = false; 
var state = {
  enabled: false
};

var Dimmer = (function() {
  var targetOpacity = 0;
  var currentOpacity = 0;
  var dimmerTimeoutHandle = null;
  var time = 0;
  var startTime = null;
  var dimmerOverlay = null;


  // gets time when browser was first opened 
  chrome.storage.sync.get('startTime', function(obj) {
      startTime = obj['startTime'];
      console.log('Start Time: ' + startTime);
  });

  

  var loadDimmerOverlay = function() {
    dimmerOverlay = $('<div id="dimmer_overlay"></div>');
    $('body').append(dimmerOverlay);
  };

  var dimmerLoop = function() {
    var diff = 1;
    var diffTime = Date.now() - time;
    if (diffTime >= 30) {
      time = Date.now();
    }
    for (var i = 0; i < diffTime / 30; i++) {
      diff = targetOpacity - currentOpacity;
      currentOpacity += diff / 10;
    }
    dimmerOverlay.css('opacity', currentOpacity);
    if (diff > 0.05) {
      dimmerTimeoutHandle = window.requestAnimationFrame(dimmerLoop);
    }
  };

  var checkTimer = function() {
    var currTime = Date.now();
    var passedTime = currTime - startTime; 
    if(passedTime >= 5000) { // set it currently to wait for a minute; change this value to 15 minutes
      startDim = true;
    }
  };


  var dim = function(t) {
    if ($('#dimmer_overlay').length == 0) {
      loadDimmerOverlay();
    }

    targetOpacity = t;
    time = Date.now();
    dimmerLoop();
  };

  var setEnabled = function(enabled) {

    if ($('#dimmer_overlay').length == 0) {
      loadDimmerOverlay();
    }
    enabled ? dimmerOverlay.show() : dimmerOverlay.hide();
  }

  return {
    dim: dim,
    checkTimer: checkTimer,
    setEnabled: setEnabled
  };
})();

var NotificationBox = (function() {
  var notificationBox = $('<div id="notification_box"></div>');

  var container = $('<div class="notification_box_container"></div>');

  var page1 = $('<div class="page" id="page1"></div>');
  var dismissButton = $('<input type="button" value="Dismiss"></input>');
  var disableButton = $('<input type="button" value="Snooze for..."></input>');

  var page2 = $('<div class="page" id="page2"></div>');
  var oneHour = $('<input type="button" value="1 Hour"></input>');
  var fourHours = $('<input type="button" value="4 Hours"></input>');

  var loadNotificationBox = function() {
    $('body').append(notificationBox);
    page1.append(dismissButton);
    page1.append(disableButton);
    container.append(page1);
    page2.append(oneHour);
    page2.append(fourHours);
    container.append(page2);
    notificationBox.append('<p>Stare away from the screen for 20 seconds.</p>');
    notificationBox.append(container);
  }

  var notify = function() {
    if ($('#notification_box').length == 0) {
      loadNotificationBox();
    }
    notificationBox.css('left', '-' + (notificationBox.css('width') + 20));
    notificationBox.animate({right: 20}, "medium", "swing");
  };

  var closePopup = function() {
    console.log("Closing popup");
    notificationBox.animate({right: -220}, "medium", "swing");
    chrome.storage.sync.set({'started': true}, function() {
      console.log("restarting timer");
      var startTime = Date.now(); // browser has been opened
      chrome.storage.sync.set({'startTime': startTime}, function() {
        // Notify that we saved start time 
        console.log('start time saved');
        console.log('Start Time: ' + startTime);
        $('#dimmer_overlay').css('opacity', 0);
      });
    })
  }

  disableButton.click(function() {
    page1.css('left', 0);
    page2.css('left', 0);
    page1.animate({left: -200}, "medium", "swing");
    page2.animate({left: -200}, "medium", "swing");
  });

  dismissButton.click(closePopup);
  oneHour.click(closePopup);
  fourHours.click(closePopup);

  var setEnabled = function(enabled) {
    if ($('#notification_box').length == 0) {
      loadNotificationBox();
    }
    enabled ? notificationBox.show() : notificationBox.hide();
  }

  return {
    notify: notify,
    setEnabled: setEnabled
  };

})();

$(function() {
  //Message will be received at each update of state in the background page
  chrome.runtime.onMessage.addListener(function(message, sender, callback) {
      console.log(message);
      //Check the message is valid
      if(message.state == null) {
          console.log("Unrecognized message");
          return;
      }

      //Do actions for the right state
      //You also can use if statements here... Switch are more used when there is lots of states
      Dimmer.setEnabled(message.state.enabled);
      NotificationBox.setEnabled(message.state.enabled);
  })

  //Request the current state to initialise the script
  chrome.runtime.sendMessage({getState: true});

  console.log("Dimmer: Extension loaded!");
  if(enabled) {
    var checkDim = setInterval(function(){
      console.log("checking...");
      Dimmer.checkTimer();
      if(startDim) {
        console.log("Starting dim");
        Dimmer.dim(0.5);
        NotificationBox.notify();
        clearInterval(checkDim);
      }
    }, 1000);  
  }
});
