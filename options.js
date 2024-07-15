document.addEventListener('DOMContentLoaded', () => {
    const siteInput = document.getElementById('siteInput');
    const addSite = document.getElementById('addSite');
    const blockAll = document.getElementById('blockAll');
    const allowSiteInput = document.getElementById('allowSiteInput');
    const allowSite = document.getElementById('allowSite');
    const siteList = document.getElementById('siteList');
    const allowList = document.getElementById('allowList');
    const feedback = document.getElementById('feedback');
  
    const renderList = (sites, listElement) => {
      listElement.innerHTML = '';
      sites.forEach(site => {
        const li = document.createElement('li');
        li.textContent = site;
        const button = document.createElement('button');
        button.textContent = 'Remover';
        button.onclick = () => removeSite(site, listElement);
        li.appendChild(button);
        listElement.appendChild(li);
      });
    };
  
    const updateStorage = (key, sites) => {
      chrome.storage.sync.set({ [key]: sites }, () => {
        console.log(`${key} updated:`, sites);
        feedback.textContent = 'Atualização bem-sucedida!';
        setTimeout(() => feedback.textContent = '', 2000);
      });
    };
  
    const loadSites = () => {
      chrome.storage.sync.get(['blockedSites', 'allowedSites'], (result) => {
        const blockedSites = result.blockedSites || [];
        const allowedSites = result.allowedSites || [];
        renderList(blockedSites, siteList);
        renderList(allowedSites, allowList);
      });
    };
  
    const addNewSite = () => {
      const newSite = siteInput.value.trim();
      if (newSite) {
        chrome.storage.sync.get(['blockedSites'], (result) => {
          const sites = result.blockedSites || [];
          if (!sites.includes(newSite)) {
            sites.push(newSite);
            updateStorage('blockedSites', sites);
            renderList(sites, siteList);
            feedback.textContent = `Site ${newSite} adicionado com sucesso!`;
          } else {
            feedback.textContent = `Site ${newSite} já está na lista!`;
          }
          setTimeout(() => feedback.textContent = '', 2000);
        });
        siteInput.value = '';
      }
    };
  
    const removeSite = (site, listElement) => {
      const key = listElement === siteList ? 'blockedSites' : 'allowedSites';
      chrome.storage.sync.get([key], (result) => {
        const sites = result[key] || [];
        const newSites = sites.filter(s => s !== site);
        updateStorage(key, newSites);
        renderList(newSites, listElement);
        feedback.textContent = `Site ${site} removido com sucesso!`;
        setTimeout(() => feedback.textContent = '', 2000);
      });
    };
  
    const allowNewSite = () => {
      const newSite = allowSiteInput.value.trim();
      if (newSite) {
        chrome.storage.sync.get(['allowedSites'], (result) => {
          const sites = result.allowedSites || [];
          if (!sites.includes(newSite)) {
            sites.push(newSite);
            updateStorage('allowedSites', sites);
            renderList(sites, allowList);
            feedback.textContent = `Site ${newSite} liberado com sucesso!`;
          } else {
            feedback.textContent = `Site ${newSite} já está na lista de liberados!`;
          }
          setTimeout(() => feedback.textContent = '', 2000);
        });
        allowSiteInput.value = '';
      }
    };
  
    const blockAllSites = () => {
      chrome.storage.sync.set({ blockedSites: ['*://*/*'] }, () => {
        renderList(['*://*/*'], siteList);
        feedback.textContent = 'Todos os sites foram bloqueados!';
        setTimeout(() => feedback.textContent = '', 2000);
      });
    };
  
    addSite.onclick = addNewSite;
    blockAll.onclick = blockAllSites;
    allowSite.onclick = allowNewSite;
    loadSites();
});
