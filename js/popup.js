
window.onload=function(){

  document.getElementById("close").onclick=function(){
    window.close();
  };
  document.getElementById("saveinfo").onclick=function(){
    saveinfo();
  };
  document.getElementById("saveimage").onclick=function(){
    saveimage();
  };

}


function saveinfo(){
  var sourcecode=document.documentElement.outerHTML;
  console.log(sourcecode);

}


function saveimage(){

}


// 获得网页源码
chrome.runtime.onMessage.addListener(function(request, sender) {
  if (request.action == "getSource") {
    message.innerText = request.source;
  }
});

function onWindowLoad() {

  var message = document.querySelector('#message');

  chrome.tabs.executeScript(null, {
    file: "/js/getPagesSource.js"
  }, function() {
    // If you try and inject into an extensions page or the webstore/NTP you'll get an error
    if (chrome.runtime.lastError) {
      message.innerText = 'There was an error injecting script : \n' + chrome.runtime.lastError.message;
    }
  });

}

window.onload = onWindowLoad;