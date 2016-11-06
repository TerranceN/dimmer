var state = {
  enabled: false
}

chrome.browserAction.onClicked.addListener(function(tab) {
    if (state.enabled) {
      state.enabled = true;
    } 
    else {
      state.enabled = false;
    }

    //Inform content scripts that the state have changed
    chrome.tabs.sendMessage(tab.id, {state : state});
});
//
//At initialisation, Content scipts will request the current state to background script.
chrome.runtime.onMessage.addListener(function(message, sender, callback) {
    console.log(message);
    if (message.setState) {
      state = message.setState;
      chrome.tabs.query({}, function(tabs) {
        for (var i = 0; i < tabs.length; i++) {
          chrome.tabs.sendMessage(tabs[i].id, {state : state});
        }
      });
    }
    if (message.getState) {
      if (sender.tab) {
        chrome.tabs.sendMessage(sender.tab.id, {state : state});
      } else {
        chrome.runtime.sendMessage({state : state});
      }
    }
});
