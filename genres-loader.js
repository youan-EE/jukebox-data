// genres-loader.js content:
const embeddedGenres = {
  "Electronic": ["House", "Techno", "Synthwave"],
  "Rock": ["Prog Rock", "Punk", "Glam"],
  "Metal": ["Heavy Metal", "Death Metal", "Black Metal"]
};

function initApp() {
  // First render with embedded data
  renderGenres(embeddedGenres);
  
  // Try loading live data if mmm.page allows
  if (window.mmm?.fetch) {
    window.mmm.fetch('https://raw.githubusercontent.com/youan-EE/jukebox-data/main/genres_flat.json')
      .then(res => res.json())
      .then(data => {
        renderGenres(transformData(data));
      })
      .catch(e => console.log("Using embedded data:", e));
  }
}

function transformData(flatGenres) {
  const hierarchy = {};
  flatGenres.forEach(item => {
    const [parent, child] = item.split(' › ');
    if (!hierarchy[parent]) hierarchy[parent] = [];
    if (child) hierarchy[parent].push(child);
  });
  return hierarchy;
}

function renderGenres(data) {
  const parentCol = document.querySelector('#parent-genres .crt-list');
  if (!parentCol) return;
  
  parentCol.innerHTML = '';
  Object.keys(data).forEach(genre => {
    const btn = document.createElement('button');
    btn.className = 'crt-item';
    btn.textContent = genre;
    btn.onclick = () => {
      document.querySelector('#subgenres .crt-list').innerHTML = 
        data[genre].map(sub => `<button class="crt-item">${sub}</button>`).join('');
    };
    parentCol.appendChild(btn);
  });
}

// Initialize when mmm.page is ready
if (window.mmm?.ready) {
  initApp();
} else {
  document.addEventListener('mmm-ready', initApp);
}