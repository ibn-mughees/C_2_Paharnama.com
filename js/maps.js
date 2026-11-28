'use strict';

const SVG_NS = 'http://www.w3.org/2000/svg';

// Exact projection from images/npakistan_maps_taha.svg (viewBox="20 5 2220 1000")
function projectCoord(lat, lon) {
  return {
    x: Number(((lon - 60.5) * 118.1098).toFixed(1)),
    y: Number(((37.3 - lat) * 135.8263).toFixed(1))
  };
}

// Default starting location: Islamabad only
const ORIGIN_CITY = {
  name: 'Islamabad (You)',
  coords: projectCoord(33.6844, 73.0479)
};

// Three selectable Northern Pakistan routes from Islamabad
const ROUTES = [
  {
    id: 'chitral',
    name: 'Chitral',
    regionLabel: 'Top Left Route',
    distanceApprox: '~415 km from Islamabad',
    duration: '5 Days · 4 Stops',
    cost: 'PKR 70,000 ($250)',
    image: '../images/chitral_maps_taha.jpg',
    imageAlt: 'Evening view of Chitral Valley, river bridge, runway, and snow-dusted mountains',
    summary: 'Cross Malakand and the Lowari Tunnel into Chitral Valley and the Kalash foothills.',
    services: [
      'Private Coaster / 4x4 transfer from Islamabad',
      'Verified valley guesthouse & hotel stays',
      'Local Chitral & Kalash cultural guide',
      'Daily breakfast and sightseeing stops'
    ],
    stops: [
      { name: 'Chakdara', coords: projectCoord(34.665, 72.025) },
      { name: 'Upper Dir', coords: projectCoord(35.207, 71.877) },
      { name: 'Lowari Tunnel', coords: projectCoord(35.554, 71.800) },
      { name: 'Chitral', coords: projectCoord(35.8518, 71.7864), isDestination: true }
    ],
    labelOffset: { dx: -24, dy: -28, anchor: 'end' }
  },
  {
    id: 'gilgit',
    name: 'Gilgit',
    regionLabel: 'Middle Route',
    distanceApprox: '~510 km from Islamabad',
    duration: '6 Days · 5 Stops',
    cost: 'PKR 85,000 ($304)',
    image: '../images/giglit_maps_taha.jpg',
    imageAlt: 'Wooden gazebo and mountain backdrop in Gilgit Valley',
    summary: 'Follow the Kaghan-Babusar corridor past alpine meadows and the Nanga Parbat viewpoint to Gilgit.',
    services: [
      '4x4 Jeep included for high-altitude stretches',
      'Verified mountain hotels in Naran & Gilgit',
      'Experienced northern route guide',
      'Highway transfers and viewpoint stops'
    ],
    stops: [
      { name: 'Mansehra', coords: projectCoord(34.331, 73.198) },
      { name: 'Naran', coords: projectCoord(34.909, 73.650) },
      { name: 'Babusar Top', coords: projectCoord(35.420, 74.097) },
      { name: 'Gilgit', coords: projectCoord(35.9208, 74.3080), isDestination: true }
    ],
    labelOffset: { dx: 0, dy: -32, anchor: 'middle' }
  },
  {
    id: 'skardu',
    name: 'Skardu',
    regionLabel: 'Right Route',
    distanceApprox: '~630 km from Islamabad',
    duration: '7 Days · 6 Stops',
    cost: 'PKR 95,000 ($339)',
    image: '../images/skardu_maps_taha.jpg',
    imageAlt: 'Upper Kachura Lake and autumn mountains in Skardu, Baltistan',
    summary: 'Journey north-east toward Astore and Kachura Lakes into the heart of Skardu and Baltistan.',
    services: [
      '4x4 Jeep included for valley & lake excursions',
      'Verified lakeside resort & hotel stays',
      'Dedicated Baltistan mountain guide',
      'Breakfast and all inter-valley transfers'
    ],
    stops: [
      { name: 'Kohala', coords: projectCoord(34.115, 73.495) },
      { name: 'Astore', coords: projectCoord(35.366, 74.855) },
      { name: 'Kachura Lakes', coords: projectCoord(35.427, 75.448) },
      { name: 'Skardu', coords: projectCoord(35.2971, 75.6333), isDestination: true }
    ],
    labelOffset: { dx: 26, dy: 8, anchor: 'start' }
  }
];

