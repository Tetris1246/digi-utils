console.log("digi-utils> background.js loaded")

// check if settings are already stored, if not set defaults
var digi_settings = {
    dark: true,
    average: true,
    religion: true,
    report: true,
    login: false
}
function checkStoredSettings(storedSettings) {
    if (!storedSettings.digi_settings) {
        chrome.storage.local.set({digi_settings});
    }
}
chrome.storage.local.get(checkStoredSettings);

// listen for and handle messages
function handleMessage(request, sender, sendResponse) {
    if ("setting" in request) {
        chrome.storage.local.get(function(item) {
            sendResponse({response: item.digi_settings[request.setting]});
        });
    }
    else {
        sendResponse({response: "something else bruh"});
    }
    return true; // to send an asynchronous response
}
chrome.runtime.onMessage.addListener(handleMessage);