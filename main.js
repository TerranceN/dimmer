var startDim = false; 

var Dimmer = (function() {
  var targetOpacity = 0;
  var currentOpacity = 0;
  var dimmerTimeoutHandle = null;
  var time = 0;
  var startTime;


  // gets time when browser was first opened 
  chrome.storage.sync.get('startTime', function(obj) {
      startTime = obj['startTime'];
      console.log('Start Time: ' + startTime);
  });

  var loadDimmerOverlay = function() {
    $('body').append($('<div id="dimmer_overlay"></div>'));
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
    $('#dimmer_overlay').css('opacity', currentOpacity);
    if (diff > 0.05) {
      dimmerTimeoutHandle = window.requestAnimationFrame(dimmerLoop);
    }
  };

  var checkTimer = function() {
    var currTime = Date.now();
    var passedTime = currTime - startTime; 
    if(passedTime >= 60000) { // set it currently to wait for a minute; change this value to 15 minutes
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

  return {
    dim: dim,
    checkTimer: checkTimer
  };

})();

$(function() {
  console.log("Dimmer: Extension loaded!");
  var checkDim = setInterval(function(){
    console.log("checking...");
    Dimmer.checkTimer();
    if(startDim) {
      Dimmer.dim(0.5);
      clearInterval(checkDim);
    }
  }, 5000);  
});
