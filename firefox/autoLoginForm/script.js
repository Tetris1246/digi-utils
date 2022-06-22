var btn = document.getElementById("safe");
btn.addEventListener("click", function () {
    var username = document.getElementById("username").value;
    var password = document.getElementById("password").value;
    browser.storage.local.get(function (item) {
        browser.storage.local.set(
            {
                digi_settings: {
                    dark: item.digi_settings.dark,
                    average: item.digi_settings.average,
                    antiafk: item.digi_settings.antiafk,
                    report: item.digi_settings.report,
                    login: item.digi_settings.login,
                    icons: item.digi_settings.icons,
                    logindata: {
                        username: username,
                        password: password
                    }
                }
            }
        );
    });
});