console.log("digi-utils> anti_afk.js loaded");

function loadAntiAfk() {
    if (!document.location.href.endsWith("login")) {
        let script = document.createElement("script");
        script.innerHTML = "setInterval(function () {AutoLogout.trackAction();}, 60_000);";
        document.body.appendChild(script);
    }
}

// send a message requesting the antiafk setting, resolve the promise once response is recieved
function handleResponse(message) {
    if (chrome.runtime.lastError) console.error(chrome.runtime.lastError);
    if (message.response === true) loadAntiAfk();
}
chrome.runtime.sendMessage({setting: "antiafk"}, handleResponse);