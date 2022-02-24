console.log("loaded grade_average.js");

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
    "0+": 0.25,
    "0/1": 0.5,
    "1-": 0.75,
    "1+": 1.25,
    "1/2": 1.5,
    "2-": 1.75,
    "2+": 2.25,
    "2/3": 2.5,
    "3-": 2.75,
    "3+": 3.25,
    "3/4": 3.5,
    "4-": 3.75,
    "4+": 4.25,
    "4/5": 4.5,
    "5-": 4.75,
    "5+": 5.25,
    "5/6": 5.5,
    "6-": 5.75,
    "6+": 6.25,
    "6/7": 6.5,
    "7-": 6.75,
    "7+": 7.25,
    "7/8": 7.5,
    "8-": 7.75,
    "8+": 8.25,
    "8/9": 8.5,
    "9-": 8.75,
    "9+": 9.25,
    "9/10": 9.5,
    "10-": 9.75,
};

function calculate_grades() {
    // total average of ALL grades (including weight)
    const total_grades = document.getElementsByTagName("grade-isolated");
    let total = 0;
    let total_counter = 0;
    for(let i = 0; i < total_grades.length; i++) {
        let weight = total_grades[i].firstElementChild.title.split("<br>")[2];
        weight = weight.slice(0, weight.length - 1);
        weight /= 100;
        if (grade_conv[total_grades[i].textContent] === undefined) {
            total += parseFloat(total_grades[i].textContent) * weight;
        }
        else {
            total += grade_conv[total_grades[i].textContent] * weight;
        }
        total_counter += weight;
    }
    let avg_total = total / total_counter;

    // semester (even indexes) AND year (odd indexes) averages
    const average_grades = document.getElementsByTagName("grade-object-isolated")
    let semester_total = 0;
    let year_total = 0;
    let semester_counter = 0;
    let year_counter = 0;
    for(let i = 0; i < average_grades.length; i++) {
        if (average_grades[i].textContent === "") continue;
        if (grade_conv[average_grades[i].textContent] === undefined) {
            if (i%2===0) {
                semester_total += parseFloat(average_grades[i].textContent);
                semester_counter++;
            }
            else {
                year_total += parseFloat(average_grades[i].textContent);
                year_counter ++;
            }
        }
        else {
            if (i%2===0) {
                semester_total += grade_conv[average_grades[i].textContent];
                semester_counter++;
            }
            else {
                year_total += grade_conv[average_grades[i].textContent];
                year_counter ++;
            }
        }
    }
    let avg_semester = semester_total / semester_counter;
    let avg_year = year_total / year_counter;

    // display averages
    let stats = document.getElementsByClassName("student-statistics row")[0];
    stats.style.margin = "";
    stats.innerHTML = "";
    let semester_span = document.createElement("span");
    semester_span.innerHTML = "Semester: " + avg_semester.toFixed(2);
    semester_span.style.marginRight = "30px";
    let year_span = document.createElement("span");
    year_span.innerHTML = "Jahr " + avg_year.toFixed(2);
    year_span.style.marginRight = "30px";
    year_span.style.fontSize = "20px";
    let total_span = document.createElement("span");
    total_span.innerHTML = "Gesamt " + avg_total.toFixed(2);
    total_span.style.fontSize = "20px";
    grade_average = document.createElement("h1");
    grade_average.innerHTML = "Ø ";
    grade_average.appendChild(semester_span);
    grade_average.appendChild(year_span);
    grade_average.appendChild(total_span);
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

