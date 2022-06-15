let port;
console.log("CONNECT TO CONTENT SCRIPT");
function connect() {
  port = chrome.runtime.connect({ name: "foo" });
  port.onDisconnect.addListener(connect);
  port.onMessage.addListener((msg) => {
    console.log("received", msg, "from bg");
  });
}
connect();
