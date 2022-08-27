document.getElementById("settings-icon").addEventListener("click", function() {
    window.open(chrome.runtime.getURL("../config_page/config.html"));
});

function openRegister(){
    chrome.runtime.sendMessage({"getSettingByPath": {path: ["digi_settings", "custom_href", "inputs", "href_url", "input", "value"]}}, function (response) {
        window.open(response.response);
    });
}


function createRegisterButton() {
    var icon = document.createElement("img");
    var text = document.createElement("label");

    icon.src = "register_icon.png";
    icon.addEventListener("click", openRegister);
    icon.classList.add("big-icon");

    text.innerHTML = "goto: register"
    text.addEventListener("click", openRegister);
    text.classList.add("big-text");

    document.body.appendChild(icon);
    document.body.appendChild(text);
}

browser.runtime.sendMessage({"getSetting": {"setting": "custom_href"}}).then(function(message) {
    if (message.response === true) createRegisterButton();
}, function(e){console.error(e)});