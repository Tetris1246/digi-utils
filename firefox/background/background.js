console.log("digi-utils> background.js loaded")

function onError(error) {
    console.log(`Error: ${error}`);
}

// check if settings are already stored, if not set defaults
var digi_settings = {
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
    if (!storedSettings.digi_settings) {
        browser.storage.local.set({digi_settings});
    }
}
const gettingStoredSettings = browser.storage.local.get();
gettingStoredSettings.then(checkStoredSettings, onError);

// listen for and handle messages
function handleMessage(request, sender, sendResponse) {
    if ("setting" in request) {
        console.log("looks like a setting got requested");
        console.log("setting: " + request.setting);

        browser.storage.local.get().then(function(item) {
            var setting = request.setting;
            sendResponse({response: item.digi_settings[setting]});
        }, onError);
    }
    else {
        sendResponse({response: "something else bruh"});
    }
    return true; // to send an asynchronous response
}
browser.runtime.onMessage.addListener(handleMessage);