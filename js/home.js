'use strict';

// Traveler reviews rendered into the left-to-right moving bar
const REVIEWS = [
  {
    name: 'Amina Tariq',
    origin: 'Lahore',
    trip: 'Hunza & Skardu',
    rating: 5,
    quote: 'Our local driver knew every safe viewpoint along the Karakoram Highway. Unforgettable trip.'
  },
  {
    name: 'Shadow Warrior',
    origin: 'Daska, Sialkot',
    trip: 'Fairy Meadows',
    rating: 5,
    quote: 'Visa invitation guidance and jeep transfers were seamless. Nanga Parbat at sunrise left us speechless.'
  },
  {
    name: 'Hamza Siddiqui',
    origin: 'Karachi',
    trip: 'Skardu Valley',
    rating: 5,
    quote: 'Clean hotels, honest pricing, and zero last-minute surprises during our seven-day family tour.'
  },
  {
    name: 'Claire Moreau',
    origin: 'Lyon, France',
    trip: 'Chitral & Kalash',
    rating: 5,
    quote: 'Traveling solo felt completely comfortable thanks to our hospitable guide and clear daily itinerary.'
  },
  {
    name: 'Usman Raza',
    origin: 'Islamabad',
    trip: 'Gilgit & Khunjerab',
    rating: 5,
    quote: 'Best mountain tour team we have booked with. Well-maintained 4x4 jeeps and flexible photo stops.'
  }
];

const REVIEW_CYCLE_SECONDS = 64;

/**
 * Sticky scroll-up header:
 * stays visible at top or when scrolling up; hides when scrolling down.
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
 * Build left-to-right review cards from REVIEWS array and wire pause toggle.
 */
function initReviewsBar() {
  const stage = document.getElementById('reviewsStage');
  const toggleBtn = document.getElementById('reviewsToggleBtn');
  if (!stage) return;

  const staggerSeconds = REVIEW_CYCLE_SECONDS / REVIEWS.length;
  const fragment = document.createDocumentFragment();

  REVIEWS.forEach(function (review, index) {
    const card = document.createElement('article');
    card.className = 'review-card';
    card.style.animationDelay = `${-(index * staggerSeconds).toFixed(2)}s`;

    const stars = document.createElement('div');
    stars.className = 'review-stars';
    stars.setAttribute('aria-label', `${review.rating} out of 5 stars`);
    stars.textContent = '★'.repeat(review.rating);

    const quote = document.createElement('p');
    quote.className = 'review-quote';
    quote.textContent = `"${review.quote}"`;

    const author = document.createElement('p');
    author.className = 'review-author';
    author.textContent = review.name;

    const meta = document.createElement('p');
    meta.className = 'review-meta';
    meta.textContent = `${review.origin} · ${review.trip}`;

    card.append(stars, quote, author, meta);
    fragment.appendChild(card);
  });

  stage.appendChild(fragment);

  if (toggleBtn) {
    toggleBtn.addEventListener('click', function () {
      const paused = stage.classList.toggle('is-paused');
      toggleBtn.setAttribute('aria-pressed', String(paused));
      toggleBtn.textContent = paused ? 'Resume Reviews' : 'Pause Reviews';
    });
  }
}

document.addEventListener('DOMContentLoaded', function () {
  initSmartStickyHeader();
  initReviewsBar();
});
