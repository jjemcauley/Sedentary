/*
* Objective list: 25th of may
* 1) MVP useability. 
          -Ready state
          -Intermediate state
          -Tasks appearing
          -Button functionality
*
* 2) Drop shadow on text
*/
///Saved code

/*
    updateCompletedTasks();
    randomIndex = getTaskIndex();
    for (element of main_text) {
      element.textContent =
        currTaskList[`phase${phase}`][`task${randomIndex}`].main;
      element.style.fontSize = "xx-large";
    }
    sub_text.textContent =
      currTaskList[`phase${phase}`][`task${randomIndex}`].sub;
    */

//Dom Elements

//Text Elements (Circle)
const main_text = document.querySelectorAll(".text-main");
const sub_text = document.querySelector(".text-sub");
const main_text_list = document.querySelectorAll(".text");

//Start Text Elements
const start_text = document.querySelector(".start-text");
const start_elements = document.querySelectorAll(".start"); //Everything that needs to be hidden

//Buttons
const begin_button = document.querySelector(".begin");

const complete_button = document.querySelector(".complete");
const ignore_button = document.querySelector(".ignore");
const main_buttons = document.querySelectorAll(".button-main");

let phase = 1;
let completedTasks = 0;
let randomIndex = 0;

let currTaskList = bodilyLongevityData;

//Button Event Listeners
begin_button.addEventListener("click", function () {
  chrome.alarms.create("nextTask", { delayInMinutes: 1, periodInMinutes: 1 });
  for (element of start_elements) element.classList.add("hidden");
  setTimeout(() => {
    for (element of start_elements) element.classList.add("removed");
    for (element of main_text_list) element.classList.remove("removed");
  }, 800);
});

complete_button.addEventListener("click", function () {
  /*
  Put a piece in the background
  play a nice sound
  Transition back to relax screen 
  */
});

chrome.alarms.onAlarm.addListener((alarm) => {
  //TODO: add a nice sound and an icon notification.
  if (alarm.name === "nextTask") {
    randomIndex = getTaskIndex();

    //Hide the text temporarily
    for (element of main_text) element.classList.add("hidden-right");
    sub_text.classList.add("hidden-right-sub");

    setTimeout(function () {
      //Changes both the main_text and it's outline
      for (element of main_text) {
        element.textContent =
          currTaskList[`phase${phase}`][`task${randomIndex}`].main;
      }
      sub_text.textContent =
        currTaskList[`phase${phase}`][`task${randomIndex}`].sub;

      //Unhides text
      for (elements of main_text) element.classList.remove("hidden-right");
      sub_text.classList.remove("hidden-right-sub");

      for (elements of main_buttons) elements.classList.remove("removed");
    }, 500);
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
