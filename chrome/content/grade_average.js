console.log("digi-utils> gradeAverage.js loaded");

var gradeConv = {
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

function calculateGrades() {
    // total average of ALL grades (including weight)
    const totalGrades = document.getElementsByTagName("grade-isolated");
    let total = 0;
    let total_counter = 0;
    for(let i = 0; i < totalGrades.length; i++) {
        let weight = totalGrades[i].firstElementChild.title.split("<br>")[2];
        weight = weight.slice(0, weight.length - 1);
        weight /= 100;
        if (gradeConv[totalGrades[i].textContent] === undefined) {
            total += parseFloat(totalGrades[i].textContent) * weight;
        }
        else {
            total += gradeConv[totalGrades[i].textContent] * weight;
        }
        total_counter += weight;
    }
    let avg_total = total / total_counter;

    // semester (even indexes) AND year (odd indexes) averages
    const averageGrades = document.getElementsByTagName("grade-object-isolated")
    let semesterTotal = 0;
    let yearTotal = 0;
    let semesterCounter = 0;
    let yearCounter = 0;
    for(let i = 0; i < averageGrades.length; i++) {
        if (averageGrades[i].textContent === "") continue;
        if (gradeConv[averageGrades[i].textContent] === undefined) {
            if (i%2===0) {
                semesterTotal += parseFloat(averageGrades[i].textContent);
                semesterCounter++;
            }
            else {
                yearTotal += parseFloat(averageGrades[i].textContent);
                yearCounter ++;
            }
        }
        else {
            if (i%2===0) {
                semesterTotal += gradeConv[averageGrades[i].textContent];
                semesterCounter++;
            }
            else {
                yearTotal += gradeConv[averageGrades[i].textContent];
                yearCounter ++;
            }
        }
    }
    let avgSemester = semesterTotal / semesterCounter;
    let avgYear = yearTotal / yearCounter;

    // display averages
    let stats = document.getElementsByClassName("student-statistics row")[0];
    stats.style.margin = "";
    stats.innerHTML = "";
    let semesterSpan = document.createElement("span");
    semesterSpan.innerHTML = "Semester: " + avgSemester.toFixed(2);
    semesterSpan.style.marginRight = "30px";
    let yearSpan = document.createElement("span");
    yearSpan.innerHTML = "Jahr " + avgYear.toFixed(2);
    yearSpan.style.marginRight = "30px";
    yearSpan.style.fontSize = "15px";
    let totalSpan = document.createElement("span");
    totalSpan.innerHTML = "Gesamt " + avg_total.toFixed(2);
    totalSpan.style.fontSize = "15px";
    gradeAverage = document.createElement("h1");
    gradeAverage.style.fontSize = "25px";
    gradeAverage.className = "h1";
    gradeAverage.style.margin = "0";
    gradeAverage.style.marginTop = "15px";
    gradeAverage.innerHTML = "Ø ";
    gradeAverage.appendChild(semesterSpan);
    gradeAverage.appendChild(yearSpan);
    gradeAverage.appendChild(totalSpan);
    stats.appendChild(gradeAverage);
}

function subjectsAreLoaded() {
    if (document.getElementById("studentSubjectApp") !== null) {
        if (document.getElementsByClassName("student-statistics row") !== null) {
            if (document.getElementsByTagName("grade-isolated").length > 0) return true;
            // technically only the last statement is necessary, but it's cool to observe the page-loading-progress
        }
    }
    return false;
}

function enableGradeAverage() {
    // if the grades-button is clicked, wait for the grades to load
    if (!document.location.href.endsWith("login")) {
        document.getElementsByClassName("v2-main-navigation main-navigation-show-mobile")[0].childNodes[6].onclick = function () {
            waitfor(subjectsAreLoaded, true, 50, function () {
                calculateGrades();
            });
        };
    }

    // do one grade calculation, in case the user navigates to the subjects-page via link or refresh
    if (document.location.href.endsWith("#student/subjects")) {
        waitfor(subjectsAreLoaded, true, 50, function() {
            calculateGrades();
        });
    }
}

getSettingState("average", enableGradeAverage);