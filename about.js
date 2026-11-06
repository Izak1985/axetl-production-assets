                                                                                             
(() => {
  'use strict';
  const hero = document.querySelector('.about-hero');
  const video = document.getElementById('about-hero-video');
  if (!hero || !video) return;
  const motion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const saveData = Boolean(navigator.connection && navigator.connection.saveData);
  let visible = true;
  const pause = () => {
    video.pause();
    hero.classList.remove('is-playing');
  };
  function play() {
    if (motion.matches || saveData || document.hidden || !visible) {
      pause();
      return;
    }
    video.muted = true;
    const result = video.play();
    if (result && typeof result.catch === 'function') {
      result.catch(() => hero.classList.remove('is-playing'));
    }
  }
  video.addEventListener('playing', () => {
    if (!motion.matches && !saveData) hero.classList.add('is-playing');
  });
  video.addEventListener('error', () => hero.classList.remove('is-playing'));
  video.addEventListener('stalled', () => {
    if (video.readyState < 2) hero.classList.remove('is-playing');
  });
  document.addEventListener('visibilitychange', () => document.hidden ? pause() : play());
  motion.addEventListener?.('change', () => motion.matches ? pause() : play());
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries) => {
      visible = entries.some(entry => entry.isIntersecting);
      if (visible) play(); else pause();
    }, {threshold: .02});
    observer.observe(hero);
  }
  if (motion.matches || saveData) pause(); else play();
})();
