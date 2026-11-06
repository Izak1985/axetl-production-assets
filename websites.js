                                                                                             
(() => {
  'use strict';
  const hero = document.querySelector('.web-hero');
  const video = document.getElementById('web-hero-video');
  const motion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const saveData = Boolean(navigator.connection && navigator.connection.saveData);
  if (hero && video) {
    let inView = true;
    function pause() {
      video.pause();
      hero.classList.remove('is-playing');
    }
    function play() {
      if (motion.matches || saveData || document.hidden || !inView) {
        pause(); return;
      }
      video.muted = true;
      const p = video.play();
      if (p && typeof p.catch === 'function') {
        p.catch(() => hero.classList.remove('is-playing'));
      }
    }
    video.addEventListener('playing', () => {
      if (!motion.matches && !saveData) hero.classList.add('is-playing');
    });
    video.addEventListener('error', () => hero.classList.remove('is-playing'));
    video.addEventListener('stalled', () => {
      if (video.readyState < 2) hero.classList.remove('is-playing');
    });
    if ('IntersectionObserver' in window) {
      new IntersectionObserver(entries => {
        inView = entries.some(entry => entry.isIntersecting);
        inView ? play() : pause();
      }, {threshold: .02}).observe(hero);
    }
    document.addEventListener('visibilitychange', () => document.hidden ? pause() : play());
    motion.addEventListener?.('change', () => motion.matches ? pause() : play());
    if (motion.matches || saveData) pause(); else play();
  }
  const shell = document.getElementById('web-preview-shell');
  const caption = document.getElementById('web-device-caption');
  const viewButtons = [...document.querySelectorAll('[data-view]')];
  function setView(mode) {
    if (!shell || (mode !== 'desktop' && mode !== 'mobile')) return;
    shell.dataset.mode = mode;
    viewButtons.forEach(b => {
      const active = b.dataset.view === mode;
      b.classList.toggle('active', active);
      b.setAttribute('aria-pressed', String(active));
    });
    if (caption) caption.textContent = mode.toUpperCase() + ' VIEW / ACTIVE';
  }
  viewButtons.forEach(b => b.addEventListener('click', () => setView(b.dataset.view)));
  const form = document.getElementById('web-enquiry-form');
  const selection = document.getElementById('web-contact-type');
  const status = document.getElementById('web-enquiry-status');
  document.querySelectorAll('[data-project]').forEach(link => {
    link.addEventListener('click', () => {
      if (selection) selection.value = link.dataset.project;
      if (status) status.textContent = '';
    });
  });
  if (!form) return;
  form.addEventListener('submit', (event) => {
    event.preventDefault();
    if (!form.reportValidity()) return;
    const name = document.getElementById('web-contact-name')?.value.trim();
    const email = document.getElementById('web-contact-email')?.value.trim();
    const project = selection?.value.trim();
    if (!name || !email || !project) {
      if (status) status.textContent = 'Please enter your name, email and project type.';
      return;
    }
    const existing = document.getElementById('web-contact-site')?.value.trim() || 'Not provided';
    const message = document.getElementById('web-contact-message')?.value.trim() || 'Not provided';
    const subject = 'AX’ETL Website Development Enquiry — ' + project;
    const body = [
      'Name: ' + name,
      'Email: ' + email,
      'Project type: ' + project,
      'Current website: ' + existing,
      '',
      'Project details:',
      message
    ].join('\n');
    if (status) status.textContent = 'Your email app should now open a prepared enquiry. Review and send it to AX’ETL.';
    window.location.href = 'mailto:info@axetl.co.za?subject=' + encodeURIComponent(subject) + '&body=' + encodeURIComponent(body);
  });
})();
