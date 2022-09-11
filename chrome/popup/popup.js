function reloadSettings() {
    getStorage(function (stored_values) {
        for (let checkbox of document.getElementsByClassName("setting-checkbox")) {
            checkbox.checked = stored_values.digi_settings[checkbox.name].value;
        }
    });
}

function saveSettings() {
    let new_storage_settings = {digi_settings: {}};
    for (let checkbox of document.getElementsByClassName("setting-checkbox")) {
        new_storage_settings.digi_settings[checkbox.name] = {
            value: checkbox.checked
        }
        compareSettings(new_storage_settings, function(new_storage_settings) {
            console.log(new_storage_settings)
            setStorage(new_storage_settings);
            settingsChanged();
            reloadSettings();
        });
    }
}

function compareSettings(new_storage_settings, callback) {
    getStorage(function (stored_values) {
        for (let setting in new_storage_settings.digi_settings) {
            new_storage_settings.digi_settings[setting].inputs = stored_values.digi_settings[setting].inputs;
        }
        callback(new_storage_settings);
    });
}

function appendSetting(object, element) {
    var checkbox = document.createElement("input");
    var label = document.createElement("label");
    var container = document.createElement("div");

    container.className = "setting-container";
    container.name = object.internalName;
    container.title = object.description;

    label.innerText = object.title
    label.className = "setting-label";

    checkbox.type = "checkbox";
    checkbox.name = object.internalName;
    checkbox.addEventListener("change", function() {
        if (checkbox.checked) {
            if (object.hasInputs) {
                alert("If you want to use this option, you also have to set some data into the config page."); //pls rewrite. im bad at explaining stuff
            }
        }
    });
    checkbox.addEventListener("change", object.onchange);
    checkbox.className = "setting-checkbox";

    container.appendChild(checkbox);
    container.appendChild(label);

    element.appendChild(container);
}

function createConfigPage(stored_values, default_settings) {
    for (let setting in default_settings) {
        let settingInfo = {
            "internalName": setting,
            "onchange": saveSettings,
            "title": default_settings[setting].title,
            "description": default_settings[setting].description,
            "hasInputs": (Object.keys(stored_values.digi_settings[setting].inputs).length !== 0)
        }
        appendSetting(settingInfo, document.getElementById("settings"));
    }
}


getStorage(function (stored_values) {
    getDefaultSettings(function (default_settings){
        createConfigPage(stored_values, default_settings)
        reloadSettings()
    });
});

addSettingChangeListener(reloadSettings);