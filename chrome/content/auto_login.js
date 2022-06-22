function waitfor(test, expectedValue, msec, callback) {
    if (test() !== expectedValue) {
        setTimeout(function() {
            waitfor(test, expectedValue, msec, callback);
        }, msec);
        return;
    }
    callback();
}

function fill_form(response) {
    var username_element = document.getElementById("inputUserName");
    var password_element = document.getElementById("inputPassword");
    
    username_element.value = response.username;
    password_element.value = response.password;

    username_element.dispatchEvent(new Event("input", { bubbles: true }));
    password_element.dispatchEvent(new Event("input", { bubbles: true }));
}

function set_warning() {
    var warningcontainer = document.createElement("div");
    var warning = document.createElement("span");
    var href = document.createElement("a");
    warning.innerHTML = "digi-utils> Autologin: <br>Du musst deine Logindaten ";
    warning.style = "color: #ff0000;";
    href.href = chrome.runtime.getURL("../autoLoginForm/login.html");
    href.innerHTML = "hier eingeben.";
    warningcontainer.appendChild(warning);
    warningcontainer.appendChild(href);

    var form = document.getElementsByTagName("form")[0];

    form.appendChild(warningcontainer);
}

function login() {
    if (document.location.href.split("?")[0].endsWith("login")) {
        chrome.storage.local.get(function (item) {
            if ("logindata" in item.digi_settings) {
               if (item.digi_settings.logindata.username !== "" || item.digi_settings.logindata.password !== "") {
                var button = document.getElementsByClassName("btn btn-lg")[0];
                fill_form(item.digi_settings.logindata);
                button.click();  
               } else {
                set_warning();
               }
            } else {
                set_warning();
            }
        });
    }
}

function form_is_loaded() {
    if (document.getElementsByTagName("form").length > 0) return true;
return false;
}

function loadLogin() {
if (document.location.href.split("?")[0].endsWith("login")) {
    waitfor(form_is_loaded, true, 50, login);
}
}
// send a message requesting the login setting, resolve the promise once response is recieved
function handleResponse(message) {
    if (chrome.runtime.lastError) console.error(chrome.runtime.lastError);
    if (message.response === true) loadLogin();
}
chrome.runtime.sendMessage({setting: "login"}, handleResponse);