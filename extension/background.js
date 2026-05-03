let currentTab = null;
let startTime = Date.now();

const userId = "69f746fd9c772b72ff1b2e79"

// 🔥 Send data
function sendData(url, timeSpent) {
  if (!url || url.startsWith("chrome://")) return;

  console.log("Sending:", url, timeSpent);

  fetch("http://localhost:5000/track", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      url,
      timeSpent,
      userId
    })
  })
    .then(res => res.text())
    .then(data => console.log("SUCCESS:", data))
    .catch(err => console.error("ERROR:", err));
}

// 🔥 When tab switches
chrome.tabs.onActivated.addListener(async (activeInfo) => {
  const tab = await chrome.tabs.get(activeInfo.tabId);

  if (currentTab) {
    const timeSpent = Date.now() - startTime;
    sendData(currentTab.url, timeSpent);
  }

  currentTab = tab;
  startTime = Date.now();
});

// 🔥 When URL changes (CRITICAL FIX)
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.status === "complete" && tab.active) {

    if (currentTab) {
      const timeSpent = Date.now() - startTime;
      sendData(currentTab.url, timeSpent);
    }

    currentTab = tab;
    startTime = Date.now();
  }
});

// 🔥 When tab closes
chrome.tabs.onRemoved.addListener(() => {
  if (currentTab) {
    const timeSpent = Date.now() - startTime;
    sendData(currentTab.url, timeSpent);
  }
});