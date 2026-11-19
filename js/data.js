/* Routis prototype — mock data.
   Coordinates are approximate and for demo purposes only. */
window.ROUTIS = {
  center: [16.4120, 120.5990],

  user: { name: 'Juan Dela Cruz', business: 'Cafe Panorama', initials: 'JD' },

  alerts: [
    {
      id: 'session-road',
      title: 'Session Road – Road Work',
      type: 'work',            // work | closure | event
      impact: 'high',          // high | medium | info
      impactLabel: 'High Impact',
      dates: 'Nov 15 – Nov 25, 2026',
      agency: 'DPWH Baguio City District',
      description: 'Drainage and asphalt overlay. One lane open, expect 20–30 min delays from 7 AM to 7 PM.',
      path: [[16.4133, 120.5953], [16.4120, 120.5966], [16.4108, 120.5980], [16.4096, 120.5995]],
      marker: [16.4115, 120.5972],
      active: true,
    },
    {
      id: 'magsaysay',
      title: 'Magsaysay Avenue – Closed',
      type: 'closure',
      impact: 'medium',
      impactLabel: 'Medium',
      dates: 'Nov 16 – Nov 20, 2026',
      agency: 'City Engineering Office',
      description: 'Full closure for water line replacement. Use Bonifacio Street or Kayang Street.',
      path: [[16.4142, 120.5949], [16.4168, 120.5953], [16.4195, 120.5958], [16.4222, 120.5965]],
      marker: [16.4180, 120.5955],
      active: true,
    },
    {
      id: 'panagbenga',
      title: 'Panagbenga Festival',
      type: 'event',
      impact: 'info',
      impactLabel: 'Info',
      dates: 'Feb 2027 – Expect heavy traffic',
      agency: 'Baguio City Tourism Office',
      description: 'Grand street parade and float parade along Session Road and Harrison Road. Plan deliveries before 6 AM.',
      path: null,
      marker: [16.4105, 120.5935],
      active: false,
    },
  ],

  routes: [
    {
      id: 'leonard-wood',
      name: 'via Leonard Wood Road',
      eta: 12, km: 3.4, recommended: true,
      note: 'Avoids Session Road works',
      path: [[16.4080, 120.5940], [16.4066, 120.5972], [16.4074, 120.6008], [16.4094, 120.6038], [16.4116, 120.6060], [16.4150, 120.6080]],
    },
    {
      id: 'session',
      name: 'via Session Road',
      eta: 31, km: 2.6, recommended: false,
      note: 'Road work — heavy delays',
      path: [[16.4080, 120.5940], [16.4133, 120.5953], [16.4108, 120.5980], [16.4096, 120.5995], [16.4128, 120.6040], [16.4150, 120.6080]],
    },
  ],

  origin: { name: 'Cafe Panorama (Harrison Rd)', at: [16.4080, 120.5940] },
  destination: { name: 'Customer — Teachers Camp', at: [16.4150, 120.6080] },

  customers: [
    { name: 'Maria Santos', area: 'Teachers Camp', orders: 14, status: 'On Track', eta: '12 min' },
    { name: 'Hotel Veniz', area: 'Session Road', orders: 31, status: 'Delayed', eta: '35 min' },
    { name: 'Camp John Hay Office', area: 'Loakan Road', orders: 9, status: 'On Track', eta: '18 min' },
    { name: 'Rafael Lim', area: 'Magsaysay Avenue', orders: 5, status: 'Rerouted', eta: '22 min' },
    { name: 'SLU Faculty Lounge', area: 'Bonifacio Street', orders: 22, status: 'On Track', eta: '9 min' },
  ],
};
