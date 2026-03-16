/* Jake Coffman — Site JS */

// --- Active nav state ---
(function () {
  const links = document.querySelectorAll('.nav-links a');
  const current = (window.location.pathname.split('/').pop() || 'index').replace(/\.html$/, '');
  links.forEach(function (a) {
    const href = (a.getAttribute('href') || '').replace(/\.html$/, '');
    if (href === current || (current === '' && href === 'index')) {
      a.classList.add('active');
    }
  });
})();

// --- Mobile nav toggle ---
(function () {
  const toggle = document.querySelector('.nav-toggle');
  const links = document.querySelector('.nav-links');
  if (!toggle || !links) return;
  toggle.addEventListener('click', function () {
    links.classList.toggle('open');
    toggle.setAttribute('aria-expanded', links.classList.contains('open'));
  });
  // Close on link click
  links.querySelectorAll('a').forEach(function (a) {
    a.addEventListener('click', function () {
      links.classList.remove('open');
    });
  });
})();

// --- FAQ accordion ---
(function () {
  const items = document.querySelectorAll('.faq-item');
  items.forEach(function (item) {
    const q = item.querySelector('.faq-q');
    if (!q) return;
    q.addEventListener('click', function () {
      const isOpen = item.classList.contains('open');
      // Close all
      items.forEach(function (i) { i.classList.remove('open'); });
      // Toggle clicked
      if (!isOpen) item.classList.add('open');
    });
  });
})();
