// background.js

console.log("this is background js");

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
    // console.log("this is 1");
    // console.log(result);
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
    // console.log("this is 2");
    // console.log(result);
  }
);

setInterval(() => {
  chrome.storage.sync.get((obj) => {
    console.log("this is 3");
    console.log(obj);
  });
}, 5000);

// timing

chrome.storage.sync.get(
  ["timeNOfCycles", "timeFocus", "timeBreakTime"],
  function (result) {
    // console.log("this is 4");
    if (result.timeNOfCycles === undefined || true) {
      chrome.storage.sync.set({ timeNOfCycles: 0 });
    }
    if (result.timeFocus === undefined) {
      chrome.storage.sync.set({ timeFocus: initTimeConfig.focus });
    }
    if (result.timeBreakTime === undefined) {
      chrome.storage.sync.set({ timeBreakTime: initTimeConfig.breakTime });
    }
  }
);

// must calculate from the backend

chrome.runtime.onMessage.addListener(async function (
  request,
  sender,
  sendResponse
) {
  const { type, payload } = request;
  // console.log({ type });
  if (type === "update-timing-from-storage") {
    const data = await chrome.storage.sync.get([
      "timeNOfCycles",
      "timeBreakTime",
      "timeFocus",
    ]);
    // console.log("this is result I looke for", data);
    sendResponse(data);
  }
  // if (type === "start-ticking") {
  //   const { isBreak } = payload;
  //   const intervalID = setInterval(async () => {
  //     if (isBreak) {
  //       const data = await chrome.storage.sync.get("timeBreakTime");
  //       chrome.storage.sync.set({ timeBreakTime: data.timeBreakTime - 1 });
  //     } else {
  //       const data = await chrome.storage.sync.get("timeFocus");
  //       chrome.storage.sync.set({ timeFocus: data.timeFocus - 1 });
  //     }
  //   }, 1000);
  //   chrome.sync.storage.set({ intervalID });
  // }
  // if (type === "stop-ticking") {
  //   const data = await chrome.storage.sync.get("intervalID");
  //   clearInterval(data.intervalID);
  // }
  // if (type === "end-session") {
  // }
});
