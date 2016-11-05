$(function() {

  var loadDimmerOverlay = function() {
    $('body').append($('<div id="dimmer_overlay"></div>'));
  }

  var dim = function(t) {
    if ($('#dimmer_overlay').length == 0) {
      loadDimmerOverlay();
      $('#dimmer_overlay').hide();
    }

    $('#dimmer_overlay').css('opacity', t);
  }

  var dimOverTime = function(t) {

  }

  function startTimer(x) {
    console.log("timer started");
  }

  console.log("Dimmer: Extension loaded!");
  dim(0.5);


  window.addEventListener("DOMContentLoaded", startTimer());

});
