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
let timeElapsed = 0;

let currTaskList = bodilyLongevityData;

//Animation Helpers
const hideMainText = function () {
  main_text.classList.add("hidden-right");
  sub_text.classList.add("hidden-right-sub");
};

const unhideMainText = function () {
  main_text.classList.remove("hidden-right");
  sub_text.classList.remove("hidden-right-sub");
};

const hideMainButtons = function () {
  complete_button.classList.add("hidden");
  ignore_button.classList.add("hidden-ignore");
};

const unhideMainButtons = function () {
  complete_button.classList.remove("hidden");
  ignore_button.classList.remove("hidden-ignore");
};

//Random Generators
const generateInbetweenIndex = function () {
  return Math.floor(Math.random() * Object.keys(inbetweenData).length) + 1;
};

const getTaskIndex = function () {
  return (
    Math.floor(
      Math.random() * Object.keys(currTaskList[`phase${phase}`]).length
    ) + 1
  );
};

//Button Event Listeners
begin_button.addEventListener("mouseup", function () {
  console.log("Fired Begin Button");
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

//Text That will appear in the intermediate stages. (Between Tasks)
const pushInbetweenScreen = function (index) {
  hideMainButtons();
  hideMainText();
  setTimeout(() => {
    for (elements of main_buttons) elements.classList.add("removed");
    unhideMainButtons();
    unhideMainText();
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
    hideMainText();
    setTimeout(function () {
      //Changes both the main_text and it's outline
      main_text.textContent =
        currTaskList[`phase${phase}`][`task${randomIndex}`].main;
      sub_text.textContent =
        currTaskList[`phase${phase}`][`task${randomIndex}`].sub;
      unhideMainText();
      for (elements of main_buttons) elements.classList.remove("removed");
    }, 500);
  }
});

//Picks an index out of the current tasks lists current phase. Will choose dynamic max/min bounds.

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
