// feel free to implement this yourself, I know this is trash
// "it works tho"   ~ everyone at menga, ever

console.log("loaded grade_average.js");
main_element = document.getElementById("main").firstElementChild;

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

var grade_conv = {
    "0": 0,
    "0+": 0.25,
    "0/1": 0.5,
    "1-": 0.75,
    "1": 1,
    "1+": 1.25,
    "1/2": 1.5,
    "2-": 1.75,
    "2": 2,
    "2+": 2.25,
    "2/3": 2.5,
    "3-": 2.75,
    "3": 3,
    "3+": 3.25,
    "3/4": 3.5,
    "4-": 3.75,
    "4": 4,
    "4+": 4.25,
    "4/5": 4.5,
    "5-": 4.75,
    "5": 5,
    "5+": 5.25,
    "5/6": 5.5,
    "6-": 5.75,
    "6": 6,
    "6+": 6.25,
    "6/7": 6.5,
    "7-": 6.75,
    "7": 7,
    "7+": 7.25,
    "7/8": 7.5,
    "8-": 7.75,
    "8": 8,
    "8+": 8.25,
    "8/9": 8.5,
    "9-": 8.75,
    "9": 9,
    "9+": 9.25,
    "9/10": 9.5,
    "10-": 9.75,
    "10": 10,
};

function calculate_grades() {
    stats = document.getElementsByClassName("student-statistics row")[0];
    stats.style.margin = "";
    stats.innerHTML = "";
    grade_average = document.createElement("h1");

    const grades = document.getElementsByTagName("grade-isolated");

    var total = 0;
    for(var i = 0; i < grades.length; i++) {
        total += grade_conv[grades[i].textContent];
    }
    var avg = total / grades.length;

    grade_average.innerHTML = "&nbsp&nbspØ " + avg.toFixed(2);
    grade_average.style.fontSize = "30px";
    stats.appendChild(grade_average);
}

function subjects_are_loaded() {
    if (document.getElementById("studentSubjectApp") !== null) {
        if (document.getElementsByClassName("student-statistics row") !== null) {
            if (document.getElementsByTagName("grade-isolated").length > 0) return true;
            // technically only the last statement is necessary, but it's cool to observe the page-loading-progress
        }
    }
    return false;
}

// if the grades-button is clicked, wait for the grades to load
document.getElementsByClassName("v2-main-navigation main-navigation-show-mobile")[0].childNodes[6].onclick = function(){
    waitfor(subjects_are_loaded, true, 50, function() {
        calculate_grades();
    });
};

// do one grade calculation, in case the user navigates to the subjects-page via link or refresh
if (document.location.href.endsWith("#student/subjects")) {
    waitfor(subjects_are_loaded, true, 50, function() {
        calculate_grades();
    });
}

