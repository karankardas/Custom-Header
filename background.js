const RULE_BASE = 1000; // stable base ID

function applyRules() {
  chrome.storage.local.get(["url", "headers"], (data) => {
    if (!data.url || !data.headers) return;

    const rules = data.headers.map((h, i) => ({
      id: RULE_BASE + i,
      priority: 1,
      action: {
        type: "modifyHeaders",
        requestHeaders: [
          { header: h.name, operation: "set", value: h.value }
        ]
      },
      condition: {
        urlFilter: data.url,
        resourceTypes: ["main_frame","sub_frame","stylesheet","script","image","font","media","object","xmlhttprequest","ping","csp_report","websocket","other"]
      }
    }));

    chrome.declarativeNetRequest.updateDynamicRules({
      removeRuleIds: rules.map(r => r.id),
      addRules: rules
    });
  });
}

chrome.runtime.onMessage.addListener((msg) => {
  if (msg.action === "updateRules") {
    applyRules();
  }
  if (msg.action === "disableRules") {
    // remove all rules in our ID range
    const ids = Array.from({ length: 50 }, (_, i) => RULE_BASE + i);
    chrome.declarativeNetRequest.updateDynamicRules({ removeRuleIds: ids });
  }
});

// Reapply rules when extension starts
chrome.runtime.onStartup.addListener(() => {
  applyRules();
});