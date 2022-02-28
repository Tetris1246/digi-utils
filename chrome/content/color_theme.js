console.log("digi-utils> color_theme.js loaded!");

// load a stylesheet-link to dark.css into the html head
function loadDarkTheme() {
    console.log("color_theme.js> loading dark theme")
    var head = document.getElementsByTagName('HEAD')[0];
    var link = document.createElement('link');
    link.rel = 'stylesheet';
    link.type = 'text/css';
    link.href = chrome.runtime.getURL("css/dark.css");
    head.appendChild(link);
}

// send a message requesting the dark setting, load dark settings if response is true
function handleResponse(message) {
    if (chrome.runtime.lastError) console.error(chrome.runtime.lastError);
    if (message.response === true) loadDarkTheme();
}
chrome.runtime.sendMessage({setting: "dark"}, handleResponse);
