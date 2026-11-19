/* Routis prototype — shared helpers (icons, map, alerts, toast). */
(function () {
  const D = window.ROUTIS;

  const ICONS = {
    work: '<svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2 1 21h22L12 2zm0 6.5 5.6 10.5H6.4L12 8.5z"/><path d="M11 11h2v4h-2zm0 5h2v2h-2z"/></svg>',
    closure: '<svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor"><circle cx="12" cy="12" r="10"/><rect x="6" y="10.5" width="12" height="3" rx="1" fill="#fff"/></svg>',
    event: '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="5" width="18" height="16" rx="2"/><path d="M3 10h18M8 3v4M16 3v4"/><path d="M8 14h3v3H8z" fill="currentColor"/></svg>',
    clock: '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></svg>',
  };

  const COLORS = { high: '#E34B4B', medium: '#E34B4B', work: '#F59E0B', closure: '#E34B4B', route: '#246BCE' };

  function pinIcon(kind) {
    const svgs = {
      closure: '<svg width="34" height="34" viewBox="0 0 34 34"><circle cx="17" cy="17" r="15" fill="#E34B4B" stroke="#fff" stroke-width="3"/><rect x="9" y="15" width="16" height="4" rx="1" fill="#fff"/></svg>',
      work: '<svg width="36" height="34" viewBox="0 0 36 34"><path d="M18 2 2 31h32z" fill="#F59E0B" stroke="#fff" stroke-width="3" stroke-linejoin="round"/><path d="M17 12h2v9h-2zm0 11h2v3h-2z" fill="#14243A"/></svg>',
      event: '<svg width="32" height="32" viewBox="0 0 32 32"><circle cx="16" cy="16" r="14" fill="#246BCE" stroke="#fff" stroke-width="3"/><text x="16" y="21" text-anchor="middle" font-size="14" font-weight="700" fill="#fff" font-family="Inter,sans-serif">i</text></svg>',
      dest: '<svg width="34" height="44" viewBox="0 0 34 44"><path d="M17 2C9 2 2 8.5 2 17c0 11 15 25 15 25s15-14 15-25C32 8.5 25 2 17 2z" fill="#246BCE" stroke="#fff" stroke-width="3"/><circle cx="17" cy="17" r="6" fill="#fff"/></svg>',
      destRed: '<svg width="30" height="40" viewBox="0 0 34 44"><path d="M17 2C9 2 2 8.5 2 17c0 11 15 25 15 25s15-14 15-25C32 8.5 25 2 17 2z" fill="#E34B4B" stroke="#fff" stroke-width="3"/><circle cx="17" cy="17" r="6" fill="#fff"/></svg>',
      origin: '<svg width="22" height="22" viewBox="0 0 22 22"><circle cx="11" cy="11" r="8" fill="#14243A" stroke="#fff" stroke-width="3"/></svg>',
    };
    const anchors = { dest: [17, 42], destRed: [15, 38] };
    const sizes = { dest: [34, 44], destRed: [30, 40], work: [36, 34], origin: [22, 22] };
    const size = sizes[kind] || [34, 34];
    return L.divIcon({
      className: 'pin-icon', html: svgs[kind], iconSize: size,
      iconAnchor: anchors[kind] || [size[0] / 2, size[1] / 2],
    });
  }

  /** Create a Leaflet map with alerts + routes drawn. Returns { map, routeLayers }. */
  function createMap(el, opts = {}) {
    const map = L.map(el, { zoomControl: true, scrollWheelZoom: opts.scroll ?? false }).setView(D.center, opts.zoom || 15);
    L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
      attribution: '&copy; OpenStreetMap contributors &copy; CARTO', maxZoom: 19,
    }).addTo(map);

    D.alerts.forEach(a => {
      if (a.path) {
        L.polyline(a.path, { color: a.type === 'work' ? COLORS.work : COLORS.closure, weight: 6, opacity: .9 }).addTo(map);
      }
      if (opts.showEvents !== false || a.type !== 'event') {
        L.marker(a.marker, { icon: pinIcon(a.type) }).addTo(map)
          .bindPopup(`<strong>${a.title}</strong><br><small>${a.dates}</small><p style="margin:6px 0 0">${a.description}</p>`);
      }
    });

    const routeLayers = {};
    if (opts.routes !== false) {
      D.routes.forEach(r => {
        routeLayers[r.id] = L.polyline(r.path, {
          color: COLORS.route, weight: r.recommended ? 6 : 4, opacity: r.recommended ? .95 : 0,
          dashArray: r.recommended ? null : '6 8',
        }).addTo(map);
      });
      L.marker(D.origin.at, { icon: pinIcon('origin') }).addTo(map).bindPopup(D.origin.name);
      L.marker(D.destination.at, { icon: pinIcon('dest') }).addTo(map).bindPopup(D.destination.name);
    }
    return { map, routeLayers };
  }

  function alertItemHTML(a) {
    return `
      <div class="alert-item ${a.impact}" data-alert="${a.id}" tabindex="0">
        <div class="ico">${ICONS[a.type]}</div>
        <div>
          <h3>${a.title}</h3>
          <p>${a.type === 'event' ? '' : ICONS.clock}${a.dates}</p>
        </div>
        <span class="badge ${a.impact}">${a.impactLabel}</span>
      </div>`;
  }

  function sparkline(color, points) {
    const w = 90, h = 40, max = Math.max(...points), min = Math.min(...points);
    const xy = points.map((p, i) => [i * (w / (points.length - 1)), h - 4 - ((p - min) / (max - min || 1)) * (h - 10)]);
    const d = xy.map((p, i) => (i ? 'L' : 'M') + p[0].toFixed(1) + ' ' + p[1].toFixed(1)).join(' ');
    const id = 'g' + Math.random().toString(36).slice(2, 7);
    return `<svg class="spark" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}">
      <defs><linearGradient id="${id}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${color}" stop-opacity=".25"/><stop offset="1" stop-color="${color}" stop-opacity="0"/></linearGradient></defs>
      <path d="${d} L${w} ${h} L0 ${h}Z" fill="url(#${id})"/>
      <path d="${d}" fill="none" stroke="${color}" stroke-width="2" stroke-linecap="round"/></svg>`;
  }

  let toastTimer;
  function toast(msg) {
    let t = document.querySelector('.toast');
    if (!t) { t = document.createElement('div'); t.className = 'toast'; document.body.appendChild(t); }
    t.textContent = msg;
    t.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => t.classList.remove('show'), 2600);
  }

  function initSidebarToggle() {
    const btn = document.querySelector('.menu-btn');
    const sb = document.querySelector('.sidebar');
    if (!btn || !sb) return;
    btn.addEventListener('click', () => sb.classList.toggle('open'));
    sb.addEventListener('click', e => { if (e.target.closest('a')) sb.classList.remove('open'); });
  }

  window.RoutisUI = { ICONS, createMap, alertItemHTML, sparkline, toast, pinIcon, initSidebarToggle };
})();
