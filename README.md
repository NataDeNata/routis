# Routis — prototype

> Know the road. Keep your business moving.

Routis is a public construction-works alert service for businesses in Baguio City. It shows road works, closures and events that affect deliveries, and suggests alternative routes.

This repo is a **static, clickable prototype** (plain HTML/CSS/JS, no build step).

## Pages

| Page | What it shows |
|---|---|
| `index.html` | Log in. Pick **Business owner** or **Delivery rider** to choose which dashboard opens. |
| `dashboard.html` | Business dashboard with KPIs, a live map, disruption alerts and a suggested action. The sidebar switches between Map, Alerts, Routes, Customers and Settings. |
| `rider.html` | Rider view with route status, ETA, and a simulated drive along the alternative route. |

## Run locally

Open `index.html` in a browser, or serve the folder:

```sh
npx serve .
# or
python -m http.server 8000
```

Maps use Leaflet with CARTO/OpenStreetMap tiles, so they need an internet connection.

## Structure

```
css/styles.css     design tokens (brand palette) and all styles
js/data.js         mock alerts, routes and customers (approximate coordinates)
js/app.js          shared helpers: map, markers, alert cards, toast
js/dashboard.js    business dashboard behaviour
assets/            logo (PNG, full + mark) and illustration SVG
```

## Brand palette

| Name | Hex |
|---|---|
| Routis Navy | `#14243A` |
| Road Blue | `#246BCE` |
| Alert Orange | `#F59E0B` |
| Alert Red | `#E34B4B` |
| Background | `#F5F7FA` |
