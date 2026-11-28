/* ==========================================================================
   PaharNama — Verified Hotels & Partners Script (js/hotaf.js)
   Handles sticky header interactions, gallery-to-hotel region handoff,
   live multi-criteria filtering, hotel details & room configurator modal,
   checkout handoff to pay.html, and partner affiliation persistence.
   ========================================================================== */

(function () {
  'use strict';

  const STORAGE_KEYS = {
    CHECKOUT: 'paharnama_checkout',
    AFFILIATES: 'paharnama_affiliates',
    GALLERY_HANDOFF_REGION: 'paharnama_hotel_filter_region'
  };

  const VALID_REGIONS = ['Hunza', 'Skardu', 'Swat', 'Fairy Meadows', 'Gilgit', 'Chitral'];

  const ROOM_UPGRADES = [
    { label: 'Standard Mountain View', surcharge: 0 },
    { label: 'Deluxe Valley Suite', surcharge: 6000 },
    { label: 'Family Panoramic Loft', surcharge: 12000 }
  ];

  // 8 Curated Certified Northern Pakistan Hotels across all 6 regions
  const HOTELS_DATA = [
    {
      id: 'pn-hotel-1',
      name: "Eagle's Nest Hotel",
      region: 'Hunza',
      stars: 5,
      rating: 4.9,
      reviews: 214,
      ratePerNight: 34000,
      distance: '0.4 km from Duikar Sunrise Point',
      image: '../images/hotel_eaglesnest.png',
      amenities: ['Free Wi-Fi', 'Heated Rooms', 'Parking', 'Mountain / Lake View', 'Breakfast Included'],
      checkInOut: '2:00 PM / 12:00 PM',
      cancellation: 'Free cancellation up to 48 hours before check-in.',
      description:
        'Perched above Karimabad on the Duikar ridge, Eagle’s Nest offers uninterrupted 360-degree sunrise views of Rakaposhi, Ultar Sar, and Ladyfinger Peak alongside warm wood-paneled rooms and Hunza hospitality.'
    },
    {
      id: 'pn-hotel-2',
      name: 'Hunza Serena Inn',
      region: 'Hunza',
      stars: 4,
      rating: 4.7,
      reviews: 168,
      ratePerNight: 22500,
      distance: '1.2 km from Baltit Fort, Karimabad',
      image: '../images/hotel_serenahunza.png',
      amenities: ['Free Wi-Fi', 'Heated Rooms', 'Parking', 'Breakfast Included'],
      checkInOut: '2:00 PM / 12:00 PM',
      cancellation: 'Free cancellation up to 24 hours before check-in.',
      description:
        'Surrounded by terraced apricot orchards in Karimabad, Hunza Serena Inn blends traditional stone-and-cedar craftsmanship with serene garden terraces and locally sourced mountain cuisine.'
    },
    {
      id: 'pn-hotel-3',
      name: 'Shangrila Resort Skardu',
      region: 'Skardu',
      stars: 5,
      rating: 4.8,
      reviews: 312,
      ratePerNight: 38500,
      distance: '0.1 km from Lower Kachura Lake',
      image: '../images/hotel_shangrila.png',
      amenities: ['Free Wi-Fi', 'Heated Rooms', 'Parking', 'Mountain / Lake View', 'Breakfast Included'],
      checkInOut: '2:00 PM / 11:30 AM',
      cancellation: 'Free cancellation up to 72 hours before check-in.',
      description:
        'Known as Heaven on Earth, Shangrila Resort wraps around the emerald shores of Lower Kachura Lake with iconic red-roofed cottages, lakeside walkways, and crisp pine mountain air.'
    },
    {
      id: 'pn-hotel-4',
      name: 'Shigar Fort Heritage Residence',
      region: 'Skardu',
      stars: 5,
      rating: 4.9,
      reviews: 145,
      ratePerNight: 42000,
      distance: '0.2 km from Shigar Fort Gardens',
      image: '../images/hotel_serenaskardu.png',
      amenities: ['Free Wi-Fi', 'Heated Rooms', 'Parking', 'Mountain / Lake View', 'Breakfast Included'],
      checkInOut: '2:00 PM / 12:00 PM',
      cancellation: 'Free cancellation up to 72 hours before check-in.',
      description:
        'A restored 17th-century Balti palace managed with heritage precision, featuring hand-carved walnut latticework, orchard courtyard dining, and gateway access to K2 base camp trails.'
    },
    {
      id: 'pn-hotel-5',
      name: 'Swat Serena Hotel',
      region: 'Swat',
      stars: 4,
      rating: 4.6,
      reviews: 189,
      ratePerNight: 21000,
      distance: '1.5 km from Saidu Sharif Museum',
      image: '../images/hotel_swatserena.png',
      amenities: ['Free Wi-Fi', 'Heated Rooms', 'Parking', 'Breakfast Included'],
      checkInOut: '2:00 PM / 12:00 PM',
      cancellation: 'Free cancellation up to 24 hours before check-in.',
      description:
        'Set amidst six acres of manicured lawns and towering deodar pines in Saidu Sharif, Swat Serena Hotel serves as a refined base for exploring Malam Jabba and Kalam Valley.'
    },
    {
      id: 'pn-hotel-6',
      name: 'Raikot Sarai Alpine Cottages',
      region: 'Fairy Meadows',
      stars: 3,
      rating: 4.5,
      reviews: 118,
      ratePerNight: 12500,
      distance: '0.3 km from Nanga Parbat Viewpoint',
      image: '../images/hotel_fairymeadows.png',
      amenities: ['Heated Rooms', 'Mountain / Lake View', 'Breakfast Included'],
      checkInOut: '1:00 PM / 10:30 AM',
      cancellation: 'Free cancellation up to 48 hours before check-in.',
      description:
        'Cozy timber alpine cabins situated on the pine-ringed plateau of Fairy Meadows, offering wood-heated warmth, bonfire evenings, and front-row sunrise views of Nanga Parbat.'
    },
    {
      id: 'pn-hotel-7',
      name: 'Gilgit Serena Hotel',
      region: 'Gilgit',
      stars: 4,
      rating: 4.7,
      reviews: 154,
      ratePerNight: 23500,
      distance: '2.0 km from Jutial Chinar Bagh',
      image: '../images/hotel_gilgitserena.png',
      amenities: ['Free Wi-Fi', 'Heated Rooms', 'Parking', 'Mountain / Lake View', 'Breakfast Included'],
      checkInOut: '2:00 PM / 12:00 PM',
      cancellation: 'Free cancellation up to 24 hours before check-in.',
      description:
        'Nestled in peaceful Jutial gardens overlooking the Gilgit River basin and rugged Karakoram cliffs, ideal for travellers connecting between Islamabad, Hunza, and Ghizer.'
    },
    {
      id: 'pn-hotel-8',
      name: 'Hindukush Heights Hotel',
      region: 'Chitral',
      stars: 4,
      rating: 4.8,
      reviews: 132,
      ratePerNight: 18000,
      distance: '2.8 km from Chitral Shahi Mosque',
      image: '../images/hotel_hindukush.png',
      amenities: ['Free Wi-Fi', 'Parking', 'Mountain / Lake View', 'Breakfast Included'],
      checkInOut: '2:00 PM / 12:00 PM',
      cancellation: 'Free cancellation up to 48 hours before check-in.',
      description:
        'Overlooking the Chitral River valley with panoramic vistas of Tirich Mir, Hindukush Heights combines traditional Chitrali woodwork, organic orchard meals, and guided Kalash excursions.'
    }
  ];

  // Live filter & modal state
  const state = {
    searchQuery: '',
    region: 'All',
    stars: 'all',
    maxBudget: 'any',
    sortBy: 'recommended',
    amenities: [],
    activeHotelId: null,
    affiliates: []
  };

  const dom = {};

  function cacheDom() {
    // Header navigation
    dom.locationsDropdown = document.getElementById('locations-dropdown');
    dom.locationsToggle = document.getElementById('locations-toggle');
    dom.hamburgerBtn = document.getElementById('hamburger-btn');
    dom.mobileNav = document.getElementById('mobile-nav');
    dom.mobileLocationsToggle = document.getElementById('mobile-locations-toggle');
    dom.mobileLocationsMenu = document.getElementById('mobile-locations-menu');

    // Handoff banner & filter controls
    dom.handoffBanner = document.getElementById('handoff-banner');
    dom.handoffBannerText = document.getElementById('handoff-banner-text');
    dom.handoffClearBtn = document.getElementById('handoff-clear-btn');

    dom.searchInput = document.getElementById('hotel-search');
    dom.regionSelect = document.getElementById('filter-region');
    dom.starsSelect = document.getElementById('filter-stars');
    dom.budgetSelect = document.getElementById('filter-budget');
    dom.sortSelect = document.getElementById('hotel-sort');
    dom.amenityCheckboxes = document.querySelectorAll('input[name="filter-amenity"]');
    dom.findStaysBtn = document.getElementById('find-stays-btn');
    dom.resetFiltersBtn = document.getElementById('reset-filters-btn');
    dom.clearEmptyFiltersBtn = document.getElementById('clear-empty-filters-btn');

    // Directory grid
    dom.resultsCount = document.getElementById('hotels-results-count');
    dom.directorySection = document.getElementById('hotels-directory');
    dom.hotelsGrid = document.getElementById('hotels-grid');
    dom.emptyState = document.getElementById('empty-hotels-state');

    // View Details Modal
    dom.hotelModal = document.getElementById('hotel-modal');
    dom.closeHotelModalBtn = document.getElementById('close-hotel-modal-btn');
    dom.modalImg = document.getElementById('hotel-modal-img');
    dom.modalRegion = document.getElementById('hotel-modal-region');
    dom.modalStars = document.getElementById('hotel-modal-stars');
    dom.modalRating = document.getElementById('hotel-modal-rating');
    dom.modalDistance = document.getElementById('hotel-modal-distance');
    dom.modalTitle = document.getElementById('hotel-modal-title');
    dom.modalDesc = document.getElementById('hotel-modal-desc');
    dom.modalCheckin = document.getElementById('hotel-modal-checkin');
    dom.modalCancellation = document.getElementById('hotel-modal-cancellation');
    dom.modalAmenitiesList = document.getElementById('hotel-modal-amenities-list');
    dom.modalRoomSelect = document.getElementById('modal-room-select');
    dom.modalNightsInput = document.getElementById('modal-nights-input');
    dom.modalGuestsInput = document.getElementById('modal-guests-input');
    dom.modalNightlyRate = document.getElementById('modal-nightly-rate');
    dom.modalSubtotal = document.getElementById('modal-subtotal');
    dom.modalBookStayBtn = document.getElementById('modal-book-stay-btn');

    // Partner Affiliation Form & List
    dom.affiliateForm = document.getElementById('affiliate-form');
    dom.affPropertyName = document.getElementById('aff-property-name');
    dom.affRegion = document.getElementById('aff-region');
    dom.affPropertyType = document.getElementById('aff-property-type');
    dom.affRooms = document.getElementById('aff-rooms');
    dom.affRate = document.getElementById('aff-rate');
    dom.affOwnerName = document.getElementById('aff-owner-name');
    dom.affMobile = document.getElementById('aff-mobile');
    dom.affEmail = document.getElementById('aff-email');
    dom.affAmenitiesField = document.getElementById('aff-amenities-field');
    dom.affAmenityInputs = document.querySelectorAll('input[name="affAmenities"]');

    dom.confirmationBox = document.getElementById('affiliate-confirmation');
    dom.confirmationTitle = document.getElementById('confirmation-title');
    dom.confirmationMessage = document.getElementById('confirmation-message');
    dom.submittedList = document.getElementById('submitted-partners-list');
    dom.submittedCountPill = document.getElementById('submitted-count-pill');

    dom.toast = document.getElementById('hotaf-toast');
  }

  /* --------------------------------------------------------------------------
     Safe LocalStorage & Formatting Helpers
     -------------------------------------------------------------------------- */
  function readJsonStorage(key, fallback) {
    try {
      const raw = localStorage.getItem(key);
      return raw ? JSON.parse(raw) : fallback;
    } catch (error) {
      return fallback;
    }
  }

  function writeJsonStorage(key, value) {
    try {
      localStorage.setItem(key, JSON.stringify(value));
      return true;
    } catch (error) {
      return false;
    }
  }

  function formatPKR(amount) {
    return `PKR ${Number(amount || 0).toLocaleString('en-PK')}`;
  }

  function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = String(text);
    return div.innerHTML;
  }

  function showToast(message) {
    dom.toast.textContent = message;
    dom.toast.removeAttribute('hidden');
    window.clearTimeout(showToast.timerId);
    showToast.timerId = window.setTimeout(() => {
      dom.toast.setAttribute('hidden', '');
    }, 3500);
  }

  /* --------------------------------------------------------------------------
     Header Navigation (Desktop Dropdown & Mobile Drawer)
     -------------------------------------------------------------------------- */
  function bindHeaderEvents() {
    if (dom.locationsToggle && dom.locationsDropdown) {
      dom.locationsToggle.addEventListener('click', (event) => {
        event.stopPropagation();
        const isOpen = dom.locationsDropdown.classList.toggle('open');
        dom.locationsToggle.setAttribute('aria-expanded', String(isOpen));
      });

      document.addEventListener('click', (event) => {
        if (!dom.locationsDropdown.contains(event.target)) {
          dom.locationsDropdown.classList.remove('open');
          dom.locationsToggle.setAttribute('aria-expanded', 'false');
        }
      });
    }

    if (dom.hamburgerBtn && dom.mobileNav) {
      dom.hamburgerBtn.addEventListener('click', () => {
        const isOpen = dom.mobileNav.hasAttribute('hidden');
        if (isOpen) {
          dom.mobileNav.removeAttribute('hidden');
        } else {
          dom.mobileNav.setAttribute('hidden', '');
        }
        dom.hamburgerBtn.setAttribute('aria-expanded', String(isOpen));
      });
    }

    if (dom.mobileLocationsToggle && dom.mobileLocationsMenu) {
      dom.mobileLocationsToggle.addEventListener('click', () => {
        const isOpening = dom.mobileLocationsMenu.hasAttribute('hidden');
        if (isOpening) {
          dom.mobileLocationsMenu.removeAttribute('hidden');
        } else {
          dom.mobileLocationsMenu.setAttribute('hidden', '');
        }
        dom.mobileLocationsToggle.setAttribute('aria-expanded', String(isOpening));
      });
    }
  }

  /* --------------------------------------------------------------------------
     Cross-Page Handoff from Travellers Gallery
     -------------------------------------------------------------------------- */
  function applyGalleryHandoffIfPresent() {
    try {
      const handoffRegion = localStorage.getItem(STORAGE_KEYS.GALLERY_HANDOFF_REGION);
      if (!handoffRegion) return;

      // Consume the handoff key immediately so normal refreshes reset to All Regions
      localStorage.removeItem(STORAGE_KEYS.GALLERY_HANDOFF_REGION);

      if (VALID_REGIONS.includes(handoffRegion)) {
        state.region = handoffRegion;
        dom.regionSelect.value = handoffRegion;
        dom.handoffBannerText.textContent = `Showing verified stays in ${handoffRegion} — from Travellers Gallery`;
        dom.handoffBanner.removeAttribute('hidden');
      }
    } catch (error) {
      // Ignore storage access failures
    }
  }

  /* --------------------------------------------------------------------------
     Section A & B: Filtering, Sorting & Hotel Directory Rendering
     -------------------------------------------------------------------------- */
  function getFilteredAndSortedHotels() {
    const query = state.searchQuery.trim().toLowerCase();

    const filtered = HOTELS_DATA.filter((hotel) => {
      if (state.region !== 'All' && hotel.region !== state.region) {
        return false;
      }

      if (state.stars !== 'all' && hotel.stars !== Number(state.stars)) {
        return false;
      }

      if (state.maxBudget !== 'any' && hotel.ratePerNight > Number(state.maxBudget)) {
        return false;
      }

      if (state.amenities.length > 0) {
        const hasAllAmenities = state.amenities.every((amenity) => hotel.amenities.includes(amenity));
        if (!hasAllAmenities) return false;
      }

      if (query) {
        const haystack = `${hotel.name} ${hotel.region} ${hotel.distance} ${hotel.amenities.join(' ')}`.toLowerCase();
        if (!haystack.includes(query)) return false;
      }

      return true;
    });

    const sorted = [...filtered];
    if (state.sortBy === 'price-asc') {
      sorted.sort((a, b) => a.ratePerNight - b.ratePerNight);
    } else if (state.sortBy === 'price-desc') {
      sorted.sort((a, b) => b.ratePerNight - a.ratePerNight);
    } else if (state.sortBy === 'rating-desc') {
      sorted.sort((a, b) => b.rating - a.rating || b.reviews - a.reviews);
    }
    // 'recommended' preserves the curated order

    return sorted;
  }

  function renderHotels() {
    const hotels = getFilteredAndSortedHotels();

    dom.resultsCount.textContent = `Showing ${hotels.length} verified ${hotels.length === 1 ? 'hotel' : 'hotels'}${
      state.region !== 'All' ? ` in ${state.region}` : ' across Northern Pakistan'
    }`;

    if (hotels.length === 0) {
      dom.hotelsGrid.innerHTML = '';
      dom.emptyState.removeAttribute('hidden');
      return;
    }

    dom.emptyState.setAttribute('hidden', '');

    dom.hotelsGrid.innerHTML = hotels
      .map((hotel) => {
        const starGlyphs = '★'.repeat(hotel.stars);
        const amenityPills = hotel.amenities
          .slice(0, 4)
          .map((item) => `<span class="amenity-tag">${escapeHtml(item)}</span>`)
          .join('');
        const extraCount = hotel.amenities.length > 4 ? `<span class="amenity-tag">+${hotel.amenities.length - 4} more</span>` : '';

        return `
          <article class="hotel-card" data-hotel-id="${escapeHtml(hotel.id)}">
            <div class="hotel-media">
              <img
                src="${escapeHtml(hotel.image)}"
                alt="${escapeHtml(hotel.name)} in ${escapeHtml(hotel.region)}"
                loading="lazy"
              >
              <span class="region-badge">${escapeHtml(hotel.region)}</span>
              <span class="stars-badge">${hotel.stars}★ Certified</span>
            </div>

            <div class="hotel-body">
              <div class="hotel-rating-line">
                <span class="hotel-stars-text" aria-label="${hotel.stars} star property">${starGlyphs}</span>
                <span class="hotel-review-score">${hotel.rating.toFixed(1)} (${hotel.reviews} reviews)</span>
              </div>

              <h2 class="hotel-name">${escapeHtml(hotel.name)}</h2>
              <p class="hotel-distance">${escapeHtml(hotel.distance)}</p>

              <div class="hotel-amenities">
                ${amenityPills}${extraCount}
              </div>

              <div class="hotel-footer">
                <div class="hotel-price-row">
                  <span class="hotel-price">${formatPKR(hotel.ratePerNight)}</span>
                  <span class="hotel-price-unit">per night</span>
                </div>

                <div class="hotel-card-actions">
                  <button
                    type="button"
                    class="btn-card-details"
                    data-action="details"
                    data-id="${escapeHtml(hotel.id)}"
                  >
                    View Details
                  </button>
                  <button
                    type="button"
                    class="btn-card-book"
                    data-action="book"
                    data-id="${escapeHtml(hotel.id)}"
                  >
                    Book Stay
                  </button>
                </div>
              </div>
            </div>
          </article>
        `;
      })
      .join('');
  }

  function resetAllFilters() {
    state.searchQuery = '';
    state.region = 'All';
    state.stars = 'all';
    state.maxBudget = 'any';
    state.sortBy = 'recommended';
    state.amenities = [];

    dom.searchInput.value = '';
    dom.regionSelect.value = 'All';
    dom.starsSelect.value = 'all';
    dom.budgetSelect.value = 'any';
    dom.sortSelect.value = 'recommended';
    dom.amenityCheckboxes.forEach((cb) => {
      cb.checked = false;
    });
    dom.handoffBanner.setAttribute('hidden', '');

    renderHotels();
  }

  /* --------------------------------------------------------------------------
     Checkout Handoff -> localStorage('paharnama_checkout') & pay.html
     -------------------------------------------------------------------------- */
  function proceedToCheckout(hotel, options = {}) {
    const nights = Math.min(14, Math.max(1, Number(options.nights) || 2));
    const guests = Math.min(10, Math.max(1, Number(options.guests) || 2));
    const ratePerNight = Number(options.ratePerNight) || hotel.ratePerNight;

    const checkoutPayload = {
      itemType: 'Hotel Stay',
      name: hotel.name,
      region: hotel.region,
      ratePerNight,
      nights,
      guests,
      image: hotel.image
    };

    if (options.roomType) {
      checkoutPayload.roomType = options.roomType;
    }

    writeJsonStorage(STORAGE_KEYS.CHECKOUT, checkoutPayload);
    window.location.href = 'pay.html';
  }

  /* --------------------------------------------------------------------------
     Hotel View Details & Stay Configurator Modal
     -------------------------------------------------------------------------- */
  function getModalSelection(hotel) {
    const selectedSurcharge = Number(dom.modalRoomSelect.value) || 0;
    const selectedOption = dom.modalRoomSelect.options[dom.modalRoomSelect.selectedIndex];
    const roomType = selectedOption ? selectedOption.dataset.roomName : ROOM_UPGRADES[0].label;

    let nights = parseInt(dom.modalNightsInput.value, 10);
    if (Number.isNaN(nights) || nights < 1) nights = 1;
    if (nights > 14) nights = 14;

    let guests = parseInt(dom.modalGuestsInput.value, 10);
    if (Number.isNaN(guests) || guests < 1) guests = 1;
    if (guests > 10) guests = 10;

    const ratePerNight = hotel.ratePerNight + selectedSurcharge;
    return {
      roomType,
      ratePerNight,
      nights,
      guests,
      subtotal: ratePerNight * nights
    };
  }

  function updateModalPricing() {
    const hotel = HOTELS_DATA.find((entry) => entry.id === state.activeHotelId);
    if (!hotel) return;

    const { ratePerNight, nights, subtotal } = getModalSelection(hotel);
    dom.modalNightlyRate.textContent = `${formatPKR(ratePerNight)} / night`;
    dom.modalSubtotal.textContent = `Total (${nights} ${nights === 1 ? 'night' : 'nights'}): ${formatPKR(subtotal)}`;
  }

  function openHotelModal(hotelId) {
    const hotel = HOTELS_DATA.find((entry) => entry.id === hotelId);
    if (!hotel) return;

    state.activeHotelId = hotelId;
    dom.modalImg.src = hotel.image;
    dom.modalImg.alt = `${hotel.name} in ${hotel.region}`;
    dom.modalRegion.textContent = hotel.region;
    dom.modalStars.textContent = `${hotel.stars}★ Certified`;
    dom.modalRating.textContent = `${hotel.rating.toFixed(1)} ★ (${hotel.reviews} reviews)`;
    dom.modalDistance.textContent = hotel.distance;
    dom.modalTitle.textContent = hotel.name;
    dom.modalDesc.textContent = hotel.description;
    dom.modalCheckin.textContent = hotel.checkInOut;
    dom.modalCancellation.textContent = hotel.cancellation;

    dom.modalAmenitiesList.innerHTML = hotel.amenities
      .map((item) => `<span class="amenity-tag">${escapeHtml(item)}</span>`)
      .join('');

    dom.modalRoomSelect.innerHTML = ROOM_UPGRADES.map((upgrade) => {
      const nightly = hotel.ratePerNight + upgrade.surcharge;
      const surchargeLabel = upgrade.surcharge > 0 ? ` (+${formatPKR(upgrade.surcharge)})` : ' (Base Rate)';
      return `<option value="${upgrade.surcharge}" data-room-name="${escapeHtml(upgrade.label)}">${escapeHtml(
        upgrade.label
      )} — ${formatPKR(nightly)}/night${surchargeLabel}</option>`;
    }).join('');

    dom.modalNightsInput.value = '2';
    dom.modalGuestsInput.value = '2';
    updateModalPricing();

    dom.hotelModal.removeAttribute('hidden');
    document.body.style.overflow = 'hidden';
    dom.closeHotelModalBtn.focus();
  }

  function closeHotelModal() {
    state.activeHotelId = null;
    dom.hotelModal.setAttribute('hidden', '');
    document.body.style.overflow = '';
  }

  /* --------------------------------------------------------------------------
     Section C: Hotel & Resort Affiliation Form Validation & Persistence
     -------------------------------------------------------------------------- */
  function formatPakistaniMobile(rawValue) {
    const digits = rawValue.replace(/\D/g, '').slice(0, 11);
    if (digits.length > 4) {
      return `${digits.slice(0, 4)}-${digits.slice(4)}`;
    }
    return digits;
  }

  function setFieldError(fieldContainerOrInput, errorElId, message) {
    const errorEl = document.getElementById(errorElId);
    const fieldWrap = fieldContainerOrInput.classList.contains('form-field')
      ? fieldContainerOrInput
      : fieldContainerOrInput.closest('.form-field');

    if (errorEl) errorEl.textContent = message;
    if (fieldWrap) fieldWrap.classList.toggle('has-error', Boolean(message));
  }

  function clearAffiliateErrors() {
    dom.affiliateForm.querySelectorAll('.field-error').forEach((el) => {
      el.textContent = '';
    });
    dom.affiliateForm.querySelectorAll('.form-field.has-error').forEach((el) => {
      el.classList.remove('has-error');
    });
  }

  function getSelectedAffiliateAmenities() {
    return Array.from(dom.affAmenityInputs)
      .filter((cb) => cb.checked)
      .map((cb) => cb.value);
  }

  function validateAffiliateField(fieldId) {
    if (fieldId === 'aff-property-name') {
      const val = dom.affPropertyName.value.trim();
      const msg = val.length < 3 ? 'Enter the property or hotel name (at least 3 characters).' : '';
      setFieldError(dom.affPropertyName, 'error-aff-property-name', msg);
      return !msg;
    }

    if (fieldId === 'aff-region') {
      const val = dom.affRegion.value;
      const msg = !VALID_REGIONS.includes(val) ? 'Please select a valley or region.' : '';
      setFieldError(dom.affRegion, 'error-aff-region', msg);
      return !msg;
    }

    if (fieldId === 'aff-property-type') {
      const val = dom.affPropertyType.value;
      const msg = !val ? 'Please select a property type.' : '';
      setFieldError(dom.affPropertyType, 'error-aff-property-type', msg);
      return !msg;
    }

    if (fieldId === 'aff-rooms') {
      const num = Number(dom.affRooms.value);
      const msg =
        !dom.affRooms.value || Number.isNaN(num) || !Number.isInteger(num) || num < 3 || num > 200
          ? 'Enter a whole number between 3 and 200 rooms.'
          : '';
      setFieldError(dom.affRooms, 'error-aff-rooms', msg);
      return !msg;
    }

    if (fieldId === 'aff-rate') {
      const rate = Number(dom.affRate.value);
      const msg =
        !dom.affRate.value || Number.isNaN(rate) || rate < 3000
          ? 'Starting nightly rate must be at least PKR 3,000.'
          : '';
      setFieldError(dom.affRate, 'error-aff-rate', msg);
      return !msg;
    }

    if (fieldId === 'aff-owner-name') {
      const val = dom.affOwnerName.value.trim();
      const msg = val.length < 3 ? 'Enter owner or manager full name (at least 3 characters).' : '';
      setFieldError(dom.affOwnerName, 'error-aff-owner-name', msg);
      return !msg;
    }

    if (fieldId === 'aff-mobile') {
      const formatted = formatPakistaniMobile(dom.affMobile.value);
      dom.affMobile.value = formatted;
      const msg = !/^03\d{2}-\d{7}$/.test(formatted)
        ? 'Enter a valid 11-digit Pakistani mobile number (03XX-XXXXXXX).'
        : '';
      setFieldError(dom.affMobile, 'error-aff-mobile', msg);
      return !msg;
    }

    if (fieldId === 'aff-email') {
      const val = dom.affEmail.value.trim();
      const msg = !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(val)
        ? 'Enter a valid business email address.'
        : '';
      setFieldError(dom.affEmail, 'error-aff-email', msg);
      return !msg;
    }

    if (fieldId === 'aff-amenities') {
      const selected = getSelectedAffiliateAmenities();
      const msg = selected.length === 0 ? 'Please select at least one property amenity.' : '';
      setFieldError(dom.affAmenitiesField, 'error-aff-amenities', msg);
      return !msg;
    }

    return true;
  }

  function generatePartnerRefId(existingList) {
    let refId = '';
    const existingIds = new Set(existingList.map((item) => item.referenceId));
    do {
      const suffix = Math.floor(100 + Math.random() * 900);
      refId = `#PAHAR-AFF-${suffix}`;
    } while (existingIds.has(refId));
    return refId;
  }

  function renderSubmittedPartners() {
    const applications = state.affiliates;
    dom.submittedCountPill.textContent = String(applications.length);

    if (applications.length === 0) {
      dom.submittedList.innerHTML = `
        <div class="submitted-empty-box">
          No partner applications submitted from this browser yet. Fill out the form to register your property.
        </div>
      `;
      return;
    }

    dom.submittedList.innerHTML = applications
      .map(
        (app) => `
        <article class="partner-app-item">
          <div class="partner-app-top">
            <span class="partner-ref-id">${escapeHtml(app.referenceId)}</span>
            <span class="status-badge-pending">${escapeHtml(app.status || 'Pending Verification')}</span>
          </div>
          <h4 class="partner-app-name">${escapeHtml(app.propertyName)}</h4>
          <p class="partner-app-meta">
            ${escapeHtml(app.region)} &middot; ${escapeHtml(app.propertyType)} &middot; ${escapeHtml(app.totalRooms)} rooms &middot; From ${formatPKR(app.startingRate)}/night
          </p>
          <p class="partner-app-contact">
            Contact: ${escapeHtml(app.ownerName)} (${escapeHtml(app.mobile)}) &middot; ${escapeHtml((app.amenities || []).join(', '))}
          </p>
        </article>
      `
      )
      .join('');
  }

  function handleAffiliateSubmit(event) {
    event.preventDefault();
    clearAffiliateErrors();

    const fieldOrder = [
      'aff-property-name',
      'aff-region',
      'aff-property-type',
      'aff-rooms',
      'aff-rate',
      'aff-owner-name',
      'aff-mobile',
      'aff-email',
      'aff-amenities'
    ];

    let firstInvalidId = null;
    fieldOrder.forEach((fieldId) => {
      const ok = validateAffiliateField(fieldId);
      if (!ok && !firstInvalidId) {
        firstInvalidId = fieldId;
      }
    });

    if (firstInvalidId) {
      const targetEl =
        firstInvalidId === 'aff-amenities'
          ? dom.affAmenityInputs[0]
          : document.getElementById(firstInvalidId);
      if (targetEl) targetEl.focus();
      showToast('Please fix the highlighted fields in the partner form.');
      return;
    }

    const referenceId = generatePartnerRefId(state.affiliates);
    const newApplication = {
      referenceId,
      propertyName: dom.affPropertyName.value.trim(),
      region: dom.affRegion.value,
      propertyType: dom.affPropertyType.value,
      totalRooms: parseInt(dom.affRooms.value, 10),
      startingRate: parseInt(dom.affRate.value, 10),
      ownerName: dom.affOwnerName.value.trim(),
      mobile: dom.affMobile.value.trim(),
      email: dom.affEmail.value.trim(),
      amenities: getSelectedAffiliateAmenities(),
      status: 'Pending Verification',
      submittedAt: new Date().toISOString()
    };

    state.affiliates = [newApplication, ...state.affiliates];
    writeJsonStorage(STORAGE_KEYS.AFFILIATES, state.affiliates);

    dom.affiliateForm.reset();
    clearAffiliateErrors();

    dom.confirmationTitle.textContent = `Application Submitted — ${referenceId}`;
    dom.confirmationMessage.textContent = `${newApplication.propertyName} (${newApplication.region}) has been saved for verification. Our onboarding desk will contact ${newApplication.ownerName} at ${newApplication.mobile}.`;
    dom.confirmationBox.removeAttribute('hidden');

    renderSubmittedPartners();
    showToast(`Partner application ${referenceId} submitted!`);
  }

  /* --------------------------------------------------------------------------
     Event Listeners
     -------------------------------------------------------------------------- */
  function bindFilterAndModalEvents() {
    dom.searchInput.addEventListener('input', (event) => {
      state.searchQuery = event.target.value;
      renderHotels();
    });

    dom.regionSelect.addEventListener('change', (event) => {
      state.region = event.target.value;
      dom.handoffBanner.setAttribute('hidden', '');
      renderHotels();
    });

    dom.starsSelect.addEventListener('change', (event) => {
      state.stars = event.target.value;
      renderHotels();
    });

    dom.budgetSelect.addEventListener('change', (event) => {
      state.maxBudget = event.target.value;
      renderHotels();
    });

    dom.sortSelect.addEventListener('change', (event) => {
      state.sortBy = event.target.value;
      renderHotels();
    });

    dom.amenityCheckboxes.forEach((checkbox) => {
      checkbox.addEventListener('change', () => {
        state.amenities = Array.from(dom.amenityCheckboxes)
          .filter((cb) => cb.checked)
          .map((cb) => cb.value);
        renderHotels();
      });
    });

    dom.findStaysBtn.addEventListener('click', () => {
      renderHotels();
      dom.directorySection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });

    dom.resetFiltersBtn.addEventListener('click', resetAllFilters);
    dom.clearEmptyFiltersBtn.addEventListener('click', resetAllFilters);
    dom.handoffClearBtn.addEventListener('click', resetAllFilters);

    // Event delegation on hotel cards
    dom.hotelsGrid.addEventListener('click', (event) => {
      const actionBtn = event.target.closest('[data-action]');
      if (!actionBtn) return;

      const { action, id } = actionBtn.dataset;
      const hotel = HOTELS_DATA.find((entry) => entry.id === id);
      if (!hotel) return;

      if (action === 'details') {
        openHotelModal(id);
      } else if (action === 'book') {
        proceedToCheckout(hotel, {
          ratePerNight: hotel.ratePerNight,
          nights: 2,
          guests: 2
        });
      }
    });

    // Hotel modal controls
    dom.closeHotelModalBtn.addEventListener('click', closeHotelModal);
    dom.hotelModal.addEventListener('click', (event) => {
      if (event.target === dom.hotelModal) {
        closeHotelModal();
      }
    });

    dom.modalRoomSelect.addEventListener('change', updateModalPricing);
    dom.modalNightsInput.addEventListener('input', updateModalPricing);
    dom.modalNightsInput.addEventListener('blur', () => {
      const val = parseInt(dom.modalNightsInput.value, 10);
      dom.modalNightsInput.value = String(Number.isNaN(val) ? 2 : Math.min(14, Math.max(1, val)));
      updateModalPricing();
    });
    dom.modalGuestsInput.addEventListener('blur', () => {
      const val = parseInt(dom.modalGuestsInput.value, 10);
      dom.modalGuestsInput.value = String(Number.isNaN(val) ? 2 : Math.min(10, Math.max(1, val)));
    });

    dom.modalBookStayBtn.addEventListener('click', () => {
      const hotel = HOTELS_DATA.find((entry) => entry.id === state.activeHotelId);
      if (!hotel) return;

      const selection = getModalSelection(hotel);
      proceedToCheckout(hotel, selection);
    });

    document.addEventListener('keydown', (event) => {
      if (event.key === 'Escape' && !dom.hotelModal.hasAttribute('hidden')) {
        closeHotelModal();
      }
    });
  }

  function bindAffiliateFormEvents() {
    // Auto-format 11-digit Pakistani mobile number as 03XX-XXXXXXX
    dom.affMobile.addEventListener('input', () => {
      dom.affMobile.value = formatPakistaniMobile(dom.affMobile.value);
      if (dom.affMobile.closest('.form-field').classList.contains('has-error')) {
        validateAffiliateField('aff-mobile');
      }
    });

    const liveValidatedIds = [
      'aff-property-name',
      'aff-region',
      'aff-property-type',
      'aff-rooms',
      'aff-rate',
      'aff-owner-name',
      'aff-mobile',
      'aff-email'
    ];

    liveValidatedIds.forEach((fieldId) => {
      const el = document.getElementById(fieldId);
      if (!el) return;
      el.addEventListener('blur', () => validateAffiliateField(fieldId));
      el.addEventListener('input', () => {
        if (el.closest('.form-field').classList.contains('has-error')) {
          validateAffiliateField(fieldId);
        }
      });
      if (el.tagName === 'SELECT') {
        el.addEventListener('change', () => validateAffiliateField(fieldId));
      }
    });

    dom.affAmenityInputs.forEach((checkbox) => {
      checkbox.addEventListener('change', () => validateAffiliateField('aff-amenities'));
    });

    dom.affiliateForm.addEventListener('submit', handleAffiliateSubmit);
  }

  /* --------------------------------------------------------------------------
     Bootstrap Initialization
     -------------------------------------------------------------------------- */
  function init() {
    cacheDom();
    const savedAffiliates = readJsonStorage(STORAGE_KEYS.AFFILIATES, []);
    state.affiliates = Array.isArray(savedAffiliates) ? savedAffiliates : [];

    bindHeaderEvents();
    applyGalleryHandoffIfPresent();
    bindFilterAndModalEvents();
    bindAffiliateFormEvents();

    renderHotels();
    renderSubmittedPartners();
  }

  document.addEventListener('DOMContentLoaded', init);
})();
