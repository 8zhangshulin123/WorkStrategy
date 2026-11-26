(() => {
  const browser = document.querySelector('.tier-browser');
  const panelList = browser.querySelector('.conversion-grid');
  const tabList = browser.querySelector('.tier-tabs');
  const panels = [...panelList.children];
  const desktop = matchMedia('(min-width: 761px)');
  const tabs = panels.map(panel => {
    const tab = document.createElement('button');
    const level = document.createElement('span');
    const title = document.createElement('span');

    tab.type = 'button';
    tab.id = panel.id + '-tab';
    tab.className = 'tier-tab';
    tab.setAttribute('role', 'tab');
    tab.setAttribute('aria-controls', panel.id);
    level.className = 'tier-tab-level';
    level.textContent = panel.querySelector('.tier-level').textContent;
    title.className = 'tier-tab-title';
    title.textContent = panel.querySelector('h3').textContent;
    tab.append(level, title);

    panel.setAttribute('role', 'tabpanel');
    panel.setAttribute('aria-labelledby', tab.id);
    panel.tabIndex = 0;
    return tab;
  });

  function select(index) {
    tabs.forEach((tab, position) => {
      const active = position === index;
      tab.setAttribute('aria-selected', String(active));
      tab.tabIndex = active ? 0 : -1;
      panels[position].hidden = !active;
    });
  }

  function navigateTo(index) {
    select(index);
    history.replaceState(null, '', '#' + panels[index].id);
  }

  function selectFromHash() {
    const index = panels.findIndex(panel => location.hash === '#' + panel.id);
    if (index < 0) return;
    select(index);
    browser.scrollIntoView({ block: 'start', behavior: 'instant' });
  }

  function setOrientation() {
    tabList.setAttribute('aria-orientation', desktop.matches ? 'vertical' : 'horizontal');
  }

  tabList.setAttribute('role', 'tablist');
  tabList.setAttribute('aria-label', '影视内容转化的四种形式');
  panelList.removeAttribute('aria-label');
  panelList.setAttribute('role', 'presentation');
  tabs.forEach((tab, index) => {
    tab.addEventListener('click', () => navigateTo(index));
    tab.addEventListener('keydown', event => {
      const previous = desktop.matches ? 'ArrowUp' : 'ArrowLeft';
      const next = desktop.matches ? 'ArrowDown' : 'ArrowRight';
      let target;
      switch (event.key) {
        case previous: target = (index - 1 + tabs.length) % tabs.length; break;
        case next: target = (index + 1) % tabs.length; break;
        case 'Home': target = 0; break;
        case 'End': target = tabs.length - 1; break;
        default: return;
      }
      event.preventDefault();
      navigateTo(target);
      tabs[target].focus();
    });
  });

  tabList.append(...tabs);
  setOrientation();
  desktop.addEventListener('change', setOrientation);
  select(0);
  browser.dataset.enhanced = '';
  tabList.hidden = false;
  selectFromHash();
  addEventListener('hashchange', selectFromHash);
})();
