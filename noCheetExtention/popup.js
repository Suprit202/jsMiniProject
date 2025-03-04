document.getElementById("lock").addEventListener("click", () => {
  chrome.runtime.sendMessage({ action: "lockTabs" }, (response) => {
    alert(response.status);
  });
});

document.getElementById("unlock").addEventListener("click", () => {
  const password = document.getElementById("password").value.trim(); // Trim whitespace
  console.log("Sending Password:", password); // Debugging

  chrome.runtime.sendMessage({ action: "unlockTabs", password }, (response) => {
    const message = document.getElementById("message");
    if (response.status === "Tabs unlocked") {
      message.textContent = "";
      alert("Tabs unlocked successfully!");
    } else {
      message.textContent = "You will never get a place in hell also :)";
    }
  });
});