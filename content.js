//Dom Elements
const main_text = document.querySelectorAll(".text-main");
const sub_text = document.querySelector(".text-sub");

let phase = 1;
let completedTasks = 0;
let randomIndex = 0;

let currTaskList = bodilyLongevityData;

chrome.alarms.onAlarm.addListener((alarm) => {
  if (alarm.name === "nextTask") {
    updateCompletedTasks();
    randomIndex = getTaskIndex();
    for (element of main_text) {
      element.textContent =
        currTaskList[`phase${phase}`][`task${randomIndex}`].main;
      element.style.fontSize = "xx-large";
    }
    sub_text.textContent =
      currTaskList[`phase${phase}`][`tasks${randomIndex}`].sub;
  }
});

//Picks an index out of the current tasks lists current phase. Will choose dynamic max/min bounds.
const getTaskIndex = function () {
  return (
    Math.floor(
      Math.random() * Object.keys(currTaskList[`phase${phase}`]).length
    ) + 1
  );
};

const updateCompletedTasks = function () {
  completedTasks++;
  updatePhase();
};

const updatePhase = function () {
  if (completedTasks > 5 && phase === 1) {
    phase++;
  } else if (completedTasks > 5 && phase === 2) {
    phase++;
  } else if (completedTasks > 5 && phase === 3) {
    phase++;
  } else {
    return;
  }

  completedTasks = 0;
};
