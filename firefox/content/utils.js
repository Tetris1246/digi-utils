function getSettingState(setting, callFunction) {
    browser.runtime.sendMessage({"getSettingState": {"setting": setting}}).then(function(message) {
        if (message.response === true) callFunction();
    }, function(e){console.error(e)});
}

function settingEnabled(setting, callFunction) {
    browser.runtime.sendMessage({"getSettingState": {"setting": setting}}).then(function(message) {
        callFunction(message.response);
    }, function(e){console.error(e)});
}

// https://stackoverflow.com/questions/7193238/wait-until-a-condition-is-true
// test: function that returns a value
// expectedValue: the value of the test function we are waiting for
// msec: delay between the calls to test
// callback: function to execute when the condition is met
function waitfor(test, expectedValue, msec, callback) {
    if (test() !== expectedValue) {
        setTimeout(function() {
            waitfor(test, expectedValue, msec, callback);
        }, msec);
        return;
    }
    callback();
}

function getSettingInputValue(setting, input, callFunction) {
    browser.runtime.sendMessage({"getSettingInputValue": {"setting": setting, "input": input}}).then(function(message) {
        callFunction(message);
    }, function(e){console.error(e)});
}

function getColorByNum(num) {
    num = num%1530;
    let mod = num%255;

    if (num >= 0 && num < 255) {   
        return [255, mod, 0];
    } else if (num >= 255 && num < 510) {
        return [255-mod, 255, 0];
    } else if (num >= 510 && num < 765) {
        return [0, 255, mod];
    } else if (num >= 765 && num < 1020) {
        return [0, 255-mod, 255];
    } else if (num >= 1020 && num < 1275) {
        return [mod, 0, 255];
    } else if (num >= 1275 && num < 1530) {
        return [255, 0, 255-mod];
    }
}

function getColorByIndex(index, amount) {
    let div = 1530/(amount+2);
    let colorIndex = (index+1)*div;
    return getColorByNum(colorIndex);
}

function darkColor(color, index) {
    let i = color.indexOf(255);

    color[i] = 255-(index%2)*40;

    return color;
}
