/* Routis prototype — business dashboard behaviour. */
(function () {
  const D = window.ROUTIS;
  const UI = window.RoutisUI;
  const $ = s => document.querySelector(s);

  UI.initSidebarToggle();

  // ---------- KPI sparklines ----------
  $('#spark1').innerHTML = UI.sparkline('#246BCE', [1, 1, 2, 1, 2, 2, 3]);
  $('#spark2').innerHTML = UI.sparkline('#F59E0B', [1, 2, 1, 1, 2, 1, 2]);
  $('#spark3').innerHTML = UI.sparkline('#1f9d55', [2, 3, 2, 3, 4, 3, 5]);

  // ---------- Alerts ----------
  $('#dashAlerts').innerHTML = D.alerts.map(UI.alertItemHTML).join('');

  let filter = 'all';
  function renderAllAlerts() {
    const list = D.alerts.filter(a => filter === 'all' || a.impact === filter);
    $('#allAlerts').innerHTML = list.length ? list.map(UI.alertItemHTML).join('') : '<p class="page-sub">No alerts in this category.</p>';
  }
  renderAllAlerts();
  $('#alertFilters').addEventListener('click', e => {
    const b = e.target.closest('[data-filter]');
    if (!b) return;
    filter = b.dataset.filter;
    document.querySelectorAll('#alertFilters .chip').forEach(c => c.classList.toggle('active', c === b));
    renderAllAlerts();
  });

  function showAlert(id) {
    const a = D.alerts.find(x => x.id === id);
    if (!a) return;
    location.hash = 'alerts';
    const box = $('#alertDetail');
    box.hidden = false;
    box.innerHTML = `
      <div style="display:flex;align-items:center;gap:12px;margin-bottom:10px">
        <h2 style="font-size:20px">${a.title}</h2><span class="badge ${a.impact}">${a.impactLabel}</span>
      </div>
      <p class="page-sub" style="display:flex;gap:6px;align-items:center">${UI.ICONS.clock}${a.dates} · ${a.agency}</p>
      <p>${a.description}</p>
      <div style="display:flex;gap:10px;flex-wrap:wrap">
        <a class="btn btn-primary" href="#routes">See alternative route</a>
        <button class="btn btn-outline" data-subscribe="${a.id}">Notify me of updates</button>
      </div>`;
    box.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }
  document.addEventListener('click', e => {
    const item = e.target.closest('[data-alert]');
    if (item) showAlert(item.dataset.alert);
    const sub = e.target.closest('[data-subscribe]');
    if (sub) UI.toast('You\'ll be notified about updates to this alert.');
  });
  document.addEventListener('keydown', e => {
    const item = e.target.closest && e.target.closest('[data-alert]');
    if (item && e.key === 'Enter') showAlert(item.dataset.alert);
  });

  // ---------- Customers ----------
  const statusBadge = { 'On Track': 'ok', 'Delayed': 'high', 'Rerouted': 'medium' };
  $('#customerRows').innerHTML = D.customers.map(c => `
    <tr><td><strong>${c.name}</strong></td><td>${c.area}</td><td>${c.orders}</td><td>${c.eta}</td>
    <td><span class="badge ${statusBadge[c.status]}">${c.status}</span></td></tr>`).join('');

  // ---------- Maps (lazy, since hidden views have zero size) ----------
  const maps = {};
  function ensureMap(id, opts) {
    if (!maps[id]) maps[id] = UI.createMap(document.getElementById(id), opts);
    setTimeout(() => maps[id].map.invalidateSize(), 0);
    return maps[id];
  }

  // ---------- Routes ----------
  let selectedRoute = D.routes.find(r => r.recommended).id;
  function renderRoutes() {
    $('#routeOptions').innerHTML = D.routes.map(r => `
      <div class="route-option ${r.id === selectedRoute ? 'active' : ''}" data-route="${r.id}">
        <strong>${r.name} <span>${r.eta} min</span></strong>
        <small>${r.km} km · ${r.note}</small>
        ${r.recommended ? '<span class="badge ok" style="justify-self:start;margin-top:4px">Recommended</span>' : '<span class="badge high" style="justify-self:start;margin-top:4px">Affected by road work</span>'}
      </div>`).join('');
    const m = maps.routeMap;
    if (m) {
      D.routes.forEach(r => m.routeLayers[r.id].setStyle({
        opacity: r.id === selectedRoute ? .95 : .35,
        color: r.id === selectedRoute ? '#246BCE' : '#8a97a8',
        weight: r.id === selectedRoute ? 6 : 4,
        dashArray: r.id === selectedRoute ? null : '6 8',
      }));
      m.routeLayers[selectedRoute].bringToFront();
    }
  }
  $('#routeOptions').addEventListener('click', e => {
    const o = e.target.closest('[data-route]');
    if (o) { selectedRoute = o.dataset.route; renderRoutes(); }
  });
  $('#shareRoute').addEventListener('click', () => {
    const r = D.routes.find(x => x.id === selectedRoute);
    UI.toast(`Route "${r.name}" sent to your rider.`);
  });

  // ---------- View routing ----------
  const VIEWS = ['dashboard', 'map', 'alerts', 'routes', 'customers', 'settings'];
  function route() {
    const v = VIEWS.includes(location.hash.slice(1)) ? location.hash.slice(1) : 'dashboard';
    VIEWS.forEach(n => document.getElementById('view-' + n).classList.toggle('active', n === v));
    document.querySelectorAll('.nav a').forEach(a => a.classList.toggle('active', a.dataset.view === v));
    if (v === 'dashboard') ensureMap('dashMap', { zoom: 15 });
    if (v === 'map') ensureMap('fullMap', { zoom: 15, scroll: true });
    if (v === 'routes') { ensureMap('routeMap', { zoom: 15, scroll: true }); renderRoutes(); }
    if (v !== 'alerts') $('#alertDetail').hidden = true;
    window.scrollTo(0, 0);
  }
  window.addEventListener('hashchange', route);
  route();

  // ---------- Search ----------
  const searchIndex = [
    ...D.alerts.map(a => ({ label: a.title, sub: a.dates, action: () => showAlert(a.id) })),
    ...D.routes.map(r => ({ label: 'Route ' + r.name, sub: `${r.eta} min · ${r.km} km`, action: () => { selectedRoute = r.id; location.hash = 'routes'; renderRoutes(); } })),
    ...D.customers.map(c => ({ label: c.name, sub: c.area, action: () => { location.hash = 'customers'; } })),
  ];
  const input = $('#search'), results = $('#searchResults');
  input.addEventListener('input', () => {
    const q = input.value.trim().toLowerCase();
    if (!q) { results.classList.remove('open'); return; }
    const hits = searchIndex.filter(s => (s.label + ' ' + s.sub).toLowerCase().includes(q)).slice(0, 6);
    results.innerHTML = hits.length
      ? hits.map((h, i) => `<button data-i="${searchIndex.indexOf(h)}">${h.label}<small>${h.sub}</small></button>`).join('')
      : '<button disabled>No matches</button>';
    results.classList.add('open');
  });
  results.addEventListener('click', e => {
    const b = e.target.closest('[data-i]');
    if (!b) return;
    searchIndex[+b.dataset.i].action();
    results.classList.remove('open');
    input.value = '';
  });
  document.addEventListener('click', e => { if (!e.target.closest('.search')) results.classList.remove('open'); });

  $('#bell').addEventListener('click', () => { location.hash = 'alerts'; });
})();
