console.log("digi-utils> grade_chart.js loaded");

function getGrades(callback) {
    let url = `https://${document.location.href.match(/^[\w-]+:\/{2,}\[?([\w\.:-]+)\]?(?::[0-9]*)?/)[1]}/v2/api/student/all_subjects`;
    fetch(url).then(res => res.json()).then(function(json) {
        callback(json);
    });
}

function getCompleteDatasets(json, allowedSemesters = [1, 2], averageIncluded, colorTheme) {
    let datasets = [];
    let averageGrades = [];
    let averagesAtGrades = [];
    for (let subject of json.subjects) {
        if (subject.grades.length > 0) {

            let data = [];
            let averageData = [];

            for (let gradeInfo of subject.grades) {
                if (gradeInfo.cancelledTimeStamp == null) {
                    if (allowedSemesters.includes(Number(gradeInfo.semester))) {
                        data.push({
                            x: gradeInfo.date,
                            y: gradeInfo.grade
                        });
                        if (averageIncluded) {
                            averageData.push({
                                x: gradeInfo.date,
                                y: gradeInfo.grade,
                                weight: gradeInfo.weight
                            });
                        }
                    }
                }
            }

            let subIndex = json.subjects.indexOf(subject);
            let amount = json.subjects.length;

            let subjectData = {
                label: subject.subject.name,        
                borderColor: `rgb(${darkColor(getColorByIndex(subIndex, amount), subIndex).join(',')})`,
                data: data,
                fill: false
            }
            if (averageIncluded)
                averageGrades = averageGrades.concat(averageData);

            datasets.push(subjectData);
        }
    }

    if (averageIncluded) {
        averageGrades.sort((a, b) => {
            const dateA = new Date(a.x);
            const dateB = new Date(b.x);
            return dateA - dateB;
        });

        for(let i=0; i<averageGrades.length; i++) {
            averagesAtGrades.push({
                x: averageGrades[i].x,
                y: calculateAverage(getAllBefore(averageGrades, i+1))
            })
        }

        let averages = {
            label:"Durchschnitt",
            borderColor: colorTheme.average,
            data: averagesAtGrades,
            fill: false
        }
        datasets.push(averages);
    }
    return datasets;
}

function getAllBefore(arr, index) {
    return arr.slice(0, index);
}
function calculateAverage(list) {
    let totalTotal = 0;
    let totalWeight = 0;

    for (item of list) {
        totalTotal += item.y*(item.weight/100);
        totalWeight += (item.weight/100);
    }

    return (totalTotal/totalWeight).toFixed(2);
}
function createChart(json, canvas, allowedSemesters, colorTheme) {
    Chart.defaults.global.defaultFontColor = colorTheme.defaultFontColor;
    Chart.Legend.prototype.afterFit = function() {
        this.height = this.height + 50;
    };
    return new Chart(canvas, {
        type: 'line',
        data: {
            datasets: getCompleteDatasets(json, allowedSemesters, document.getElementById("averageCheckbox").checked, colorTheme)
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            elements: {
                line: {
                    tension: 0
                }
            },
            scales: {
                yAxes: [
                            {
                            ticks: {
                            beginAtZero: false,
                            suggestedMin: 4,
                            max:10
                            },
                            gridLines: {
                                color: colorTheme.gridLines
                            }
                        }
                    ],
                xAxes: [
                    {
                        type: 'time',
                        time: {
                        parser: 'YYYY-MM-DD',
                        unit: 'month',
                        displayFormats: {
                            month: 'MMM'
                        },
                        tooltipFormat: 'DD.MM.YY'
                        },
                        gridLines: {
                            color: colorTheme.gridLines
                        }
                    }
                ]
            },
            legend: {
                onClick: function(e, legendItem) {
                    //stolen from here: https://codepen.io/jordanwillis/pen/BWKKKo
                    var index = legendItem.datasetIndex;
                    var ci = this.chart;
                    var alreadyHidden = (ci.getDatasetMeta(index).hidden === null) ? false : ci.getDatasetMeta(index).hidden;
          
                    ci.data.datasets.forEach(function(e, i) {
                      var meta = ci.getDatasetMeta(i);
          
                      if (i !== index) {
                        if (!alreadyHidden) {
                          meta.hidden = meta.hidden === null ? !meta.hidden : null;
                        } else if (meta.hidden === null) {
                          meta.hidden = true;
                        }
                      } else if (i === index) {
                        meta.hidden = null;
                      }
                    });
          
                    ci.update();
                }
            }
        }
    });
}

