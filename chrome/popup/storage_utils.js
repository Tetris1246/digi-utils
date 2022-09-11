function getDefaultSettings(callback) {
    chrome.runtime.sendMessage({"getDefaultObject": {}}, function(message) {
        callback(message.response)
    });
}

function getStorage(callback) {
    chrome.storage.local.get(function (message) {
        callback(message);
    });
}

function setStorage(object) {
    chrome.storage.local.set(object);
}

function addSettingChangeListener(func) {
    chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
        if ("settingChange" in request) {
            func();
            sendResponse({response: {}});
        }
        return true;
    });
}

function settingsChanged() {
    chrome.runtime.sendMessage({"settingChange": {}});
}

function getSettingState(setting, callFunction) {
    chrome.runtime.sendMessage({"getSettingState": {"setting": setting}}, function (message) {
        if (chrome.runtime.lastError) console.error(chrome.runtime.lastError);
        if (message.response === true) callFunction();
    });
}

function getSettingInputValue(setting, input, callFunction) {
    chrome.runtime.sendMessage({"getSettingInputValue": {"setting": setting, "input": input}}, function (message) {
        if (chrome.runtime.lastError) console.error(chrome.runtime.lastError);
        callFunction(message);
    });
}