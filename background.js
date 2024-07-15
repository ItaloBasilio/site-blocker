chrome.runtime.onInstalled.addListener(() => {
  chrome.storage.sync.get(['blockedSites'], (result) => {
    if (!result.blockedSites) {
      chrome.storage.sync.set({ blockedSites: [] });
    }
    updateRules(result.blockedSites || []);
  });
});

chrome.storage.onChanged.addListener((changes, namespace) => {
  if (changes.blockedSites) {
    updateRules(changes.blockedSites.newValue);
  }
});

function updateRules(blockedSites) {
  const rules = blockedSites.map((site, index) => ({
    id: index + 1,
    priority: 1,
    action: { type: 'block' },
    condition: { urlFilter: site, resourceTypes: ['main_frame'] }
  }));

  chrome.declarativeNetRequest.updateDynamicRules({
    removeRuleIds: Array.from({ length: 1000 }, (_, i) => i + 1), // Remover até 1000 regras anteriores
    addRules: rules
  });
}
