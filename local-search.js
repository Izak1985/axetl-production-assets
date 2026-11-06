                                                                                              
(() => {
  'use strict';
  const hero = document.querySelector('.gbp-hero');
  const video = document.getElementById('gbp-hero-video');
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
  const saveData = Boolean(navigator.connection && navigator.connection.saveData);
  if (hero && video) {
    let visible = true;
    const pause = () => {video.pause();hero.classList.remove('is-playing');};
    const play = () => {
      if (reduced.matches || saveData || document.hidden || !visible) {pause();return;}
      video.muted = true;
      const result = video.play();
      if (result && typeof result.catch === 'function') result.catch(() => hero.classList.remove('is-playing'));
    };
    video.addEventListener('playing', () => {
      if (!reduced.matches && !saveData) hero.classList.add('is-playing');
    });
    video.addEventListener('error', () => hero.classList.remove('is-playing'));
    video.addEventListener('stalled', () => {if(video.readyState < 2) hero.classList.remove('is-playing');});
    if ('IntersectionObserver' in window) {
      new IntersectionObserver(entries => {
        visible = entries.some(entry => entry.isIntersecting);
        if(visible) play(); else pause();
      }, {threshold:.02}).observe(hero);
    }
    document.addEventListener('visibilitychange', () => document.hidden ? pause() : play());
    reduced.addEventListener?.('change', () => reduced.matches ? pause() : play());
    if (reduced.matches || saveData) pause(); else play();
  }

  const card = document.getElementById('gbp-listing-card');
  const caption = document.getElementById('gbp-view-caption');
  const message = document.getElementById('gbp-listing-message');
  const extra = document.getElementById('gbp-demo-directions');
  const buttons = [...document.querySelectorAll('[data-profile-view]')];
  function setView(mode) {
    if (!card || !['search','maps'].includes(mode)) return;
    card.dataset.demoMode = mode;
    buttons.forEach(button => {
      const active = button.dataset.profileView === mode;
      button.classList.toggle('active', active);
      button.setAttribute('aria-pressed', String(active));
    });
    if (caption) caption.textContent = mode.toUpperCase() + ' VIEW / ACTIVE';
    if (message) message.textContent = mode === 'maps'
      ? 'Make your service area or customer-facing location clear and keep the practical details accurate.'
      : 'Help nearby customers understand what your business does and how to get in touch.';
    if (extra) extra.textContent = mode === 'maps' ? 'Location*' : 'Directions*';
  }
  buttons.forEach(button => button.addEventListener('click', () => setView(button.dataset.profileView)));

  const form = document.getElementById('gbp-enquiry-form');
  const status = document.getElementById('gbp-form-status');
  const select = document.getElementById('gbp-request');
  if (!form) return;
  form.addEventListener('submit', event => {
    event.preventDefault();
    if (!form.reportValidity()) return;
    const name = document.getElementById('gbp-name')?.value.trim();
    const email = document.getElementById('gbp-email')?.value.trim();
    const business = document.getElementById('gbp-business')?.value.trim();
    const request = select?.value?.trim();
    if (!name || !email || !business || !request) {
      if (status) status.textContent = 'Please enter your name, email, business and enquiry type.';
      return;
    }
    const location = document.getElementById('gbp-location-input')?.value.trim() || 'Not provided';
    const notes = document.getElementById('gbp-notes')?.value.trim() || 'Not provided';
    const subject = 'AX’ETL Google Business Profile enquiry — ' + business;
    const body = [
      'Name: ' + name,
      'Email: ' + email,
      'Business: ' + business,
      'Service needed: ' + request,
      'Business area: ' + location,
      '',
      'Details:',
      notes
    ].join('\n');
    if (status) status.textContent = 'Your email application should open with a prepared enquiry. Please review and send it.';
    window.location.href = 'mailto:info@axetl.co.za?subject=' + encodeURIComponent(subject) + '&body=' + encodeURIComponent(body);
  });
})();
