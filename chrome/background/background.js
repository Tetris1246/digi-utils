console.log("digi-utils> background.js loaded")

// check if settings are already stored, if not set defaults
var digi_settings = {
    dark: {
        value: true,
        description: "Protects against blindness",
        title: "Dark Mode",
        inputs: []
    },
    average: {
        value: true,
        description: "Displays the grade average in the evaluation tab",
        title: "Grade average",
        inputs: []
    },
    antiafk: {
        value: true,
        description: "Prevents you from being logged out automatically",
        title: "Anti-AFK",
        inputs: []
    },
    report: {
        value: true,
        description: "Displays the grade point average in the report card tab (only in the 2nd semester)",
        title: "Report card average",
        inputs: []
    },
    login: {
        value: false,
        description: "Logs you in automatically (warning: the login data is stored unencrypted in the browser memory)",
        title: "Autologin",
        inputs: {
            username: {
                title: "Username",
                input: {
                    type: "text",
                    value: ""
                }
            },
            password: {
                title: "Password",
                input: {
                    type: "password",
                    value: ""
                }
            }
        }
    },
    icons: {
        value: true,
        description: "Adds custom icons",
        title: "Custom Icons",
        inputs: []
    },
    limitis_fix: {
        value: false,
        title: "Limitis Fix",
        description: "Replaces the Limitis icon in the login window with a high-resolution icon with an invisible background",
    },
    custom_href: {
        value: true,
        title: "Custom Href",
        description: "Adds a button in the popup to get to the register. You can change the link as you like. The default link leads to the register of RG-TFO, but other links work as well. (After entering, the browser must be restarted).",
        inputs: {
            href_url: {
                title: "Link to your register",
                input: {
                    type: "text",
                    value: "https://rgtfo-me.digitalesregister.it/v2/login"
                }
            }
        }
    }
}

//https://stackoverflow.com/questions/14368596/how-can-i-check-that-two-objects-have-the-same-set-of-property-names
function compareKeys(a, b) {
    var aKeys = Object.keys(a).sort();
    var bKeys = Object.keys(b).sort();
    return JSON.stringify(aKeys) === JSON.stringify(bKeys);
}

function checkStoredSettings(storedSettings) {
    if (Object.keys(storedSettings).length > 0) {
        if (!compareKeys(storedSettings.digi_settings, digi_settings)) {
            chrome.storage.local.clear();
            chrome.storage.local.set({digi_settings});
        }
    } else {
        chrome.storage.local.set({digi_settings});
    }
}   

chrome.storage.local.get(checkStoredSettings);
//https://stackoverflow.com/questions/48982568/javascript-change-data-in-json-by-string-data-path
function setItemByPath(data, path, value) {
    var k = data;
    var last = path.pop();

    path.forEach(e => (k[e] = k[e] || {}) && (k = k[e]));

    k[last] = value;

    return data;
}

function getItemByPath(data, path) {
    var k = data;
    path.forEach(e => (k = k[e]));
    return k;
}

// listen for and handle messages
function handleMessage(request, sender, sendResponse) {
    if ("getSetting" in request) {
        chrome.storage.local.get(function(item) {
            sendResponse({response: item.digi_settings[request.getSetting.setting]["value"]});
        });
    } else if ("getSettingByPath" in request) {
        chrome.storage.local.get(function(item) {
            var newData = getItemByPath(item, request.getSettingByPath.path);
            sendResponse({response: newData});
        });
    } else if ("setSetting" in request) {
        chrome.storage.local.get(function(item) {
            let newData = {};
            newData = setItemByPath(item, ["digi_settings", request.setSetting.setting, "value"], request.setSetting.value);
            chrome.storage.local.set(newData);
            sendResponse({response: newData});
        });
    } else if ("setSettingByPath" in request) {
        chrome.storage.local.get(function(item) {
            setItemByPath(item, request.setSettingByPath.path, request.setSettingByPath.value);
            chrome.storage.local.set(item);
            sendResponse({response: item});
        });
    } else if ("setSettings" in request) {
        chrome.storage.local.get(function(item) {
            let newData = item;
            for (var i = 0; i < request.setSettings.settings.length; i++) { 
                newData = setItemByPath(newData, ["digi_settings", request.setSettings.settings[i], "value"], request.setSettings.values[i]);
            }
            chrome.storage.local.set(newData);
            sendResponse({response: newData});
        });
    } else if ("setSettingsByPath" in request) {
        chrome.storage.local.get(function(item) {
            let newData = item;
            for (var i = 0; i < request.setSettingsByPath.paths.length; i++) { 
                newData = setItemByPath(newData, request.setSettingsByPath.paths[i], request.setSettingsByPath.values[i]);
            }
            chrome.storage.local.set(newData);
            sendResponse({response: newData});
        });
    } else if ("getSettings" in request) {
        chrome.storage.local.get(function(item) {
            var newData = [];
            for (setting of request.getSettings.settings) {
                newData.push(item.digi_settings[setting]["value"]);
            }
            sendResponse({response: newData});
        });
    } else if ("getSettingsByPath" in request) {
        chrome.storage.local.get(function(item) {
            var newData = [];
            for (var i = 0; i < request.getSettingsByPath.paths.length; i++) {
                newData.push(getItemByPath(item, request.getSettingsByPath.paths[i]));
            }
            sendResponse({response: newData});
        });
    } else {
        sendResponse({response: "something else bruh"});
    }
    return true; // to send an asynchronous response
}
chrome.runtime.onMessage.addListener(handleMessage);
