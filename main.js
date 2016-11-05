var Dimmer = (function() {
  var targetOpacity = 0;
  var currentOpacity = 0;
  var dimmerTimeoutHandle = null;
  var time = 0;

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

  var dim = function(t) {
    if ($('#dimmer_overlay').length == 0) {
      loadDimmerOverlay();
      $('#dimmer_overlay').hide();
    }
    targetOpacity = t;
    time = Date.now();
    dimmerLoop();
  };

  return {
    dim: dim
  };
})();

$(function() {
  console.log("Dimmer: Extension loaded!");
  window.setTimeout(function() {
    Dimmer.dim(0.5);
  }, 1000);
});
