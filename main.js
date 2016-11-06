var Dimmer = (function() {
  var targetOpacity = 0;
  var currentOpacity = 0;
  var dimmerTimeoutHandle = null;
  var time = 0;
  var dimmerOverlay = null;

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
    setEnabled: setEnabled
  };
})();

$(function() {
  //Message will be received at each update of state in the background page
  chrome.runtime.onMessage.addListener(function(message, sender, callback) {
      console.log(message);
      //Check the message is valid
      if(message.state == null) {
          console.log("Unreconized message");
          return;
      }

      //Do actions for the right state
      //You also can use if statements here... Switch are more used when there is lots of states
      Dimmer.setEnabled(message.state.enabled);
  })

  //Request the current state to initialise the script
  chrome.runtime.sendMessage({getState: true});

  console.log("Dimmer: Extension loaded!");
  window.setTimeout(function() {
    Dimmer.dim(0.5);
  }, 1000);
});
