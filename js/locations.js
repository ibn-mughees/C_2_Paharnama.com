/* ==========================================================================
   PaharNama — Location Pages Interactive Logic (Gilgit, Skardu, Chitral)
   ========================================================================== */

(function () {
  'use strict';

  const LOCATION_DATA = {
    gilgit: {
      name: 'Gilgit',
      rates: {
        standard: { hotelPerRoomNight: 6500, transportPerDay: 5500, mealsPerPersonDay: 2200 },
        comfort: { hotelPerRoomNight: 11500, transportPerDay: 8500, mealsPerPersonDay: 3400 },
        deluxe: { hotelPerRoomNight: 18500, transportPerDay: 12000, mealsPerPersonDay: 4800 }
      },
      places: {
        'naltar-valley': {
          title: 'Naltar Valley',
          elevation: '2,950 m (9,678 ft)',
          distance: '54 km from Gilgit (~2 hrs by 4x4)',
          bestSeason: 'May – October',
          description:
            'Tucked behind pine-clad ridges northwest of Gilgit, Naltar Valley is famed for its chain of vivid emerald and cobalt alpine lakes — Satrangi, Pari, and Feroza — alongside Pakistan’s highest ski slope.',
          highlights: [
            '4x4 jeep excursion to Satrangi (Seven-Colored) Lake and Blue Lake',
            'Dense pine & birch forest trails ideal for light hiking and picnics',
            'Winter skiing & chairlift views from December to February'
          ]
        },
        'kargah-buddha': {
          title: 'Kargah Buddha',
          elevation: '1,680 m (5,512 ft)',
          distance: '10 km west of Gilgit (~20 mins)',
          bestSeason: 'Year-round (March – November ideal)',
          description:
            'Carved nearly 50 feet high into a vertical cliff face at the mouth of Kargah Nullah, this 7th-century standing Buddha relief marks an important Silk Road Buddhist monastery complex.',
          highlights: [
            '7th-century rock-carved relief overlooking the Kargah stream',
            'Nearby excavated monastery ruins and ancient birch-bark manuscript site',
            'Easy half-day heritage outing paired with Gilgit Suspension Bridge'
          ]
        },
        'fairy-meadows': {
          title: 'Fairy Meadows',
          elevation: '3,300 m (10,827 ft)',
          distance: '85 km via Raikot Bridge + jeep & trek',
          bestSeason: 'May – September',
          description:
            'Known locally as Joot, Fairy Meadows sits on a lush alpine shelf directly facing the towering North Face of Nanga Parbat (8,126 m), offering one of the most dramatic mountain panoramas on Earth.',
          highlights: [
            'Thrilling Raikot-to-Tattu mountain jeep track followed by a 3-hour pine trek',
            'Unobstructed views of Nanga Parbat (Killer Mountain) from wooden cottages',
            'Day hike to Beyal Camp and Nanga Parbat Base Camp viewpoint'
          ]
        }
      }
    },

    skardu: {
      name: 'Skardu',
      rates: {
        standard: { hotelPerRoomNight: 7000, transportPerDay: 6500, mealsPerPersonDay: 2400 },
        comfort: { hotelPerRoomNight: 12500, transportPerDay: 9500, mealsPerPersonDay: 3600 },
        deluxe: { hotelPerRoomNight: 21000, transportPerDay: 13500, mealsPerPersonDay: 5200 }
      },
      places: {
        'deosai-plains': {
          title: 'Deosai Plains',
          elevation: '4,114 m (13,497 ft)',
          distance: '38 km south of Skardu (~1.5 hrs)',
          bestSeason: 'Mid-June – September',
          description:
            'Known as the "Land of Giants," Deosai is the second-highest alpine plateau in the world — a vast rolling grassland carpeted in summer wildflowers and home to the endangered Himalayan brown bear.',
          highlights: [
            'Expansive high-altitude plateau crossing streams like Kala Pani and Bara Pani',
            'Chance to spot Himalayan marmots, ibex, and brown bears in Deosai National Park',
            'Crystal-clear stargazing skies far from city light pollution'
          ]
        },
        'shigar-fort': {
          title: 'Shigar Fort',
          elevation: '2,320 m (7,612 ft)',
          distance: '32 km from Skardu (~50 mins)',
          bestSeason: 'April – October',
          description:
            'Built in the 17th century by the Raja of Shigar upon a massive boulder, Fong-Khar ("Palace on the Rock") showcases exquisite Balti stone-and-walnut-wood architecture restored by the Aga Khan Cultural Service.',
          highlights: [
            'Guided tour through 400-year-old royal chambers, carved balconies, and museum',
            'Serene apricot and walnut orchards along the Shigar River',
            'Nearby Sarfaranga Cold Desert sand dunes for sunset walks'
          ]
        },
        'sheosar-lake': {
          title: 'Sheosar Lake',
          elevation: '4,142 m (13,589 ft)',
          distance: '72 km from Skardu via Deosai (~3 hrs)',
          bestSeason: 'July – September',
          description:
            'Perched near the western edge of Deosai National Park, Sheosar Lake is one of the highest alpine lakes in the world, reflecting snow-dusted peaks and Nanga Parbat on calm mornings.',
          highlights: [
            'Deep turquoise glacial waters framed by summer wildflower meadows',
            'Panoramic view of Nanga Parbat rising above the western horizon',
            'Scenic circuit route connecting Skardu, Deosai, and Astore'
          ]
        }
      }
    },

    chitral: {
      name: 'Chitral',
      rates: {
        standard: { hotelPerRoomNight: 6000, transportPerDay: 6000, mealsPerPersonDay: 2100 },
        comfort: { hotelPerRoomNight: 11000, transportPerDay: 9000, mealsPerPersonDay: 3200 },
        deluxe: { hotelPerRoomNight: 17500, transportPerDay: 12500, mealsPerPersonDay: 4500 }
      },
      places: {
        'kalash-valleys': {
          title: 'Kalash Valleys',
          elevation: '1,900 – 2,200 m',
          distance: '35 km from Chitral Town (~1.5 hrs)',
          bestSeason: 'May – October (Festival months: May, Aug, Dec)',
          description:
            'Comprising Bumburet, Rumbur, and Birir, the Kalash Valleys preserve the ancient traditions, vibrant embroidered dress, wooden shrines, and seasonal festivals of the indigenous Kalasha people.',
          highlights: [
            'Explore traditional cedarwood villages and Kalasha heritage museums',
            'Witness seasonal celebrations: Joshi (May), Uchal (August), and Chaumos (December)',
            'Walk terraced walnut groves along mountain streams'
          ]
        },
        'chitral-fort': {
          title: 'Chitral Fort',
          elevation: '1,517 m (4,977 ft)',
          distance: 'Central Chitral Town',
          bestSeason: 'March – November',
          description:
            'Standing proudly on the banks of the Chitral River, the historic fort served as the seat of the Mehtar rulers of Chitral and played a storied role in late-19th-century Hindu Kush history.',
          highlights: [
            'Historic ramparts overlooking the rushing Chitral River and Badshahi Mosque',
            'Sightlines toward snow-crowned Tirich Mir (7,708 m) in clear morning light',
            'Walking distance from Shahi Bazaar’s famous Chitrali pakol wool hats'
          ]
        },
        'shandur-pass': {
          title: 'Shandur Pass',
          elevation: '3,700 m (12,139 ft)',
          distance: '145 km east of Chitral (~5 hrs)',
          bestSeason: 'June – September',
          description:
            'Straddling the border between Chitral and Ghizer, Shandur Top is home to the world’s highest polo ground, hosting the legendary annual Shandur Polo Festival between Chitral and Gilgit teams.',
          highlights: [
            'Watch freestyle mountain polo at 3,700 meters above sea level',
            'Visit crystal-clear Shandur Lake set among sweeping Hindu Kush pastures',
            'High-mountain pass crossing connecting Chitral with Phander and Gilgit'
          ]
        }
      }
    }
  };

  function initNavigation() {
    const mobileBtn = document.getElementById('mobile-menu-btn');
    const mainNav = document.getElementById('main-nav');
    const locToggle = document.getElementById('locations-dropdown-toggle');
    const locDropdown = document.getElementById('locations-dropdown');

    if (mobileBtn && mainNav) {
      mobileBtn.addEventListener('click', function () {
        const isOpen = mainNav.classList.toggle('open');
        mobileBtn.setAttribute('aria-expanded', String(isOpen));
      });
    }

    if (locToggle && locDropdown) {
      locToggle.addEventListener('click', function (e) {
        e.preventDefault();
        const isOpen = locDropdown.classList.toggle('open');
        locToggle.setAttribute('aria-expanded', String(isOpen));
      });

      document.addEventListener('click', function (e) {
        if (!locDropdown.contains(e.target)) {
          locDropdown.classList.remove('open');
          locToggle.setAttribute('aria-expanded', 'false');
        }
      });
    }
  }

  function initTabs() {
    const tabButtons = document.querySelectorAll('.tab-btn');
    const tabPanels = document.querySelectorAll('.tab-panel');

    tabButtons.forEach(function (btn) {
      btn.addEventListener('click', function () {
        const targetId = btn.getAttribute('data-tab');

        tabButtons.forEach(function (b) {
          b.classList.remove('active');
          b.setAttribute('aria-selected', 'false');
        });
        tabPanels.forEach(function (panel) {
          panel.classList.remove('active');
        });

        btn.classList.add('active');
        btn.setAttribute('aria-selected', 'true');
        const targetPanel = document.getElementById(targetId);
        if (targetPanel) {
          targetPanel.classList.add('active');
        }
      });
    });
  }

  function initFavorites(locationKey) {
    const storageKey = 'paharnama_favs_' + locationKey;
    let saved = [];
    try {
      saved = JSON.parse(localStorage.getItem(storageKey) || '[]');
    } catch (_) {
      saved = [];
    }

    const favButtons = document.querySelectorAll('.fav-btn');
    favButtons.forEach(function (btn) {
      const placeId = btn.getAttribute('data-place');
      if (saved.indexOf(placeId) !== -1) {
        btn.classList.add('favorited');
        btn.setAttribute('aria-pressed', 'true');
        btn.innerHTML = '&#9829;';
      }

      btn.addEventListener('click', function () {
        const active = btn.classList.toggle('favorited');
        btn.setAttribute('aria-pressed', String(active));
        btn.innerHTML = active ? '&#9829;' : '&#9825;';

        if (active && saved.indexOf(placeId) === -1) {
          saved.push(placeId);
        } else if (!active) {
          saved = saved.filter(function (id) {
            return id !== placeId;
          });
        }

        try {
          localStorage.setItem(storageKey, JSON.stringify(saved));
        } catch (_) {
          // Ignore storage quota errors in restricted browsing modes
        }
      });
    });
  }

  function initPlaceModal(locationKey) {
    const backdrop = document.getElementById('place-modal-backdrop');
    if (!backdrop) return;

    const modalTitle = document.getElementById('modal-place-title');
    const modalMeta = document.getElementById('modal-place-meta');
    const modalDesc = document.getElementById('modal-place-desc');
    const modalHighlights = document.getElementById('modal-place-highlights');
    const closeBtn = document.getElementById('modal-close-btn');
    const closeFooterBtn = document.getElementById('modal-close-footer-btn');

    const locationPlaces = (LOCATION_DATA[locationKey] && LOCATION_DATA[locationKey].places) || {};

    function openModal(placeId) {
      const place = locationPlaces[placeId];
      if (!place) return;

      modalTitle.textContent = place.title;
      modalMeta.innerHTML =
        '<span class="modal-chip">Elevation: ' + place.elevation + '</span>' +
        '<span class="modal-chip">' + place.distance + '</span>' +
        '<span class="modal-chip">Best: ' + place.bestSeason + '</span>';
      modalDesc.textContent = place.description;
      modalHighlights.innerHTML = place.highlights
        .map(function (item) {
          return '<li>' + item + '</li>';
        })
        .join('');

      backdrop.classList.remove('hidden');
      closeBtn.focus();
    }

    function closeModal() {
      backdrop.classList.add('hidden');
    }

    document.querySelectorAll('.view-place-btn').forEach(function (btn) {
      btn.addEventListener('click', function () {
        openModal(btn.getAttribute('data-place'));
      });
    });

    if (closeBtn) closeBtn.addEventListener('click', closeModal);
    if (closeFooterBtn) closeFooterBtn.addEventListener('click', closeModal);

    backdrop.addEventListener('click', function (e) {
      if (e.target === backdrop) closeModal();
    });

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && !backdrop.classList.contains('hidden')) {
        closeModal();
      }
    });
  }

  function formatPKR(amount) {
    return 'Rs. ' + Math.round(amount).toLocaleString('en-PK');
  }

  function initCostEstimator(locationKey) {
    const form = document.getElementById('cost-estimator-form');
    const travellersInput = document.getElementById('travellers-input');
    const daysInput = document.getElementById('days-input');
    const tierSelect = document.getElementById('tier-select');
    const errorEl = document.getElementById('estimator-error');

    const amountEl = document.getElementById('estimate-amount');
    const subEl = document.getElementById('estimate-sub');
    const breakdownEl = document.getElementById('estimate-breakdown');
    const bookLink = document.getElementById('estimate-book-link');

    if (!form || !LOCATION_DATA[locationKey]) return;

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      errorEl.textContent = '';

      const travellers = parseInt(travellersInput.value, 10);
      const days = parseInt(daysInput.value, 10);
      const tier = tierSelect ? tierSelect.value : 'standard';

      if (isNaN(travellers) || travellers < 1 || travellers > 30) {
        errorEl.textContent = 'Please enter between 1 and 30 travellers.';
        travellersInput.focus();
        return;
      }

      if (isNaN(days) || days < 1 || days > 30) {
        errorEl.textContent = 'Please enter between 1 and 30 days.';
        daysInput.focus();
        return;
      }

      const rate = LOCATION_DATA[locationKey].rates[tier] || LOCATION_DATA[locationKey].rates.standard;
      const roomsNeeded = Math.ceil(travellers / 2);
      const nights = Math.max(1, days - 1);

      const accommodationCost = roomsNeeded * nights * rate.hotelPerRoomNight;
      const transportCost = Math.ceil(travellers / 5) * days * rate.transportPerDay;
      const mealsAndPermits = travellers * days * rate.mealsPerPersonDay;
      const total = accommodationCost + transportCost + mealsAndPermits;
      const perPerson = total / travellers;

      amountEl.textContent = formatPKR(total);
      subEl.textContent =
        LOCATION_DATA[locationKey].name + ' • ' + travellers + ' traveller' + (travellers > 1 ? 's' : '') +
        ', ' + days + ' day' + (days > 1 ? 's' : '') + ' (' + formatPKR(perPerson) + ' / person)';

      breakdownEl.innerHTML =
        '<div class="breakdown-row"><span>Accommodation (' + roomsNeeded + ' room' + (roomsNeeded > 1 ? 's' : '') + ' × ' + nights + ' night' + (nights > 1 ? 's' : '') + ')</span><strong>' + formatPKR(accommodationCost) + '</strong></div>' +
        '<div class="breakdown-row"><span>Local 4x4 / Transport (' + days + ' days)</span><strong>' + formatPKR(transportCost) + '</strong></div>' +
        '<div class="breakdown-row"><span>Meals, Guide & Entry Permits</span><strong>' + formatPKR(mealsAndPermits) + '</strong></div>';

      breakdownEl.classList.remove('hidden');

      if (bookLink) {
        bookLink.href =
          'booking.html?destination=' + encodeURIComponent(locationKey) +
          '&travellers=' + encodeURIComponent(travellers) +
          '&days=' + encodeURIComponent(days) +
          '&tier=' + encodeURIComponent(tier) +
          '&estimate=' + encodeURIComponent(Math.round(total));
        bookLink.classList.remove('hidden');
      }
    });
  }

  document.addEventListener('DOMContentLoaded', function () {
    const locationKey = document.body.getAttribute('data-location') || 'gilgit';
    initNavigation();
    initTabs();
    initFavorites(locationKey);
    initPlaceModal(locationKey);
    initCostEstimator(locationKey);
  });
})();
