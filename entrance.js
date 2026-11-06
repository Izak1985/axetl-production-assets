(() => {
  'use strict';
  const stage = document.querySelector('.enter-stage');
  const canvas = document.getElementById('digital-terrain');
  const mascot = document.getElementById('axi-mascot');
  const enter = document.getElementById('enter-button');
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)');
  const finePointer = window.matchMedia('(pointer: fine)');
  let width = 0, height = 0, rafId = 0;

  function drawTerrain() {
    if (!canvas) return;
    const ratio = Math.min(window.devicePixelRatio || 1, 2);
    width = stage.clientWidth;
    height = stage.clientHeight;
    canvas.width = Math.round(width * ratio);
    canvas.height = Math.round(height * ratio);
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.scale(ratio, ratio);
    ctx.clearRect(0, 0, width, height);
    const horizon = height * .645;
    const drift = width * .004;
                                                                                
    for (let row = 0; row <= 32; row++) {
      const z = row / 32;
      const ybase = horizon + Math.pow(z, 1.65) * height * .43;
      const alpha = .11 + z * .42;
      ctx.strokeStyle = 'rgba(' + (6+Math.floor(z*18)) + ',' + (101+Math.floor(z*78)) + ',255,' + alpha + ')';
      ctx.lineWidth = .56 + z * .75;
      ctx.beginPath();
      for (let point = 0; point <= 150; point++) {
        const x = (point / 150) * width;
        const u = (x / width) * 2 - 1;
        const peakMask = Math.pow(Math.min(1, Math.abs(u) * 1.5), .9);
        const bigWave = (Math.sin(u * 8.6 + row * .16) * .56 +
                        Math.sin(u * 16.1 + row * .13) * .24 +
                        Math.sin(u * 32.5 + row * .34) * .12);
        const peak = -bigWave * peakMask * (48 * (1-z) + 9 * z);
        const contour = peak + Math.sin(x * .014 + row * .23) * 4 * (1-z);
        const y = ybase + contour;
        if (point === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
      }
      ctx.stroke();
    }
                                                                            
    for (let i = 0; i <= 48; i++) {
      let x = (i / 48) * width;
      ctx.strokeStyle = 'rgba(3, 127, 230, ' + (.11 + (Math.abs(x - width/2) / width) * .22) + ')';
      ctx.lineWidth = .65;
      ctx.beginPath();
      for (let row = 0; row <= 32; row++) {
        const z = row / 32;
        const y = horizon + Math.pow(z, 1.65) * height * .43;
        const u = (x / width) * 2 - 1;
        const wave = Math.sin(u * 8.6 + row * .16) * .56 + Math.sin(u * 16.1 + row * .13) * .24 + Math.sin(u * 32.5 + row * .34) * .12;
        const peakMask = Math.pow(Math.min(1,Math.abs(u)*1.5), .9);
        const yy = y - wave * peakMask * (48 * (1-z) + 9*z);
        if (row === 0) ctx.moveTo(x, yy);
        else ctx.lineTo(x, yy);
      }
      ctx.stroke();
    }
                                
    const glow = ctx.createLinearGradient(0, horizon, width, horizon);
    glow.addColorStop(0, 'rgba(0,160,255,0)');
    glow.addColorStop(.22, 'rgba(0,140,255,.38)');
    glow.addColorStop(.5, 'rgba(0,165,255,.05)');
    glow.addColorStop(.78, 'rgba(0,140,255,.42)');
    glow.addColorStop(1, 'rgba(0,160,255,0)');
    ctx.strokeStyle = glow;
    ctx.lineWidth = 1;
    ctx.beginPath(); ctx.moveTo(0,horizon);ctx.lineTo(width,horizon);ctx.stroke();
  }
  function redraw() { cancelAnimationFrame(rafId);rafId=requestAnimationFrame(drawTerrain); }
  window.addEventListener('resize', redraw, {passive:true});
  redraw();
  if (finePointer.matches && !reduce.matches) {
    let targetX = 0, targetY = 0, scheduled = false;
    stage.addEventListener('pointermove', (e) => {
      targetX = ((e.clientX / width) - .5) * 15;
      targetY = ((e.clientY / height) - .5) * 8;
      if (scheduled) return;
      scheduled = true;
      requestAnimationFrame(() => {
        stage.style.setProperty('--px', targetX.toFixed(1));
        stage.style.setProperty('--py', targetY.toFixed(1));
        scheduled=false;
      });
    }, {passive:true});
    stage.addEventListener('pointerleave',()=>{
      stage.style.setProperty('--px','0');stage.style.setProperty('--py','0');
    });
  }
  if (enter) {
    enter.addEventListener('click', (e) => {
      if (e.defaultPrevented || e.button!==0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      if (reduce.matches) return;                                       
      e.preventDefault();
      const destination = enter.href;
      document.body.classList.add('is-entering');
      setTimeout(() => window.location.assign(destination), 510);
    });
  }
  if (mascot) mascot.addEventListener('error',()=>{mascot.alt='AX’ETL mascot illustration unavailable';});
})();

                                                                          
(() => {
 const stage=document.getElementById('mascot-stage');
 const video=document.getElementById('axi-video');
 const reduced=window.matchMedia('(prefers-reduced-motion: reduce)');
 if(!stage||!video)return;
 const pause=()=>{video.pause();stage.classList.remove('is-video-playing');};
 const play=()=>{
   if(reduced.matches){pause();return;}
   video.muted=true;
   const p=video.play();
   if(p&&typeof p.catch==='function')p.catch(()=>stage.classList.remove('is-video-playing'));
 };
 video.addEventListener('playing',()=>{if(!reduced.matches)stage.classList.add('is-video-playing')});
 video.addEventListener('error',pause);
 video.addEventListener('stalled',()=>{if(video.readyState<2)stage.classList.remove('is-video-playing')});
 reduced.addEventListener?.('change',()=>reduced.matches?pause():play());
 document.addEventListener('visibilitychange',()=>document.hidden?video.pause():play());
 play();
})();

                                                                                   
(()=>{
 'use strict';
 const top=document.querySelector('.topbar');
 if(!top||top.querySelector('.axi-wa-entry'))return;
 const btn=document.createElement('a');
 btn.className='axi-wa-cta axi-wa-entry';
 btn.href='https://wa.me/27713615428?text='+encodeURIComponent("Hello AX’ETL, I’d like to discuss your digital services.");
 btn.target='_blank';btn.rel='noopener noreferrer';
 btn.setAttribute('aria-label','Chat with AX’ETL on WhatsApp');
 btn.textContent='☎ WhatsApp';
 top.append(btn);
})();
