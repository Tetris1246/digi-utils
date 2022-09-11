function setWarning() {
    var warning = document.createElement("span");
    warning.innerHTML = "digi-utils> Autologin: Du musst deine Logindaten in der Config eingeben. (" + chrome.runtime.getURL("/configPage/config.html") + ")";

    warning.style = "color: #ff0000;";

    var form = document.getElementsByTagName("form")[0];

    form.appendChild(warning);
}

function login() {
    if (document.location.href.split("?")[0].endsWith("login")) {
        getSettingInputValue("login", "password", function (passwordResponse) {
            getSettingInputValue("login", "username", function (usernameResponse) {
                if (passwordResponse.response !== "" || usernameResponse.response !== "") {
        
                    var button = document.getElementsByClassName("btn btn-lg")[0];
            
                    var usernameElement = document.getElementById("inputUserName");
                    var passwordElement = document.getElementById("inputPassword");
            
                    usernameElement.value = usernameResponse.response;
                    passwordElement.value = passwordResponse.response;
                    usernameElement.dispatchEvent(new Event("input", { bubbles: true }));
                    passwordElement.dispatchEvent(new Event("input", { bubbles: true }));
            
                    button.click();
                } else {
                    setWarning();
                }
            });
        });
    }
}

function formIsLoaded() {
    return document.getElementsByTagName("form").length > 0;
}

function loadLogin() {
if (document.location.href.split("?")[0].endsWith("login")) {
    waitfor(formIsLoaded, true, 50, login);
}
}
getSettingState("login", loadLogin);