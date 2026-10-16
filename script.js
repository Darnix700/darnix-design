(() => {
  document.documentElement.classList.add('has-js');
  const header = document.querySelector('.site-header');
  const menuButton = document.querySelector('.menu-toggle');
  const nav = document.querySelector('.primary-nav');
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const closeMenu = () => {
    menuButton.setAttribute('aria-expanded', 'false');
    menuButton.setAttribute('aria-label', 'Ouvrir le menu');
    nav.classList.remove('is-open');
    document.body.classList.remove('menu-open');
  };

  menuButton.addEventListener('click', () => {
    const open = menuButton.getAttribute('aria-expanded') !== 'true';
    menuButton.setAttribute('aria-expanded', String(open));
    menuButton.setAttribute('aria-label', open ? 'Fermer le menu' : 'Ouvrir le menu');
    nav.classList.toggle('is-open', open);
    document.body.classList.toggle('menu-open', open);
  });
  nav.querySelectorAll('a').forEach((link) => link.addEventListener('click', closeMenu));
  window.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && menuButton.getAttribute('aria-expanded') === 'true') {
      closeMenu();
      menuButton.focus();
    }
  });

  const updateScrollState = () => {
    header.classList.toggle('is-scrolled', window.scrollY > 30);
    const scrollable = document.documentElement.scrollHeight - window.innerHeight;
    const progress = scrollable > 0 ? Math.min(100, Math.max(0, window.scrollY / scrollable * 100)) : 0;
    document.documentElement.style.setProperty('--scroll-progress', `${progress}%`);
  };
  let scrollFrame = 0;
  window.addEventListener('scroll', () => {
    if (scrollFrame) return;
    scrollFrame = window.requestAnimationFrame(() => {
      scrollFrame = 0;
      updateScrollState();
    });
  }, { passive: true });
  updateScrollState();

  const revealItems = document.querySelectorAll('.reveal');
  if (reducedMotion || !('IntersectionObserver' in window)) {
    revealItems.forEach((item) => item.classList.add('is-visible'));
  } else {
    const revealObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.13, rootMargin: '0px 0px -28px 0px' });
    revealItems.forEach((item) => revealObserver.observe(item));
  }

  if (!reducedMotion && window.matchMedia('(pointer: fine)').matches) {
    document.querySelectorAll('[data-tilt]').forEach((card) => {
      const limit = card.dataset.tilt === 'subtle' ? 3 : 7;
      card.addEventListener('pointermove', (event) => {
        const rect = card.getBoundingClientRect();
        const x = (event.clientX - rect.left) / rect.width - 0.5;
        const y = (event.clientY - rect.top) / rect.height - 0.5;
        card.classList.add('tilting');
        card.style.setProperty('--tilt-y', `${(x * limit * 2).toFixed(2)}deg`);
        card.style.setProperty('--tilt-x', `${(-y * limit * 2).toFixed(2)}deg`);
      });
      card.addEventListener('pointerleave', () => {
        card.classList.remove('tilting');
        card.style.removeProperty('--tilt-x');
        card.style.removeProperty('--tilt-y');
      });
    });
  }

  const messageInput = document.querySelector('#project-message');
  const contact = document.querySelector('#contact');
  document.querySelectorAll('[data-project]').forEach((link) => {
    link.addEventListener('click', (event) => {
      event.preventDefault();
      messageInput.value = link.dataset.project || '';
      messageInput.focus({ preventScroll: true });
      contact.scrollIntoView({ behavior: reducedMotion ? 'auto' : 'smooth', block: 'center' });
    });
  });

  const form = document.querySelector('#whatsapp-form');
  form.addEventListener('submit', (event) => {
    event.preventDefault();
    const message = new FormData(form).get('message')?.toString().trim();
    if (!message) return;
    const text = `Bonjour DARNIX DESIGN, j’aimerais parler de mon projet : ${message}`;
    window.location.href = `https://wa.me/24177152324?text=${encodeURIComponent(text)}`;
  });

  document.querySelector('#year').textContent = new Date().getFullYear();
})();
