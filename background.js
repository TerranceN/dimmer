// $(document).ready(function() {
	chrome.storage.sync.clear(function() {
		console.log("cleared storage");
	});
	// check if this is a new session or not 
	chrome.storage.sync.get("started", function(data) {
		// variable not found in storage, set as started and start timer 
		if(!data['started']) {
			chrome.storage.sync.set({'started': true}, function() {
				console.log("started timer");
				var startTime = Date.now(); // browser has been opened
				chrome.storage.sync.set({'startTime': startTime}, function() {
					// Notify that we saved start time 
					console.log('start time saved');
					console.log('Start Time: ' + startTime);
				});
			})
			return;
		} else {
			// timer has already been started, print out started time 
			chrome.storage.sync.get('startTime', function(obj) {
			  console.log(obj['startTime']);
			});

		}
	});
	
// });

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
