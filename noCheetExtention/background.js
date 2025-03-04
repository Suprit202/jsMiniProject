let isLocked = false;
let allowedTabId = null;
const correctPassword = "abcd";

// Listen for tab switches
chrome.tabs.onActivated.addListener((activeInfo) => {
  if (isLocked && activeInfo.tabId !== allowedTabId) {
    // Revert to the allowed tab
    chrome.tabs.update(allowedTabId, { active: true });

    // Show a notification
    chrome.notifications.create({
      type: "basic",
      iconUrl: "icon48.png",
      title: "Tab Switching Blocked",
      message: "Switching tabs is not allowed during the exam."
    });
  }
});

// Listen for new tab creation
chrome.tabs.onCreated.addListener((tab) => {
  if (isLocked) {
    // Close the newly created tab
    chrome.tabs.remove(tab.id);

    // Show a notification
    chrome.notifications.create({
      type: "basic",
      iconUrl: "icon48.png",
      title: "New Tab Blocked",
      message: "Creating new tabs is not allowed during the exam."
    });
  }
});

// Listen for messages from the popup
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "lockTabs") {
    // Get the current active tab
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      if (tabs.length > 0) {
        isLocked = true;
        allowedTabId = tabs[0].id; // Set the current tab as the allowed tab
        sendResponse({ status: "Tabs locked" });
      } else {
        sendResponse({ status: "No active tab found" });
      }
    });
    return true; // Required to use sendResponse asynchronously
  } else if (request.action === "unlockTabs") {
    // isLocked = false;
    // allowedTabId = null; // Reset the allowed tab
    // sendResponse({ status: "Tabs unlocked" });
    const enteredPassword = request.password.trim();
    if (enteredPassword === correctPassword) {
      isLocked = false;
      allowedTabId = null; // Reset the allowed tab
      sendResponse({ status: "Tabs unlocked" });
    } else {
      sendResponse({ status: "Incorrect password" });
    }
  }
});