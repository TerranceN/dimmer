$(function() {
  $("#enabled").click(function() {
    console.log('clicked');
    console.log($(this).is(":checked"));
    chrome.runtime.sendMessage({setState: {
      enabled: $(this).is(":checked")
    }});
  });
});
