// Load saved headers when popup opens
document.addEventListener("DOMContentLoaded", () => {
  chrome.storage.local.get(["url", "headers"], (data) => {
    if (data.url) document.getElementById("url").value = data.url;
    if (data.headers) {
      data.headers.forEach(h => addHeaderRow(h.name, h.value));
    }
  });
});

function addHeaderRow(name = "", value = "") {
  const div = document.createElement("div");
  div.innerHTML = `
    <input type="text" placeholder="Header Name" class="headerName" value="${name}">
    <input type="text" placeholder="Header Value" class="headerValue" value="${value}">
  `;
  document.getElementById("headers").appendChild(div);
}

document.getElementById("addHeader").addEventListener("click", () => addHeaderRow());

document.getElementById("submit").addEventListener("click", () => {
  const url = document.getElementById("url").value;
  const names = document.querySelectorAll(".headerName");
  const values = document.querySelectorAll(".headerValue");

  let headers = [];
  for (let i = 0; i < names.length; i++) {
    if (names[i].value && values[i].value) {
      headers.push({ name: names[i].value, value: values[i].value });
    }
  }

  chrome.storage.local.set({ url, headers }, () => {
    document.getElementById("message").innerText = "Success!";
    chrome.runtime.sendMessage({ action: "updateRules" });
  });
});

document.getElementById("disable").addEventListener("click", () => {
  chrome.storage.local.remove(["url", "headers"], () => {
    document.getElementById("message").innerText = "Headers Disabled!";
    chrome.runtime.sendMessage({ action: "disableRules" });
  });
});