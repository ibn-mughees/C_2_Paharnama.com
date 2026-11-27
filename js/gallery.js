/* ==========================================================================
   PaharNama — Travellers Gallery Script (js/gallery.js)
   Handles sticky header interactions, seeded + localStorage gallery items,
   filtering, sorting, persistent likes, story lightbox, and photo uploads.
   ========================================================================== */

(function () {
  'use strict';

  const STORAGE_KEYS = {
    LIKES: 'paharnama_gallery_likes',
    SUBMISSIONS: 'paharnama_gallery_submissions',
    HOTEL_REGION: 'paharnama_hotel_filter_region'
  };

  const VALLEYS = ['All', 'Hunza', 'Skardu', 'Swat', 'Fairy Meadows', 'Gilgit', 'Chitral'];

  const DEFAULT_GALLERY_ITEMS = [
    {
      id: 'pn-gal-1',
      title: 'Golden Hour Over Passu Cones',
      valley: 'Hunza',
      spot: 'Passu Cathedral Ridge',
      traveller: 'Amina Siddiqui',
      date: '2026-10-14',
      image: '../images/gallery_passu.png',
      likes: 128,
      story:
        'We pulled over near Passu Glacier just before sunset as the granite spires turned molten gold above the turquoise Hunza River. Even in late October, the crisp Karakoram wind made hot apricot chai from a roadside stall taste unforgettable.'
    },
    {
      id: 'pn-gal-2',
      title: 'Spring Apricot Blossoms at Altit Fort',
      valley: 'Hunza',
      spot: 'Altit Royal Garden',
      traveller: 'Hamza Raza',
      date: '2026-04-08',
      image: '../images/gallery_altit.png',
      likes: 94,
      story:
        'Climbing up the stone steps of 900-year-old Altit Fort right as the valley orchards burst into pink and white blossoms felt like stepping into a painting. From the watchtower, you can trace the ancient Silk Route winding below.'
    },
    {
      id: 'pn-gal-3',
      title: 'Morning Calm at Upper Kachura Lake',
      valley: 'Skardu',
      spot: 'Upper Kachura',
      traveller: 'Sara Jehangir',
      date: '2026-09-22',
      image: '../images/gallery_kachura.png',
      likes: 146,
      story:
        'Leaving our Skardu guesthouse at 6:00 AM rewarded us with glass-still emerald water reflecting the pine cliffs. A local boatman shared stories of winter ice skating on this very basin.'
    },
    {
      id: 'pn-gal-4',
      title: 'Wildflowers Across Deosai Plains',
      valley: 'Skardu',
      spot: 'Sheosar Lake, Deosai',
      traveller: 'Bilal Farooq',
      date: '2026-08-03',
      image: '../images/gallery_deosai.png',
      likes: 112,
      story:
        'At 4,100 meters above sea level, the Land of Giants feels endless. Wildflowers painted the rolling tundra yellow and violet while Nanga Parbat peeked across the horizon beyond Sheosar Lake.'
    },
    {
      id: 'pn-gal-5',
      title: 'Emerald Waters of Mahodand Lake',
      valley: 'Swat',
      spot: 'Kalam Valley',
      traveller: 'Mahnoor Khan',
      date: '2026-07-19',
      image: '../images/gallery_mahodand.png',
      likes: 87,
      story:
        'After a bumpy jeep track out of Kalam, Mahodand opened up surrounded by cedar forests and waterfalls cascading straight off the Hindu Kush snowfields. We camped by the glacial stream under crystal-clear stars.'
    },
    {
      id: 'pn-gal-6',
      title: 'First Light on Nanga Parbat',
      valley: 'Fairy Meadows',
      spot: 'Beyal Camp Trail',
      traveller: 'Usman Tariq',
      date: '2026-06-29',
      image: '../images/gallery_nangaparbat.png',
      likes: 173,
      story:
        'Waking up in a wooden cabin at 3,300 meters to see the Killer Mountain glowing rose-pink above the pine canopy is a memory I will carry forever. The three-hour hike up from Tato village was worth every step.'
    },
    {
      id: 'pn-gal-7',
      title: 'Suspension Bridge Beneath Rakaposhi',
      valley: 'Gilgit',
      spot: 'Nagar & Gilgit River',
      traveller: 'Taimoor Ali',
      date: '2026-09-05',
      image: '../images/gallery_gilgit.png',
      likes: 79,
      story:
        'Crossing the wooden plank bridge over the roaring Gilgit River with Rakaposhi towering 7,788 meters ahead gives you true scale of these valleys. Local hospitality greeted us with fresh walnuts at every turn.'
    },
    {
      id: 'pn-gal-8',
      title: 'Afternoon Shadows in Kalash Valley',
      valley: 'Chitral',
      spot: 'Bumburet, Chitral',
      traveller: 'Hira Naveed',
      date: '2026-05-17',
      image: '../images/gallery_chitral.png',
      likes: 105,
      story:
        'Carved cedar houses cling to the steep green slopes of Bumburet while Tirich Mir stands guard in the distance. Visiting during the spring festival introduced us to centuries-old mountain music and crafts.'
    }
  ];

  // Application state
  const state = {
    items: [],
    likedMap: {},
    activeValley: 'All',
    searchQuery: '',
    sortBy: 'most-liked',
    activeStoryId: null,
    imageSourceMode: 'preset',
    uploadedDataUrl: '',
    randomSeedOrder: {}
  };

  // Cached DOM references
  const dom = {};

  function cacheDom() {
    dom.locationsDropdown = document.getElementById('locations-dropdown');
    dom.locationsToggle = document.getElementById('locations-toggle');
    dom.hamburgerBtn = document.getElementById('hamburger-btn');
    dom.mobileNav = document.getElementById('mobile-nav');
    dom.mobileLocationsToggle = document.getElementById('mobile-locations-toggle');
    dom.mobileLocationsMenu = document.getElementById('mobile-locations-menu');

    dom.filterPills = document.getElementById('valley-filter-pills');
    dom.searchInput = document.getElementById('gallery-search');
    dom.sortSelect = document.getElementById('gallery-sort');
    dom.resultsCount = document.getElementById('results-count');
    dom.galleryGrid = document.getElementById('gallery-grid');
    dom.emptyState = document.getElementById('empty-gallery-state');
    dom.resetFiltersBtn = document.getElementById('reset-gallery-filters-btn');
    dom.toast = document.getElementById('gallery-toast');

    // Story modal
    dom.storyModal = document.getElementById('story-modal');
    dom.closeStoryModalBtn = document.getElementById('close-story-modal-btn');
    dom.storyImg = document.getElementById('story-modal-img');
    dom.storyBadge = document.getElementById('story-modal-badge');
    dom.storyDate = document.getElementById('story-modal-date');
    dom.storyTitle = document.getElementById('story-modal-title');
    dom.storyAuthor = document.getElementById('story-modal-author');
    dom.storyText = document.getElementById('story-modal-text');
    dom.storyLikeBtn = document.getElementById('story-modal-like-btn');
    dom.storyLikeCount = document.getElementById('story-modal-like-count');
    dom.storyBookLink = document.getElementById('story-book-destination-link');

    // Share modal
    dom.openShareModalBtn = document.getElementById('open-share-modal-btn');
    dom.shareModal = document.getElementById('share-modal');
    dom.closeShareModalBtn = document.getElementById('close-share-modal-btn');
    dom.cancelShareBtn = document.getElementById('cancel-share-btn');
    dom.shareForm = document.getElementById('share-photo-form');
    dom.inputName = document.getElementById('share-traveller-name');
    dom.inputValley = document.getElementById('share-valley');
    dom.inputTitle = document.getElementById('share-photo-title');
    dom.inputSpot = document.getElementById('share-spot');
    dom.sourceTabs = document.querySelectorAll('.source-tab');
    dom.panePreset = document.getElementById('source-pane-preset');
    dom.panePath = document.getElementById('source-pane-path');
    dom.paneUpload = document.getElementById('source-pane-upload');
    dom.presetSelect = document.getElementById('share-preset-select');
    dom.relativePathInput = document.getElementById('share-relative-path');
    dom.fileInput = document.getElementById('share-file-input');
    dom.imagePreview = document.getElementById('share-image-preview');
    dom.inputStory = document.getElementById('share-story');
    dom.charCounter = document.getElementById('story-char-counter');
  }

  /* --------------------------------------------------------------------------
     LocalStorage Helpers (with safe JSON parsing)
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

  function loadInitialData() {
    state.likedMap = readJsonStorage(STORAGE_KEYS.LIKES, {});
    const savedSubmissions = readJsonStorage(STORAGE_KEYS.SUBMISSIONS, []);
    const validSubmissions = Array.isArray(savedSubmissions) ? savedSubmissions : [];

    // Combine user submissions first, then curated default items
    state.items = [...validSubmissions, ...DEFAULT_GALLERY_ITEMS].map((item) => ({
      ...item,
      likes: Number(item.likes) || 0
    }));
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
     Data Helpers (Counts, Likes, Formatting, Filtering & Sorting)
     -------------------------------------------------------------------------- */
  function getEffectiveLikes(item) {
    return item.likes + (state.likedMap[item.id] ? 1 : 0);
  }

  function formatDisplayDate(isoDate) {
    const parsed = new Date(isoDate);
    if (Number.isNaN(parsed.getTime())) {
      return 'Recent';
    }
    return parsed.toLocaleDateString('en-PK', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  }

  function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = String(text);
    return div.innerHTML;
  }

  function getFilteredAndSortedItems() {
    const query = state.searchQuery.trim().toLowerCase();

    const filtered = state.items.filter((item) => {
      const matchesValley = state.activeValley === 'All' || item.valley === state.activeValley;
      if (!matchesValley) return false;

      if (!query) return true;
      const haystack = `${item.title} ${item.valley} ${item.spot || ''} ${item.traveller} ${item.story}`.toLowerCase();
      return haystack.includes(query);
    });

    const sorted = [...filtered];
    if (state.sortBy === 'most-liked') {
      sorted.sort((a, b) => getEffectiveLikes(b) - getEffectiveLikes(a));
    } else if (state.sortBy === 'newest') {
      sorted.sort((a, b) => new Date(b.date) - new Date(a.date));
    } else if (state.sortBy === 'oldest') {
      sorted.sort((a, b) => new Date(a.date) - new Date(b.date));
    } else if (state.sortBy === 'random') {
      sorted.sort((a, b) => (state.randomSeedOrder[a.id] || 0) - (state.randomSeedOrder[b.id] || 0));
    }

    return sorted;
  }

  function assignRandomOrder() {
    state.items.forEach((item) => {
      state.randomSeedOrder[item.id] = Math.random();
    });
  }

  /* --------------------------------------------------------------------------
     Rendering: Valley Filter Pills & Gallery Grid
     -------------------------------------------------------------------------- */
  function renderFilterPills() {
    const counts = { All: state.items.length };
    VALLEYS.slice(1).forEach((valley) => {
      counts[valley] = state.items.filter((item) => item.valley === valley).length;
    });

    dom.filterPills.innerHTML = VALLEYS.map((valley) => {
      const isActive = state.activeValley === valley;
      return `
        <button
          type="button"
          class="valley-pill ${isActive ? 'active' : ''}"
          data-valley="${escapeHtml(valley)}"
          aria-pressed="${isActive}"
        >
          <span>${escapeHtml(valley)}</span>
          <span class="pill-count">(${counts[valley] || 0})</span>
        </button>
      `;
    }).join('');
  }

  function renderGallery() {
    const items = getFilteredAndSortedItems();

    dom.resultsCount.textContent = `Showing ${items.length} traveller ${items.length === 1 ? 'moment' : 'moments'}${
      state.activeValley !== 'All' ? ` in ${state.activeValley}` : ''
    }`;

    if (items.length === 0) {
      dom.galleryGrid.innerHTML = '';
      dom.emptyState.removeAttribute('hidden');
      return;
    }

    dom.emptyState.setAttribute('hidden', '');

    dom.galleryGrid.innerHTML = items
      .map((item) => {
        const isLiked = Boolean(state.likedMap[item.id]);
        const likeCount = getEffectiveLikes(item);
        const locationLabel = item.spot ? `${item.valley} • ${item.spot}` : item.valley;

        return `
          <article class="gallery-card" data-id="${escapeHtml(item.id)}">
            <div class="card-media">
              <img
                src="${escapeHtml(item.image)}"
                alt="${escapeHtml(item.title)} in ${escapeHtml(item.valley)}"
                loading="lazy"
              >
              <span class="location-badge">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                  <path d="M12 21C12 21 18 14.8 18 9.8C18 6.6 15.3 4 12 4C8.7 4 6 6.6 6 9.8C6 14.8 12 21 12 21Z" stroke="currentColor" stroke-width="2.2"/>
                  <circle cx="12" cy="9.5" r="2" fill="currentColor"/>
                </svg>
                ${escapeHtml(locationLabel)}
              </span>
            </div>

            <div class="card-body">
              <h2 class="card-title">${escapeHtml(item.title)}</h2>
              <p class="card-author">By ${escapeHtml(item.traveller)} &middot; ${formatDisplayDate(item.date)}</p>
              <p class="card-excerpt">${escapeHtml(item.story)}</p>

              <div class="card-footer">
                <button
                  type="button"
                  class="like-btn ${isLiked ? 'liked' : ''}"
                  data-action="like"
                  data-id="${escapeHtml(item.id)}"
                  aria-pressed="${isLiked}"
                  aria-label="Like ${escapeHtml(item.title)}"
                >
                  <svg class="heart-icon" width="17" height="17" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                    <path d="M12 20.5C12 20.5 4 15.2 4 9.2C4 6.5 6.1 4.5 8.7 4.5C10.3 4.5 11.4 5.3 12 6.4C12.6 5.3 13.7 4.5 15.3 4.5C17.9 4.5 20 6.5 20 9.2C20 15.2 12 20.5 12 20.5Z" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/>
                  </svg>
                  <span>${likeCount}</span>
                </button>

                <button
                  type="button"
                  class="btn-view-story"
                  data-action="view"
                  data-id="${escapeHtml(item.id)}"
                >
                  View Story
                </button>
              </div>
            </div>
          </article>
        `;
      })
      .join('');

    // Fallback handler in case a custom relative path points to a missing file
    dom.galleryGrid.querySelectorAll('img').forEach((imgEl) => {
      imgEl.addEventListener('error', function handleImgError() {
        imgEl.removeEventListener('error', handleImgError);
        imgEl.src = '../images/gallery_passu.png';
      });
    });
  }

  /* --------------------------------------------------------------------------
     Like Toggle (Persisted in localStorage)
     -------------------------------------------------------------------------- */
  function toggleLike(itemId) {
    if (state.likedMap[itemId]) {
      delete state.likedMap[itemId];
    } else {
      state.likedMap[itemId] = true;
    }

    writeJsonStorage(STORAGE_KEYS.LIKES, state.likedMap);
    renderGallery();

    if (state.activeStoryId === itemId) {
      syncStoryModalLikes(itemId);
    }
  }

  function syncStoryModalLikes(itemId) {
    const item = state.items.find((entry) => entry.id === itemId);
    if (!item) return;

    const isLiked = Boolean(state.likedMap[itemId]);
    dom.storyLikeBtn.classList.toggle('liked', isLiked);
    dom.storyLikeBtn.setAttribute('aria-pressed', String(isLiked));
    dom.storyLikeCount.textContent = String(getEffectiveLikes(item));
  }

  /* --------------------------------------------------------------------------
     Story Lightbox Modal
     -------------------------------------------------------------------------- */
  function openStoryModal(itemId) {
    const item = state.items.find((entry) => entry.id === itemId);
    if (!item) return;

    state.activeStoryId = itemId;
    dom.storyImg.src = item.image;
    dom.storyImg.alt = `${item.title} in ${item.valley}`;
    dom.storyBadge.textContent = item.spot ? `${item.valley} • ${item.spot}` : item.valley;
    dom.storyDate.textContent = formatDisplayDate(item.date);
    dom.storyTitle.textContent = item.title;
    dom.storyAuthor.textContent = `By ${item.traveller}`;
    dom.storyText.textContent = item.story;

    syncStoryModalLikes(itemId);

    // Save selected valley so Hotels & Affiliation can optionally highlight/filter it
    dom.storyBookLink.onclick = () => {
      try {
        localStorage.setItem(STORAGE_KEYS.HOTEL_REGION, item.valley);
      } catch (error) {
        // Ignore storage errors if private mode restricts storage
      }
    };

    dom.storyModal.removeAttribute('hidden');
    document.body.style.overflow = 'hidden';
    dom.closeStoryModalBtn.focus();
  }

  function closeStoryModal() {
    state.activeStoryId = null;
    dom.storyModal.setAttribute('hidden', '');
    document.body.style.overflow = '';
  }

  /* --------------------------------------------------------------------------
     Share Your Photo Modal & Validation
     -------------------------------------------------------------------------- */
  function openShareModal() {
    clearFormErrors();
    dom.shareModal.removeAttribute('hidden');
    document.body.style.overflow = 'hidden';
    dom.inputName.focus();
  }

  function closeShareModal() {
    dom.shareModal.setAttribute('hidden', '');
    document.body.style.overflow = '';
  }

  function switchImageSourceMode(mode) {
    state.imageSourceMode = mode;

    dom.sourceTabs.forEach((tab) => {
      const isSelected = tab.dataset.sourceMode === mode;
      tab.classList.toggle('active', isSelected);
      tab.setAttribute('aria-selected', String(isSelected));
    });

    dom.panePreset.hidden = mode !== 'preset';
    dom.panePath.hidden = mode !== 'path';
    dom.paneUpload.hidden = mode !== 'upload';

    updateImagePreview();
  }

  function updateImagePreview() {
    if (state.imageSourceMode === 'preset') {
      dom.imagePreview.src = dom.presetSelect.value;
    } else if (state.imageSourceMode === 'path') {
      const val = dom.relativePathInput.value.trim();
      dom.imagePreview.src = isValidRelativeImagePath(val) ? val : '../images/gallery_passu.png';
    } else if (state.imageSourceMode === 'upload') {
      dom.imagePreview.src = state.uploadedDataUrl || '../images/gallery_passu.png';
    }
  }

  function isValidRelativeImagePath(pathValue) {
    if (!pathValue) return false;
    const lowered = pathValue.toLowerCase();
    if (
      lowered.startsWith('http://') ||
      lowered.startsWith('https://') ||
      lowered.startsWith('/') ||
      lowered.includes(':\\')
    ) {
      return false;
    }
    return /^\.\.\/images\/[a-z0-9_\-./]+\.(png|jpe?g|webp|svg)$/i.test(pathValue);
  }

  function setFieldError(inputEl, errorElId, message) {
    const errorEl = document.getElementById(errorElId);
    const fieldWrap = inputEl.closest('.form-field');
    if (errorEl) errorEl.textContent = message;
    if (fieldWrap) fieldWrap.classList.toggle('has-error', Boolean(message));
  }

  function clearFormErrors() {
    document.querySelectorAll('.field-error').forEach((el) => {
      el.textContent = '';
    });
    document.querySelectorAll('.form-field.has-error').forEach((el) => {
      el.classList.remove('has-error');
    });
  }

  function resolveSelectedImage() {
    if (state.imageSourceMode === 'preset') {
      return { valid: true, src: dom.presetSelect.value };
    }

    if (state.imageSourceMode === 'path') {
      const rawPath = dom.relativePathInput.value.trim();
      if (!isValidRelativeImagePath(rawPath)) {
        return {
          valid: false,
          message: 'Enter a valid relative path like ../images/gallery_passu.png (no external URLs).'
        };
      }
      return { valid: true, src: rawPath };
    }

    if (!state.uploadedDataUrl) {
      return { valid: false, message: 'Please choose an image file to upload.' };
    }
    return { valid: true, src: state.uploadedDataUrl };
  }

  function handleShareSubmit(event) {
    event.preventDefault();
    clearFormErrors();

    let isValid = true;
    const travellerName = dom.inputName.value.trim();
    const valley = dom.inputValley.value.trim();
    const photoTitle = dom.inputTitle.value.trim();
    const spot = dom.inputSpot.value.trim();
    const story = dom.inputStory.value.trim();

    if (travellerName.length < 2) {
      setFieldError(dom.inputName, 'error-traveller-name', 'Please enter your name (at least 2 characters).');
      isValid = false;
    }

    if (!VALLEYS.includes(valley) || valley === 'All') {
      setFieldError(dom.inputValley, 'error-valley', 'Please select a Northern Pakistan valley.');
      isValid = false;
    }

    if (photoTitle.length < 3) {
      setFieldError(dom.inputTitle, 'error-photo-title', 'Please enter a photo title (at least 3 characters).');
      isValid = false;
    }

    const imageResult = resolveSelectedImage();
    if (!imageResult.valid) {
      setFieldError(dom.presetSelect, 'error-image-source', imageResult.message);
      isValid = false;
    }

    if (story.length < 15) {
      setFieldError(dom.inputStory, 'error-story', 'Please share a brief story (at least 15 characters).');
      isValid = false;
    }

    if (!isValid) return;

    const newEntry = {
      id: `pn-gal-${Date.now()}`,
      title: photoTitle,
      valley,
      spot,
      traveller: travellerName,
      date: new Date().toISOString().slice(0, 10),
      image: imageResult.src,
      likes: 1,
      story
    };

    const existingSubmissions = readJsonStorage(STORAGE_KEYS.SUBMISSIONS, []);
    const updatedSubmissions = [newEntry, ...(Array.isArray(existingSubmissions) ? existingSubmissions : [])];

    const saved = writeJsonStorage(STORAGE_KEYS.SUBMISSIONS, updatedSubmissions);
    if (!saved) {
      setFieldError(
        dom.fileInput,
        'error-image-source',
        'Image is too large for browser storage. Please choose a smaller file or preset photo.'
      );
      return;
    }

    state.items.unshift(newEntry);
    state.likedMap[newEntry.id] = true;
    writeJsonStorage(STORAGE_KEYS.LIKES, state.likedMap);

    // Show newest submission at the top
    state.activeValley = 'All';
    state.searchQuery = '';
    dom.searchInput.value = '';
    state.sortBy = 'newest';
    dom.sortSelect.value = 'newest';

    dom.shareForm.reset();
    state.uploadedDataUrl = '';
    dom.charCounter.textContent = '0 / 400';
    switchImageSourceMode('preset');
    closeShareModal();

    renderFilterPills();
    renderGallery();
    showToast('Your traveller photo is now live in the gallery!');
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
     Event Listeners
     -------------------------------------------------------------------------- */
  function bindGalleryEvents() {
    // Valley filter pills
    dom.filterPills.addEventListener('click', (event) => {
      const btn = event.target.closest('.valley-pill');
      if (!btn) return;
      state.activeValley = btn.dataset.valley || 'All';
      renderFilterPills();
      renderGallery();
    });

    // Search input
    dom.searchInput.addEventListener('input', (event) => {
      state.searchQuery = event.target.value;
      renderGallery();
    });

    // Sort select
    dom.sortSelect.addEventListener('change', (event) => {
      state.sortBy = event.target.value;
      if (state.sortBy === 'random') {
        assignRandomOrder();
      }
      renderGallery();
    });

    // Reset filters
    dom.resetFiltersBtn.addEventListener('click', () => {
      state.activeValley = 'All';
      state.searchQuery = '';
      dom.searchInput.value = '';
      renderFilterPills();
      renderGallery();
    });

    // Card actions (Event Delegation)
    dom.galleryGrid.addEventListener('click', (event) => {
      const actionBtn = event.target.closest('[data-action]');
      if (!actionBtn) return;

      const { action, id } = actionBtn.dataset;
      if (action === 'like') {
        toggleLike(id);
      } else if (action === 'view') {
        openStoryModal(id);
      }
    });

    // Story modal events
    dom.closeStoryModalBtn.addEventListener('click', closeStoryModal);
    dom.storyLikeBtn.addEventListener('click', () => {
      if (state.activeStoryId) {
        toggleLike(state.activeStoryId);
      }
    });
    dom.storyModal.addEventListener('click', (event) => {
      if (event.target === dom.storyModal) {
        closeStoryModal();
      }
    });

    // Share modal events
    dom.openShareModalBtn.addEventListener('click', openShareModal);
    dom.closeShareModalBtn.addEventListener('click', closeShareModal);
    dom.cancelShareBtn.addEventListener('click', closeShareModal);
    dom.shareModal.addEventListener('click', (event) => {
      if (event.target === dom.shareModal) {
        closeShareModal();
      }
    });

    // Source tabs & preview
    dom.sourceTabs.forEach((tab) => {
      tab.addEventListener('click', () => {
        switchImageSourceMode(tab.dataset.sourceMode);
      });
    });

    dom.presetSelect.addEventListener('change', updateImagePreview);
    dom.relativePathInput.addEventListener('input', updateImagePreview);

    dom.fileInput.addEventListener('change', (event) => {
      const file = event.target.files && event.target.files[0];
      if (!file) {
        state.uploadedDataUrl = '';
        updateImagePreview();
        return;
      }

      if (file.size > 1.5 * 1024 * 1024) {
        setFieldError(dom.fileInput, 'error-image-source', 'File exceeds 1.5 MB. Please choose a smaller image.');
        state.uploadedDataUrl = '';
        return;
      }

      const reader = new FileReader();
      reader.onload = () => {
        state.uploadedDataUrl = typeof reader.result === 'string' ? reader.result : '';
        setFieldError(dom.fileInput, 'error-image-source', '');
        updateImagePreview();
      };
      reader.readAsDataURL(file);
    });

    dom.inputStory.addEventListener('input', () => {
      dom.charCounter.textContent = `${dom.inputStory.value.length} / 400`;
    });

    dom.shareForm.addEventListener('submit', handleShareSubmit);

    // Escape key closes whichever modal is open
    document.addEventListener('keydown', (event) => {
      if (event.key !== 'Escape') return;
      if (!dom.storyModal.hasAttribute('hidden')) closeStoryModal();
      if (!dom.shareModal.hasAttribute('hidden')) closeShareModal();
    });
  }

  /* --------------------------------------------------------------------------
     Bootstrap Initialization
     -------------------------------------------------------------------------- */
  function init() {
    cacheDom();
    loadInitialData();
    assignRandomOrder();
    bindHeaderEvents();
    bindGalleryEvents();
    renderFilterPills();
    renderGallery();
  }

  document.addEventListener('DOMContentLoaded', init);
})();
