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
const main_text = document.querySelector(".text-main");
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
  chrome.alarms.create("nextTask", { delayInMinutes: 1 });
  for (element of start_elements) element.classList.add("hidden");
  setTimeout(() => {
    for (element of start_elements) element.classList.add("removed");
    for (element of main_text_list) element.classList.remove("removed");
  }, 800);
});

complete_button.addEventListener("click", function () {
  pushInbetweenScreen(generateInbetweenIndex());

  //Creates an Alarm that will fire at newTime
  chrome.alarms.create("nextTask", {
    delayInMinutes:
      currTaskList[`phase${phase}`][`task${randomIndex}`]?.delayNextTask,
  });

  console.log(
    currTaskList[`phase${phase}`][`task${randomIndex}`]?.delayNextTask
  );

  //pushInbetweenScreen();
  /*
  Put a piece in the background
  play a nice sound
  Transition back to relax screen 
  */
});

const generateInbetweenIndex = function () {
  return Math.floor(Math.random() * Object.keys(inbetweenData).length) + 1;
};

//Text That will appear in the intermediate stages. (Between Tasks)
const pushInbetweenScreen = function (index) {
  console.log(index);
  //Hide the buttosn and text momentarily
  for (elements of main_buttons) elements.classList.add("hidden");
  for (elements of main_text_list) elements.classList.add("hidden");

  //Remove the buttons from the flexbox, remove hidden class
  setTimeout(() => {
    for (elements of main_buttons) elements.classList.add("removed");
    for (elements of main_buttons) elements.classList.remove("hidden");
    for (elements of main_text_list) elements.classList.remove("hidden");
  }, 500);

  setTimeout(() => {
    main_text.textContent = inbetweenData[`prompt${index}`].main;
    sub_text.textContent = inbetweenData[`prompt${index}`].sub;
  }, 600);
};

chrome.alarms.onAlarm.addListener((alarm) => {
  /*TODO: add a nice sound and an icon notification.
  Clear the alarm
  */

  if (alarm.name === "nextTask") {
    chrome.alarms.clear("nextTask");
    randomIndex = getTaskIndex();

    //Hide the text temporarily
    main_text.classList.add("hidden-right");
    sub_text.classList.add("hidden-right-sub");

    setTimeout(function () {
      //Changes both the main_text and it's outline
      main_text.textContent =
        currTaskList[`phase${phase}`][`task${randomIndex}`].main;
      sub_text.textContent =
        currTaskList[`phase${phase}`][`task${randomIndex}`].sub;

      //Unhides text
      main_text.classList.remove("hidden-right");
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
