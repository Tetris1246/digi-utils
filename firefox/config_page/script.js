function saveSettings() {
    var data = {digi_settings: {}};
    for (let element of document.getElementsByClassName("box-checkbox")) {
        var name = element.id.split("-")[0];
        var value = element.checked;
        data.digi_settings[name] = {};
        data.digi_settings[name].value = value;
        data.digi_settings[name].inputs = {};
    }

    for (let inputElement of document.getElementsByClassName("box-item-input")) {
        var fieldName = inputElement.id;
        var fieldValue;
        if (inputElement.type === "checkbox") {
            fieldValue = inputElement.checked;
        } else {
            fieldValue = inputElement.value;
        }

        data.digi_settings[inputElement.name].inputs[fieldName] = {};
        data.digi_settings[inputElement.name].inputs[fieldName].value = fieldValue;
    }

    setStorage(data);
    settingsChanged();
}

function reloadSettings() {
    getStorage(function (settings) {
        
        for (let element of document.getElementsByClassName("box-checkbox")) {
            var name = element.id.split("-")[0];
            element.checked = settings.digi_settings[name].value;
            const event = new Event('build');
            element.dispatchEvent(event);
        }

        for (let inputElement of document.getElementsByClassName("box-item-input")) {
            var fieldName = inputElement.id;
            if (inputElement.type === "checkbox") {
                inputElement.checked = settings.digi_settings[inputElement.name].inputs[fieldName].value;
            } else {
                inputElement.value = settings.digi_settings[inputElement.name].inputs[fieldName].value;
            }
        }
    });
}

function createConfigPage(default_settings) {
    let element = document.body;
    for (var setting in default_settings) {
        var box = new Box({
            title: default_settings[setting].title,
            description: default_settings[setting].description,
            id: setting,
            hover: "",
            enabled: false,
            onchange: saveSettings
        });
        if (default_settings[setting].inputs) {
            for (var inputInfo in default_settings[setting].inputs) {
                box.addItem({
                    "title": default_settings[setting].inputs[inputInfo].title,
                    "input": {
                        "type": default_settings[setting].inputs[inputInfo].input.type,
                        id: inputInfo,
                        value: true
                    }
                });
            }
        }
        element.appendChild(box.getBox());
    }
}

//create the Html
getDefaultSettings(function(object) {
    createConfigPage(object);
    reloadSettings();
});

addSettingChangeListener(reloadSettings);