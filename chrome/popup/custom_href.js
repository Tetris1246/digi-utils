document.getElementById("settings-icon").addEventListener("click", function() {
    window.open(chrome.runtime.getURL("../config_page/config.html"));
});

function openRegister(){
    getSettingInputValue("custom_href", "href_url", function (response) {
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

    document.getElementById("custom_href").appendChild(icon);
    document.getElementById("custom_href").appendChild(text);
}

getSettingState("custom_href", createRegisterButton);