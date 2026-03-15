(function () {
  const nav = document.querySelector('.site-nav');
  if (!nav) return;

  // Detect active page by URL
  function getActiveEl() {
    const page = window.location.pathname.split('/').pop() || 'index.html';
    return nav.querySelector('.nav-links a[href="' + page + '"]') || null;
  }

  const glider = document.createElement('span');
  glider.className = 'nav-glider';
  nav.appendChild(glider);

  let activeEl = getActiveEl();

  function moveGlider(el, instant) {
    if (window.innerWidth <= 900) return;
    const navRect = nav.getBoundingClientRect();
    const rect = el.getBoundingClientRect();
    if (instant) glider.style.transition = 'none';
    glider.style.left  = (rect.left - navRect.left) + 'px';
    glider.style.width = rect.width + 'px';
    glider.style.opacity = '1';
    if (instant) {
      // Re-enable transitions after paint
      requestAnimationFrame(function () {
        requestAnimationFrame(function () {
          glider.style.transition = '';
        });
      });
    }
  }

  // Collect all interactive nav elements: brand + all anchors
  const brand   = nav.querySelector('.nav-brand');
  const anchors = Array.from(nav.querySelectorAll('.nav-links a'));
  const targets = (brand ? [brand] : []).concat(anchors);

  targets.forEach(function (el) {
    el.addEventListener('mouseenter', function () {
      if (window.innerWidth <= 900) return;
      moveGlider(el, false);
    });
  });

  nav.addEventListener('mouseleave', function () {
    if (window.innerWidth <= 900) return;
    if (activeEl) {
      moveGlider(activeEl, false);
    } else {
      glider.style.opacity = '0';
    }
  });

  // Initialise on active element without animating
  if (activeEl && window.innerWidth > 900) {
    moveGlider(activeEl, true);
  }
})();
