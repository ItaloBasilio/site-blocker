document.addEventListener('DOMContentLoaded', () => {
    const siteInput = document.getElementById('siteInput');
    const addSite = document.getElementById('addSite');
    const blockAll = document.getElementById('blockAll');
    const siteList = document.getElementById('siteList');
    const feedback = document.getElementById('feedback');
  
    const renderList = (sites) => {
      siteList.innerHTML = '';
      sites.forEach(site => {
        const li = document.createElement('li');
        li.textContent = site;
        const button = document.createElement('button');
        button.textContent = 'Remover';
        button.onclick = () => removeSite(site);
        li.appendChild(button);
        siteList.appendChild(li);
      });
    };
  
    const updateStorage = (sites) => {
      chrome.storage.sync.set({ blockedSites: sites }, () => {
        console.log('Blocked sites updated:', sites);
        feedback.textContent = 'Atualização bem-sucedida!';
        setTimeout(() => feedback.textContent = '', 2000);
      });
    };
  
    const loadSites = () => {
      chrome.storage.sync.get(['blockedSites'], (result) => {
        const sites = result.blockedSites || [];
        renderList(sites);
      });
    };
  
    const addNewSite = () => {
      const newSite = siteInput.value.trim();
      if (newSite) {
        chrome.storage.sync.get(['blockedSites'], (result) => {
          const sites = result.blockedSites || [];
          if (!sites.includes(newSite)) {
            sites.push(newSite);
            updateStorage(sites);
            renderList(sites);
            feedback.textContent = `Site ${newSite} adicionado com sucesso!`;
          } else {
            feedback.textContent = `Site ${newSite} já está na lista!`;
          }
          setTimeout(() => feedback.textContent = '', 2000);
        });
        siteInput.value = '';
      }
    };
  
    const removeSite = (site) => {
      chrome.storage.sync.get(['blockedSites'], (result) => {
        const sites = result.blockedSites || [];
        const newSites = sites.filter(s => s !== site);
        updateStorage(newSites);
        renderList(newSites);
        feedback.textContent = `Site ${site} removido com sucesso!`;
        setTimeout(() => feedback.textContent = '', 2000);
      });
    };
  
    const blockAllSites = () => {
      chrome.storage.sync.set({ blockedSites: ['*://*/*'] }, () => {
        renderList(['*://*/*']);
        feedback.textContent = 'Todos os sites foram bloqueados!';
        setTimeout(() => feedback.textContent = '', 2000);
      });
    };
  
    addSite.onclick = addNewSite;
    blockAll.onclick = blockAllSites;
    loadSites();
  });
  