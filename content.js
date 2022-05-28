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

//Circles
const smallest_circle = document.querySelector(".circle3");
const middle_circle = document.querySelector(".circle2");
const largest_circle = document.querySelector(".circle1");

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
  //For the chime animation
  smallest_circle.classList.add("circle-pulse-1");
  middle_circle.classList.add("circle-pulse-2");
  largest_circle.classList.add("circle-pulse-3");

  playBegin();
  console.log("Fired Begin Button");
  chrome.alarms.create("nextTask", { delayInMinutes: 1 });
  for (element of start_elements) element.classList.add("hidden");
  setTimeout(() => {
    for (element of start_elements) element.classList.add("removed");
    for (element of main_text_list) element.classList.remove("removed");
  }, 800);
});

complete_button.addEventListener("click", function () {
  updatePhase();
  console.log("time elapsed: " + timeElapsed);
  playComplete();
  chrome.action.setBadgeText({ text: "" });
  pushInbetweenScreen(generateInbetweenIndex());

  timeElapsed +=
    currTaskList[`phase${phase}`][`task${randomIndex}`]?.delayNextTask;
  //Creates an Alarm that will fire at newTime
  chrome.alarms.create("nextTask", {
    delayInMinutes:
      currTaskList[`phase${phase}`][`task${randomIndex}`]?.delayNextTask,
  });
});

ignore_button.addEventListener("click", function () {
  chrome.action.setBadgeText({ text: "" });
  pushInbetweenScreen(generateInbetweenIndex());

  timeElapsed +=
    currTaskList[`phase${phase}`][`task${randomIndex}`]?.delayNextTask;

  chrome.alarms.create("nextTask", {
    delayInMinutes:
      currTaskList[`phase${phase}`][`task${randomIndex}`]?.delayNextTask,
  });
});

//Text That will appear in the intermediate stages. (Between Tasks)
const pushInbetweenScreen = function (index) {
  console.log("Inbetween Scenes Sounded");
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
  console.log("ALARM SOUNDED");
  if (alarm.name === "nextTask") {
    playNotify();
    chrome.action.setBadgeText({ text: "!" });
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

//TODO: Need to change this to add up time elapsed instead of amount of phases
const updatePhase = function () {
  if (timeElapsed > 60 && phase === 1) {
    phase++;
  } else if (timeElapsed > 180 && phase === 2) {
    phase++;
  } else if (timeElapsed > 240 && phase === 3) {
    phase++;
  }
};

const playBegin = function () {
  const audio = new Audio("begin.wav");
  audio.volume = 0.2;
  audio.play();
};

const playComplete = function () {
  const audio = new Audio("complete.wav");
  audio.volume = 0.2;
  audio.play();
};

const playNotify = function () {
  const audio = new Audio("notify1.wav");
  audio.volume = 0.1;
  audio.play();
};
