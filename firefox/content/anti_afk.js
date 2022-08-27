console.log("digi-utils> anti_afk.js loaded");

function loadAntiAfk() {
    if (!document.location.href.endsWith("login")) {
        let script = document.createElement("script");
        script.innerHTML = "setInterval(function () {AutoLogout.trackAction();}, 60_000);";
        document.body.appendChild(script);
    }
}

getSettingState("antiafk", loadAntiAfk);