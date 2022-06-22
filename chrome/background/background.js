console.log("digi-utils> background.js loaded")

// check if settings are already stored, if not set defaults
var digi_settings_default = {
    dark: true,
    average: true,
    antiafk: true,
    report: true,
    login: false,
    icons: true,
    logindata: {
        username: "",
        password: ""
    }
}
function checkStoredSettings(storedSettings) {
    for (const item in storedSettings.digi_settings) {
        if (!item in digi_settings_default) {
            chrome.storage.local.set({digi_settings_default});
        }
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