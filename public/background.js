// background.js

console.log("this is background js");

let initTimeConfig = {
  nOfCycles: 0,
  focusTime: 0,
  breakTime: 0,
};

chrome.storage.local.get(
  ["nOfCycles", "focus", "breakTime"],
  function (result) {
    // console.log("this is 1");
    // console.log(result);
    if (result.nOfCycles === undefined) {
      chrome.storage.local.set({ nOfCycles: initTimeConfig.nOfCycles });
    }
    if (result.focus === undefined) {
      chrome.storage.local.set({ focus: initTimeConfig.focus });
    }
    if (result.breakTime === undefined) {
      chrome.storage.local.set({ breakTime: initTimeConfig.breakTime });
    }
  }
);

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

chrome.runtime.onMessage.addListener(function (rq, sender, sendResponse) {
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
            silent: false,
          });
          chrome.notifications.clear(notificationID);
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
});

function domain_from_url(url) {
  var result;
  var match;
  if (
    (match = url.match(
      /^(?:https?:\/\/)?(?:[^@\/\n]+@)?(?:www\.)?([^:\/?\n]+)/
    ))
  ) {
    result = match[1];
  }
  return result;
}
chrome.webRequest.onBeforeRequest.addListener(
  function ({ url }) {
    const domain = domain_from_url(url);
    chrome.storage.local.get(
      ["block_domains", "wantToBlock", "isBreak", "ticking"],
      function ({ block_domains, wantToBlock, isBreak, ticking }) {
        if (
          block_domains.includes(domain) &&
          (wantToBlock || (!isBreak && ticking))
        ) {
          const block_link = chrome.runtime.getURL("block.html");
          chrome.tabs.update({ url: block_link });
        }
      }
    );
  },
  {
    urls: ["<all_urls>"],
  }
);
