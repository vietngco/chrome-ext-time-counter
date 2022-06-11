// background.js

console.log("this is background js");

// building
// nofcycle
// focus
// break time
let initTimeConfig = {
  nOfCycles: 0,
  focusTime: 0,
  breakTime: 0,
};

// init the thing
// chrome.storage.local.get(
//   ["nOfCycles", "focus", "breakTime", "key"],
//   function (result) {
//     // console.log("this is 1");
//     // console.log(result);
//     if (result.nOfCycles === undefined) {
//       chrome.storage.local.set({ nOfCycles: initTimeConfig.nOfCycles });
//     }
//     if (result.focus === undefined) {
//       chrome.storage.local.set({ focus: initTimeConfig.focus });
//     }
//     if (result.breakTime === undefined) {
//       chrome.storage.local.set({ breakTime: initTimeConfig.breakTime });
//     }
//   }
// );

setInterval(() => {
  chrome.storage.local.get((obj) => {
    console.log("this is 3");
    console.log(obj);
  });
}, 5000);

// timing

chrome.storage.local.get(
  ["timeNOfCycles", "timeFocus", "timeBreakTime", "intervalID"],
  function (result) {
    // console.log("this is 4");
    if (result.intervalID === undefined) {
      chrome.storage.local.set({ intervalID: 0 });
    }
    if (result.timeNOfCycles === undefined) {
      chrome.storage.local.set({ timeNOfCycles: 100 });
    }
    if (result.timeFocus === undefined) {
      chrome.storage.local.set({ timeFocus: initTimeConfig.focusTime });
    }
    if (result.timeBreakTime === undefined) {
      chrome.storage.local.set({ timeBreakTime: initTimeConfig.breakTime });
    }
  }
);

// must calculate from the backend

// chrome.runtime.onMessage.addListener(sync function (
//   request,
//   sender,
//   sendResponse
// ) {
//   const { type, payload } = request;
//   console.log({ type });
//   if (type === "update-timing-from-storage") {
//     // const data = await chrome.storage.local.get([
//     //   "timeNOfCycles",
//     //   "timeBreakTime",
//     //   "timeFocus",
//     // ]);
//     // console.log("this is result I looke for", data);
//     // sendResponse(data);
//     setTimeout(function () {
//       sendResponse({ status: true });
//     }, 0);
//     return true; // uncomment this line to fix error
//   }
//   if (type === "start-ticking") {
//     const { isBreak } = payload;
//     const intervalID = setInterval(sync () => {
//       if (isBreak) {
//         const data = await chrome.storage.local.get("timeBreakTime");
//         chrome.storage.local.set({ timeBreakTime: data.timeBreakTime - 1 });
//       } else {
//         const data = await chrome.storage.local.get("timeFocus");
//         chrome.storage.local.set({ timeFocus: data.timeFocus - 1 });
//       }
//     }, 1000);
//     chrome.local.storage.set({ intervalID });
//   }
//   if (type === "stop-ticking") {
//     const data = await chrome.storage.local.get("intervalID");
//     clearInterval(data.intervalID);
//   }
//   if (type === "end-session") {
//   }
// });

chrome.runtime.onMessage.addListener(function (rq, sender, sendResponse) {
  // setTimeout to simulate any callback (even from storage.local)
  const { type, payload } = rq;
  if (type === "update-timing-from-storage") {
    chrome.storage.local.get(
      ["timeNOfCycles", "timeBreakTime", "timeFocus"],
      function (result) {
        sendResponse(result);
      }
    );
  }
  if (type === "start-ticking") {
    // chrome.storage.local.get("intervalID"), function({intervalID}){

    // }
    const { time, isBreak } = payload;
    console.log("START TICKING ....", time, isBreak);
    let cur_intervalID = -1;
    if (isBreak) {
      cur_intervalID = setInterval(() => {
        chrome.storage.local.get("timeBreakTime", function ({ timeBreakTime }) {
          console.log("UPDATING THE BREAKTIME");
          chrome.storage.local.set({
            timeBreakTime: parseInt(timeBreakTime) - 1,
          });
        });
      }, 1000);
    } else {
      cur_intervalID = setInterval(() => {
        chrome.storage.local.get("timeFocus", function ({ timeFocus }) {
          console.log("UPDATING THE FOCUSTIME");
          chrome.storage.local.set({ timeFocus: parseInt(timeFocus) - 1 });
        });
      }, 1000);
    }
    chrome.storage.local.set({ intervalID: cur_intervalID });
    setTimeout(() => {
      chrome.storage.local.get("intervalID", function ({ intervalID }) {
        clearInterval(cur_intervalID);

        if (intervalID !== -1) {
          console.log("CLEAR THE INTERVAL ID");
          notificationID = Math.floor(Math.random() * 1000000).toString();
          chrome.notifications.create(notificationID, {
            type: "basic",
            iconUrl: "./logo512.png",
            title: `${isBreak ? "break" : "focus"} session ends`,
            message: "You are awesome!",
            priority: 2,
          });
          chrome.storage.local.get(
            ["timeNOfCycles", "isBreak", "focus", "breakTime"],
            function ({ timeNOfCycles, isBreak, focus, breakTime }) {
              chrome.storage.local.set({
                timeFocus: focus,
                timeBreakTime: breakTime,
                ticking: false,
                isBreak: !isBreak,
                timeNOfCycles: isBreak ? timeNOfCycles - 1 : timeNOfCycles,
              });
            }
          );
        }
      });
    }, time * 1000);
  }
  if (type === "press-halt-ticking") {
    chrome.storage.local.get(["intervalID"], function ({ intervalID }) {
      console.log("clear the intervalid by pressing the button");
      clearInterval(intervalID);
      chrome.storage.local.set({ intervalID: -1 });
    });
  }
  if (type === "acutal-stop-ticking") return true; // uncomment this line to fix error
});
// chrome.runtime.onConnect.addListener(function (port) {
//   console.assert(port.name === "knockknock");
//   port.onMessage.addListener(function (msg) {
//     if (msg.joke === "Knock knock")
//       port.postMessage({ question: "Who's there?" });
//     else if (msg.answer === "Madame")
//       port.postMessage({ question: "Madame who?" });
//     else if (msg.answer === "Madame... Bovary")
//       port.postMessage({ question: "I don't get it." });
//   });
// });

// chrome.runtime.Port.onDisconnect.addListener(function (port) {
//   console.log("could not find the port is opening", port.name);
// });
