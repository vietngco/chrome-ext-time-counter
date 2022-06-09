// // background.js
// chrome.storage.local.get(["badgeText"], ({ badgeText }) => {
//   chrome.action.setBadgeText({ text: badgeText });
// });

// // Listener is registered on startup
// console.log("this is something kshdkfjhskjdhfkjshdfkjh");
// chrome.action.onClicked.addListener(handleActionClick);

// // from tab, send data to background
// chrome.runtime.onMessage.addListener(({ type, name }) => {
//   if (type === "count-time") {
//     chrome.storage.local.set({ time });
//   }
// });

// chrome.runtime.onMessage.addListener(({ type, name }) => {
//   if (type === "top-timeer") {
//     chrome.storage.local.set({ name: 0 });
//   }
// });

// // from background, send back data to current tab
// chrome.action.onClicked.addListener((tab) => {
//   chrome.storage.local.get(["name"], ({ name }) => {
//     chrome.tabs.sendMessage(tab.id, { name });
//   });
// });
console.log("this is background js");

// chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
//   console.log(
//     sender.tab
//       ? "from a content script:" + sender.tab.url
//       : "from the extension"
//   );
//   if (request.greeting === "hello") sendResponse({ farewell: "goodbye" });
// });

// let color = "#3aa757";

// chrome.runtime.onInstalled.addListener(() => {
//   chrome.storage.sync.set({ color });
//   console.log("Default background color set to %cgreen", `color: ${color}`);
// });

// let value = "biet nguyen cong";
// chrome.storage.sync.set({ key: value }, function () {
//   console.log("Value is set to " + value);
// });

// chrome.storage.onChanged.addListener(function (changes, namespace) {
//   for (let [key, { oldValue, newValue }] of Object.entries(changes)) {
//     console.log(
//       `Storage key "${key}" in namespace "${namespace}" changed.`,
//       `Old value was "${oldValue}", new value is "${newValue}".`
//     );
//   }
// });

// building
// nofcycle
// focus
// break time
let initTimeConfig = {
  nOfCycles: 0,
  focus: 0,
  breakTime: 0,
};

// init the thing
chrome.storage.sync.get(
  ["nOfCycles", "focus", "breakTime", "key"],
  function (result) {
    console.log("this is 1");
    console.log(result);
    if (result.nOfCycles === undefined) {
      chrome.storage.sync.set({ nOfCycles: initTimeConfig.nOfCycles });
    }
    if (result.focus === undefined) {
      chrome.storage.sync.set({ focus: initTimeConfig.focus });
    }
    if (result.breakTime === undefined) {
      chrome.storage.sync.set({ breakTime: initTimeConfig.breakTime });
    }
  }
);

chrome.storage.sync.get(
  ["nOfCycles", "focus", "breakTime", "key"],
  function (result) {
    console.log("this is 2");
    console.log(result);
  }
);

setInterval(() => {
  chrome.storage.sync.get((obj) => {
    console.log("this is 3");
    console.log(obj);
  });
}, 5000);
