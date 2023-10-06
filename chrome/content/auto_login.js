function setWarning() {
    var warning = document.createElement("span");
    warning.innerHTML = "digi-utils> Autologin: Du musst entweder deine Logindaten in der Config eingeben oder in der Config Only Click aktivieren. (" + chrome.runtime.getURL("/configPage/config.html") + ")";

    warning.classList.add("form-error");

    var form = document.getElementsByTagName("form")[0];

    form.appendChild(warning);
}

function onlyClickInfo() {
    var info = document.createElement("span");
    info.innerHTML = "digi-utils> Autologin: Only Click drückt automatisch sobald die Logindaten eingegeben wurden den Anmelden Knopf. Hier deaktivieren: " + chrome.runtime.getURL("/configPage/config.html");

    info.classList.add("form-error");

    var form = document.getElementsByTagName("form")[0];

    form.appendChild(info);
}

function login() {
    if (document.location.href.split("?")[0].endsWith("login")) {
        getSettingInputValue("login", "only_click", function (onlyClickResponse) {
            if (onlyClickResponse.response == true) {
                onlyClickInfo();
                waitfor(function() {return (document.getElementById("inputUserName").value !== "" && document.getElementById("inputPassword").value !== "")}, true, 50, function () {
                    var button = document.getElementsByClassName("btn btn-lg")[0];
                     button.click();
                });
            } else {
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