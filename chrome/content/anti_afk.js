console.log("digi-utils> anti_afk.js loaded");

// load a stylesheet-link to dark.css into the html head
function loadAntiAfk() {
    if (!document.location.href.endsWith("login")) {
        setInterval(function () {
            window.wrappedJSObject.AutoLogout.trackAction();
        }, 60_000)
    }
}

// send a message requesting the antiafk setting, resolve the promise once response is recieved
function handleResponse(message) {
    if (chrome.runtime.lastError) console.error(chrome.runtime.lastError);
    if (message.response === true) loadAntiAfk();
}
chrome.runtime.sendMessage({setting: "antiafk"}, handleResponse);