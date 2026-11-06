                                                                                        
(() => {
  'use strict';
  const hero = document.querySelector('.hosting-hero');
  const video = document.getElementById('hosting-hero-video');
  const motion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const saveData = Boolean(navigator.connection && navigator.connection.saveData);
  if(hero && video) {
    let inView = true;
    const pause = () => { video.pause(); hero.classList.remove('is-playing'); };
    const play = () => {
      if(motion.matches || saveData || document.hidden || !inView) { pause(); return; }
      video.muted = true;
      const p = video.play();
      if (p && typeof p.catch === 'function') p.catch(() => hero.classList.remove('is-playing'));
    };
    video.addEventListener('playing', () => {
      if(!motion.matches && !saveData) hero.classList.add('is-playing');
    });
    video.addEventListener('error', () => hero.classList.remove('is-playing'));
    video.addEventListener('stalled', () => {
      if(video.readyState < 2) hero.classList.remove('is-playing');
    });
    if('IntersectionObserver' in window){
      new IntersectionObserver(entries => {
        inView = entries.some(entry => entry.isIntersecting);
        if(inView) play(); else pause();
      }, {threshold:.02}).observe(hero);
    }
    document.addEventListener('visibilitychange', () => document.hidden ? pause() : play());
    motion.addEventListener?.('change', () => motion.matches ? pause() : play());
    if(motion.matches || saveData) pause(); else play();
  }

  const plan = document.getElementById('host-plan');
  const status = document.getElementById('hosting-form-status');
  const form = document.getElementById('hosting-enquiry-form');
  document.querySelectorAll('[data-plan]').forEach(link => {
    link.addEventListener('click', () => {
      if(plan) {
        plan.value = link.dataset.plan;
        if(status) status.textContent = '';
      }
    });
  });
  if(!form) return;
  form.addEventListener('submit', event => {
    event.preventDefault();
    if(!form.reportValidity()) return;
    const name = document.getElementById('host-name').value.trim();
    const email = document.getElementById('host-email').value.trim();
    const interest = plan?.value?.trim() || '';
    const website = document.getElementById('host-website').value.trim();
    const message = document.getElementById('host-message').value.trim();
    if(!name || !email || !interest) {
      if(status) status.textContent = 'Please complete your name, email and hosting choice.';
      return;
    }
    const subject = 'AX’ETL Hosting Enquiry — ' + interest;
    const body = [
      'Name: ' + name,
      'Email: ' + email,
      'Interested in: ' + interest,
      'Current website: ' + (website || 'Not provided'),
      '',
      'Project details:',
      message || '(Not provided)'
    ].join('\n');
    if(status) status.textContent='Your email application should open with the message prepared. Please review and send it there.';
    window.location.href='mailto:info@axetl.co.za?subject='+encodeURIComponent(subject)+'&body='+encodeURIComponent(body);
  });
})();
