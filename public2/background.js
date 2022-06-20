// background.js

console.log("this is background js");

let initTimeConfig = {
  nOfCycles: 0,
  focusTime: 0,
  breakTime: 0,
};

setInterval(() => {
  chrome.storage.local.get((obj) => {
    console.log("this is 5000 timer");
    console.log(obj);
  });
}, 5000);

chrome.storage.local.get(
  [
    "timeNOfCycles",
    "timeFocus",
    "timeBreakTime",
    "intervalID",
    "wantToBlock",
    "nOfCycles",
    "focus",
    "breakTime",
    "ticking",
    "counting",
    "isBreak",
    "block_domains",
  ],
  function (result) {
    if (result.ticking === undefined) {
      chrome.storage.local.set({ ticking: false });
    }
    if (result.counting === undefined) {
      chrome.storage.local.set({ counting: false });
    }
    if (result.isBreak === undefined) {
      chrome.storage.local.set({ isBreak: false });
    }
    if (result.nOfCycles === undefined) {
      chrome.storage.local.set({ nOfCycles: initTimeConfig.nOfCycles });
    }
    if (result.focus === undefined) {
      chrome.storage.local.set({ focus: initTimeConfig.focus });
    }
    if (result.breakTime === undefined) {
      chrome.storage.local.set({ breakTime: initTimeConfig.breakTime });
    }
    if (result.block_domains === undefined) {
      chrome.storage.local.set({ block_domains: [] });
    }
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
  if (type === "start-ticking") {
    console.log("START TICKING ....", time, isBreak);
    const { time, isBreak } = payload;
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
      keepAlive(true);
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
            iconUrl: "./images/logo512.png",
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
    sendResponse();
    return true;
  }
  if (type === "press-halt-ticking") {
    chrome.storage.local.get(["intervalID"], function ({ intervalID }) {
      console.log("clear the intervalid by pressing the button");
      clearInterval(intervalID);
      chrome.storage.local.set({ intervalID: -1 });
    });
    sendResponse();
    return true;
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

let lifeline;

keepAlive(false); // dont have to run the port when ticking is not set

chrome.runtime.onConnect.addListener((port) => {
  if (port.name === "keepAlive") {
    console.log("the port listner is called ");
    lifeline = port;
    setTimeout(keepAliveForced, 30000); // 5 minutes minus 5 seconds
    port.onDisconnect.addListener(keepAliveForced);
  }
});

function keepAliveForced() {
  lifeline?.disconnect();
  lifeline = null;
  keepAlive(false);
}

async function keepAlive(forceRun) {
  const { ticking } = await chrome.storage.local.get("ticking");
  // no ticking and no force run -> not run
  if (!ticking && !forceRun) return; // when it is not ticking for a while -> keep alive will not run hte port will be closed
  if (lifeline) return;
  console.log("keep alive is called");
  for (const tab of await chrome.tabs.query({ url: "*://*/*" })) {
    try {
      await chrome.scripting.executeScript({
        target: { tabId: tab.id },
        function: () => chrome.runtime.connect({ name: "keepAlive" }),
      });
      chrome.tabs.onUpdated.removeListener(retryOnTabUpdate);
      return;
    } catch (e) {}
  }
  chrome.tabs.onUpdated.addListener(retryOnTabUpdate);
}

async function retryOnTabUpdate(tabId, info, tab) {
  if (info.url && /^(file|https?):/.test(info.url)) {
    keepAlive(false);
  }
}
function injectedFunction() {
  document.body.style.backgroundColor = "orange";
  const newAudioDiv = document.createElement("audio");
  newAudioDiv.id = "timer-audio-player-1";
  newAudioDiv.controls = "controls";
  newAudioDiv.src = "sound.mp3";
  newAudioDiv.type = "audio/mpeg";
  document.body.appendChild(newAudioDiv);
  console.log("CALLING THE INJECTED FUNCTION");
}

async function injectContentHtml() {
  // try all tabs until one tab works
  for (const tab of await chrome.tabs.query({ url: "*://*/*" })) {
    try {
      await chrome.scripting.executeScript({
        target: { tabId: tab.id },
        function: injectedFunction,
      });
      return;
    } catch (e) {}
  }
}

// injectContentHtml();
