$(function() {
  chrome.runtime.onMessage.addListener(function(message, sender, callback) {
    console.log(message);
    if(message.state == null) {
        console.log("Unreconized message");
        return;
    }

    $("#enabled").prop('checked', message.state.enabled);
  });

  //Request the current state to initialise the script
  chrome.runtime.sendMessage({getState: true});

  $("#enabled").click(function() {
    console.log('clicked');
    console.log($(this).is(":checked"));
    chrome.runtime.sendMessage({setState: {
      enabled: $(this).is(":checked")
    }});
  });
});
