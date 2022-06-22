console.log("digi-utils> popup.js loaded");

document.getElementById("warning").addEventListener("click", function () {
    alert("WARNING: the logindata is safed unencrypted in the browser storage. Use at your own risk!");
});

const checkbox_map = new Map();
var names = ["dark", "average", "antiafk", "report", "login", "icons"];

for (var i=0; i<names.length; i++) {
    checkbox_map.set(`checkbox_${names[i]}`, document.getElementById(names[i]));
}

// save settings on checkbox change
function saveSettings() {
    chrome.storage.local.get(function get(item) {
        chrome.storage.local.set({digi_settings: {
            dark: checkbox_map.get("checkbox_dark").checked,
            average: checkbox_map.get("checkbox_average").checked,
            antiafk: checkbox_map.get("checkbox_antiafk").checked,
            report: checkbox_map.get("checkbox_report").checked,
            login: checkbox_map.get("checkbox_login").checked,
            icons: checkbox_map.get("checkbox_icons").checked,
            logindata: {
                username: (("logindata" in item.digi_settings) ? item.digi_settings.logindata.username : ""),
                password: (("logindata" in item.digi_settings) ? item.digi_settings.logindata.password : "")
            }
        }});
    });
}

for (const element of checkbox_map.values()) {
    if (element.id == "login") {
        element.addEventListener("change", function () {
            if (element.checked) {
                window.open(chrome.runtime.getURL("../autoLoginForm/login.html"));
            }
        });
    }
    element.addEventListener("change", saveSettings);
}

function handleLogin(checkbox_map) {
    checkbox_map.get("checkbox_login").onchange = function() {
        saveSettings();
        if (checkbox_map.get("checkbox_login").checked) {
            window.open(chrome.runtime.getURL("../autoLoginForm/login.html"))
        }
    }
}

// check checkboxes according to settings
function onGot(item) {
    checkbox_map.get("checkbox_dark").checked = item.digi_settings.dark;
    checkbox_map.get("checkbox_average").checked = item.digi_settings.average;
    checkbox_map.get("checkbox_antiafk").checked = item.digi_settings.antiafk;
    checkbox_map.get("checkbox_report").checked = item.digi_settings.report;
    checkbox_map.get("checkbox_login").checked = item.digi_settings.login;
    checkbox_map.get("checkbox_icons").checked = item.digi_settings.icons;
}

chrome.storage.local.get(onGot);
handleLogin(checkbox_map);