function renderChart(requestObject, colorTheme) {
    let domain = document.location.href.match(/^[\w-]+:\/{2,}\[?([\w\.:-]+)\]?(?::[0-9]*)?/)[1];

    let container = document.createElement("div");
    let chartContainer = document.createElement("div");
    let chartCanvas = document.createElement("canvas");
    let averageEnabled = document.createElement("div");
    let averageText = document.createElement("span");
    let averageCheckbox = document.createElement("input");
    let semesterSelector = document.createElement("select");
    let expandButton = document.createElement("img");

    semesterSelector.style.backgroundColor = colorTheme.semesterSelectorBackgroundColor;
    semesterSelector.style.margin = "10px";
    semesterSelector.style.float = "right";
    semesterSelector.style.padding = "5px";
    semesterSelector.style.borderColor = colorTheme.semesterSelectorBackgroundColor;
    semesterSelector.style.borderRadius = "5px";
    semesterSelector.id = "semesterSelection";

    averageEnabled.style.backgroundColor = colorTheme.semesterSelectorBackgroundColor;
    averageEnabled.style.margin = "10px";
    averageEnabled.style.float = "right";
    averageEnabled.style.padding = "5px";
    averageEnabled.style.borderColor = colorTheme.semesterSelectorBackgroundColor;
    averageEnabled.style.borderRadius = "5px";
    averageEnabled.style.height = "31px";
    averageEnabled.id = "averageEnabled";

    averageText.textContent = "Durchschnitt";

    averageCheckbox.checked = true;
    averageCheckbox.id = "averageCheckbox";
    averageCheckbox.type = "checkbox";
    averageCheckbox.style.margin = "5px";

    averageEnabled.appendChild(averageText);
    averageEnabled.appendChild(averageCheckbox);

    for (let selection of ["1. Semester", "2. Semester", "Beide Semester"]) {
        let option = document.createElement("option");
        option.innerText = selection;
        if (selection == "Beide Semester") {
            option.selected = true;
        }
        semesterSelector.appendChild(option);
    }

    container.style.padding = "8px 20px";
    container.style.borderRadius = "5px";
    container.style.backgroundColor = colorTheme.backgroundColor;
    container.style.marginTop = "10px";

    expandButton.style.backgroundSize = "cover";
    expandButton.style.width = "28px";
    expandButton.style.height = "28px";
    expandButton.style.borderRadius = "50%";
    expandButton.style.margin = "5px auto";
    if (colorTheme.dark)
        expandButton.style.filter = "invert(81%)";


    chartCanvas.id = "chart";

    chartContainer.appendChild(chartCanvas);
    container.appendChild(expandButton);
    container.appendChild(averageEnabled);
    container.appendChild(semesterSelector);
    container.appendChild(chartContainer);

    document.getElementById("chartContainer").appendChild(container);

    let chart = createChart(requestObject, document.getElementById("chart"), getSelectedSemester(), colorTheme);
    smallChart(chart);

    let expand = function() {
        bigChart(chart);
        expandButton.src = `https://${domain}/v2/theme/icons/collapse.svg`;
        expandButton.onclick = collapse;
    }

    let collapse = function() {
        smallChart(chart);
        expandButton.src = `https://${domain}/v2/theme/icons/expand.svg`;
        expandButton.onclick = expand;
    }

    averageCheckbox.onchange = function() {
        chart.data.datasets = getCompleteDatasets(requestObject, getSelectedSemester(), document.getElementById("averageCheckbox").checked, colorTheme);
        chart.update();
    };

    semesterSelector.onchange = function() {
        chart.data.datasets = getCompleteDatasets(requestObject, getSelectedSemester(), document.getElementById("averageCheckbox").checked, colorTheme);
        chart.update();
    };

    collapse();
}

function getSelectedSemester() {
    let value = document.getElementById("semesterSelection").value;
    return value == "1. Semester" ? [1] : value == "2. Semester" ? [2] : [1, 2];
}

function smallChart(chart) {
    chart.canvas.parentNode.style.height = "150px";
    chart.resize();
    chart.options.legend.display = false;
    Chart.Legend.prototype.afterFit = function() {
        this.height = this.height - 50;
    };
    chart.update();
}

function bigChart(chart) {
    chart.canvas.parentNode.style.height = "760px";
    chart.resize();
    chart.options.legend.display = true;
    Chart.Legend.prototype.afterFit = function() {
        this.height = this.height + 50;
    };
    chart.update();
}
function getLightTheme() {
    return {
        dark: false,
        backgroundColor: "rgb(255, 255, 255)",
        semesterSelectorBackgroundColor: "rgb(242, 248, 251)",
        gridLines: "rgb(204,204,204)",
        defaultFontColor: "rgb(71, 78, 96)",
        average: "rgb(190, 190, 190)"
    }
}

function getDarkTheme() {
    return {
        dark: true,
        backgroundColor: "rgb(48, 48, 48)",
        semesterSelectorBackgroundColor: "rgb(39, 39, 39)",
        gridLines: "rgb(122, 122, 122)",
        defaultFontColor: "rgb(255, 255, 255)",
        average: "rgb(105,105,105)"
    }
}

function showChart() {
    if (document.getElementById("chartContainer") !== null) {
        return;
    }

    let container = document.getElementsByClassName("student-statistics row")[0];

    let chartContainer = document.createElement("div");

    chartContainer.id = "chartContainer";

    container.appendChild(chartContainer);
    
    getGrades(function(requestObject) {
        settingEnabled("dark", function(enabled) {
            if (enabled)
                renderChart(requestObject, getDarkTheme());
            else
                renderChart(requestObject, getLightTheme());
        });
    });
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

function enableGradeChart() {
    // if the grades-button is clicked, wait for the grades to load
    if (!document.location.href.endsWith("login")) {
        document.getElementsByClassName("v2-main-navigation main-navigation-show-mobile")[0].childNodes[6].addEventListener("click", function () {
            waitfor(subjectsAreLoaded, true, 50, function () {
                showChart();
            });
        });
    }

    // do one grade calculation, in case the user navigates to the subjects-page via link or refresh
    if (document.location.href.endsWith("#student/subjects")) {
        waitfor(subjectsAreLoaded, true, 50, function() {
            showChart();
        });
    }
}
    
getSettingState("chart", enableGradeChart);