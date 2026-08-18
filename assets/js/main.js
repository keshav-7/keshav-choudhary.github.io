(() => {
  const body = document.body;
  const header = document.querySelector('#site-header');
  const themeButton = document.querySelector('#theme-toggle');
  const menuButton = document.querySelector('#menu-toggle');
  const mobileNav = document.querySelector('#mobile-nav');
  const savedTheme = localStorage.getItem('portfolio-theme');
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  if (savedTheme === 'dark' || (!savedTheme && prefersDark)) body.classList.add('dark');
  const updateThemeIcon = () => {
    const dark = body.classList.contains('dark');
    themeButton.innerHTML = `<i class="bi bi-${dark ? 'sun' : 'moon-stars'}"></i>`;
    themeButton.setAttribute('aria-label', `Switch to ${dark ? 'light' : 'dark'} theme`);
  };
  updateThemeIcon();
  themeButton.addEventListener('click', () => {
    body.classList.toggle('dark');
    localStorage.setItem('portfolio-theme', body.classList.contains('dark') ? 'dark' : 'light');
    updateThemeIcon();
  });
  menuButton.addEventListener('click', () => {
    const open = mobileNav.classList.toggle('open');
    menuButton.setAttribute('aria-expanded', String(open));
    menuButton.setAttribute('aria-label', open ? 'Close navigation' : 'Open navigation');
    menuButton.innerHTML = `<i class="bi bi-${open ? 'x-lg' : 'list'}"></i>`;
  });
  mobileNav.querySelectorAll('a').forEach(link => link.addEventListener('click', () => {
    mobileNav.classList.remove('open');
    menuButton.setAttribute('aria-expanded', 'false');
    menuButton.innerHTML = '<i class="bi bi-list"></i>';
  }));
  const onScroll = () => header.classList.toggle('scrolled', window.scrollY > 30);
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });
  const observer = new IntersectionObserver(entries => entries.forEach(entry => {
    if (entry.isIntersecting) { entry.target.classList.add('visible'); observer.unobserve(entry.target); }
  }), { threshold: 0.12 });
  document.querySelectorAll('.reveal').forEach(element => observer.observe(element));

  const slider = document.querySelector('#recommendations-slider');
  if (slider) {
    const slides = [...slider.querySelectorAll('.recommendation-slide')];
    const dots = [...slider.querySelectorAll('.slider-dot')];
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    let activeSlide = 0;
    let sliderTimer;
    const showSlide = index => {
      activeSlide = (index + slides.length) % slides.length;
      slides.forEach((slide, position) => {
        const active = position === activeSlide;
        slide.classList.toggle('is-active', active);
        slide.setAttribute('aria-hidden', String(!active));
      });
      dots.forEach((dot, position) => {
        const active = position === activeSlide;
        dot.classList.toggle('is-active', active);
        if (active) dot.setAttribute('aria-current', 'true');
        else dot.removeAttribute('aria-current');
      });
    };
    const stopSlider = () => window.clearInterval(sliderTimer);
    const startSlider = () => {
      stopSlider();
      if (!prefersReducedMotion) sliderTimer = window.setInterval(() => showSlide(activeSlide + 1), 6000);
    };
    slider.querySelector('.slider-prev').addEventListener('click', () => { showSlide(activeSlide - 1); startSlider(); });
    slider.querySelector('.slider-next').addEventListener('click', () => { showSlide(activeSlide + 1); startSlider(); });
    dots.forEach(dot => dot.addEventListener('click', () => { showSlide(Number(dot.dataset.slide)); startSlider(); }));
    slider.addEventListener('mouseenter', stopSlider);
    slider.addEventListener('mouseleave', startSlider);
    slider.addEventListener('focusin', stopSlider);
    slider.addEventListener('focusout', startSlider);
    document.addEventListener('visibilitychange', () => document.hidden ? stopSlider() : startSlider());
    startSlider();
  }
  document.querySelector('#year').textContent = new Date().getFullYear();
})();
