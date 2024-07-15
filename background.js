chrome.runtime.onInstalled.addListener(() => {
  chrome.storage.sync.get(['blockedSites', 'allowedSites'], (result) => {
    if (!result.blockedSites) {
      chrome.storage.sync.set({ blockedSites: [] });
    }
    if (!result.allowedSites) {
      chrome.storage.sync.set({ allowedSites: [] });
    }
    updateRules(result.blockedSites || [], result.allowedSites || []);
  });
});

chrome.storage.onChanged.addListener((changes, namespace) => {
  if (changes.blockedSites || changes.allowedSites) {
    chrome.storage.sync.get(['blockedSites', 'allowedSites'], (result) => {
      updateRules(result.blockedSites || [], result.allowedSites || []);
    });
  }
});

function updateRules(blockedSites, allowedSites) {
  const blockAllRule = {
    id: 1,
    priority: 1,
    action: { type: 'block' },
    condition: { urlFilter: '*://*/*', resourceTypes: ['main_frame'] }
  };

  const allowRules = allowedSites.map((site, index) => ({
    id: index + 2,
    priority: 2,
    action: { type: 'allow' },
    condition: { urlFilter: site, resourceTypes: ['main_frame'] }
  }));

  const rules = [blockAllRule, ...allowRules];

  chrome.declarativeNetRequest.updateDynamicRules({
    removeRuleIds: Array.from({ length: 1000 }, (_, i) => i + 1), // Remover até 1000 regras anteriores
    addRules: rules
  });
}
