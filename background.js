$(document).ready(function() {
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
	
});