function createSvgElement(tag, attrs) {
  const el = document.createElementNS(SVG_NS, tag);
  Object.entries(attrs).forEach(function ([key, value]) {
    el.setAttribute(key, String(value));
  });
  return el;
}

/**
 * Sticky scroll-up header behavior matching index.html.
 */
function initSmartStickyHeader() {
  const header = document.getElementById('siteHeader');
  if (!header) return;

  let lastScrollY = window.scrollY;

  window.addEventListener(
    'scroll',
    function () {
      const currentY = window.scrollY;
      const headerHeight = header.offsetHeight;
      const mobileMenuOpen = Boolean(document.querySelector('#mainNavbar.show'));
      const dropdownOpen = Boolean(header.querySelector('.dropdown-menu.show'));

      if (currentY <= 10 || mobileMenuOpen || dropdownOpen) {
        header.classList.remove('header-hidden');
      } else if (currentY > lastScrollY && currentY > headerHeight) {
        header.classList.add('header-hidden');
      } else if (currentY < lastScrollY) {
        header.classList.remove('header-hidden');
      }

      lastScrollY = currentY;
    },
    { passive: true }
  );
}

/**
 * Render the 3 interactive routes onto #mapRoutesOverlay and wire hover + left-click selection.
 */
function initInteractiveMap() {
  const overlay = document.getElementById('mapRoutesOverlay');
  const previewEmpty = document.getElementById('routePreviewEmpty');
  const previewCard = document.getElementById('routePreviewCard');
  if (!overlay || !previewEmpty || !previewCard) return;

  let selectedRouteId = null;

  ROUTES.forEach(function (route) {
    const allPoints = [ORIGIN_CITY.coords].concat(
      route.stops.map(function (stop) {
        return stop.coords;
      })
    );
    const pointsAttr = allPoints
      .map(function (pt) {
        return `${pt.x},${pt.y}`;
      })
      .join(' ');

    const group = createSvgElement('g', {
      class: 'map-route-group',
      'data-route-id': route.id,
      tabindex: '0',
      role: 'button',
      'aria-pressed': 'false',
      'aria-label': `${route.name} route from Islamabad, ${route.distanceApprox}`
    });

    const titleEl = createSvgElement('title', {});
    titleEl.textContent = `${route.name} (${route.distanceApprox}) — Click to preview`;
    group.appendChild(titleEl);

    // Wide transparent hit area + visible route line
    group.appendChild(createSvgElement('polyline', { points: pointsAttr, class: 'map-route-hit' }));
    group.appendChild(createSvgElement('polyline', { points: pointsAttr, class: 'map-route-line' }));

    // Intermediate & destination stops
    route.stops.forEach(function (stop) {
      if (stop.isDestination) {
        group.appendChild(
          createSvgElement('circle', {
            cx: stop.coords.x,
            cy: stop.coords.y,
            r: 20,
            class: 'map-route-dest-ring'
          })
        );
        group.appendChild(
          createSvgElement('circle', {
            cx: stop.coords.x,
            cy: stop.coords.y,
            r: 8,
            class: 'map-route-dest-core'
          })
        );

        const label = createSvgElement('text', {
          x: stop.coords.x + route.labelOffset.dx,
          y: stop.coords.y + route.labelOffset.dy,
          'text-anchor': route.labelOffset.anchor,
          class: 'map-route-label'
        });
        label.textContent = stop.name;
        group.appendChild(label);
      } else {
        group.appendChild(
          createSvgElement('circle', {
            cx: stop.coords.x,
            cy: stop.coords.y,
            r: 11,
            class: 'map-route-stop'
          })
        );
      }
    });

    // Select route on mouse left-click (button 0) or keyboard Enter/Space
    group.addEventListener('click', function (event) {
      if (event.button !== 0) return;
      selectRoute(route.id);
    });

    group.addEventListener('keydown', function (event) {
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        selectRoute(route.id);
      }
    });

    overlay.appendChild(group);
  });

  // Draw fixed starting point: Islamabad (You) on top of route origins
  const originGroup = createSvgElement('g', { 'aria-hidden': 'true' });
  originGroup.appendChild(
    createSvgElement('circle', {
      cx: ORIGIN_CITY.coords.x,
      cy: ORIGIN_CITY.coords.y,
      r: 14,
      class: 'map-origin-dot'
    })
  );
  const originLabel = createSvgElement('text', {
    x: ORIGIN_CITY.coords.x,
    y: ORIGIN_CITY.coords.y + 42,
    'text-anchor': 'middle',
    class: 'map-origin-label'
  });
  originLabel.textContent = ORIGIN_CITY.name;
  originGroup.appendChild(originLabel);
  overlay.appendChild(originGroup);

  function selectRoute(routeId) {
    const route = ROUTES.find(function (item) {
      return item.id === routeId;
    });
    if (!route) return;

    selectedRouteId = routeId;

    // Update SVG selection states & move selected trail to top layer
    const groups = overlay.querySelectorAll('.map-route-group');
    groups.forEach(function (group) {
      const isMatch = group.getAttribute('data-route-id') === selectedRouteId;
      group.classList.toggle('is-selected', isMatch);
      group.setAttribute('aria-pressed', String(isMatch));
      if (isMatch) {
        overlay.insertBefore(group, originGroup);
      }
    });

    renderPreview(route);
  }

  function renderPreview(route) {
    previewEmpty.hidden = true;
    previewCard.hidden = false;
    previewCard.classList.remove('is-visible');
    previewCard.replaceChildren();

    const header = document.createElement('div');
    header.className = 'preview-header';

    const title = document.createElement('h2');
    title.className = 'preview-title';
    title.textContent = route.name;

    const distancePill = document.createElement('span');
    distancePill.className = 'preview-distance-pill';
    distancePill.textContent = route.distanceApprox;

    header.append(title, distancePill);

    const imgWrap = document.createElement('div');
    imgWrap.className = 'preview-image-wrap';
    const img = document.createElement('img');
    img.className = 'preview-image';
    img.src = route.image;
    img.alt = route.imageAlt;
    imgWrap.appendChild(img);

    const summary = document.createElement('p');
    summary.className = 'preview-summary';
    summary.textContent = `${route.duration} — ${route.summary}`;

    const servicesHeading = document.createElement('h3');
    servicesHeading.className = 'preview-detail-heading';
    servicesHeading.textContent = 'Services';

    const servicesList = document.createElement('ul');
    servicesList.className = 'preview-detail-list';
    route.services.forEach(function (service) {
      const li = document.createElement('li');
      li.textContent = service;
      servicesList.appendChild(li);
    });

    const stopsHeading = document.createElement('h3');
    stopsHeading.className = 'preview-detail-heading';
    stopsHeading.textContent = 'Stops (from Islamabad)';

    const stopsList = document.createElement('ul');
    stopsList.className = 'preview-detail-list';
    const stopNames = ['Islamabad (Start)'].concat(
      route.stops.map(function (s) {
        return s.name;
      })
    );
    stopNames.forEach(function (stopName) {
      const li = document.createElement('li');
      li.textContent = stopName;
      stopsList.appendChild(li);
    });

    const footerRow = document.createElement('div');
    footerRow.className = 'preview-footer-row';

    const costWrap = document.createElement('div');
    const costLabel = document.createElement('span');
    costLabel.className = 'preview-cost-label';
    costLabel.textContent = 'Estimated Cost';
    const costValue = document.createElement('span');
    costValue.className = 'preview-cost-value';
    costValue.textContent = route.cost;
    costWrap.append(costLabel, costValue);

    const bookLink = document.createElement('a');
    bookLink.className = 'btn-sunrise';
    bookLink.href = 'booking.html';
    bookLink.textContent = 'Book Now';

    footerRow.append(costWrap, bookLink);

    previewCard.append(
      header,
      imgWrap,
      summary,
      servicesHeading,
      servicesList,
      stopsHeading,
      stopsList,
      footerRow
    );

    // Reflow to replay fade-in cleanly when switching routes
    void previewCard.offsetWidth;
    previewCard.classList.add('is-visible');
  }
}

document.addEventListener('DOMContentLoaded', function () {
  initSmartStickyHeader();
  initInteractiveMap();
});
