(() => {
  'use strict';
  document.documentElement.classList.add('js');
  const $ = (selector, root=document) => root.querySelector(selector);
  const header = $('#site-header');
  const toggle = $('#menu-toggle');
  const mobile = $('#mobile-nav');
  const navActive = $('.primary-nav a.active');
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
  const saveData = Boolean(navigator.connection && navigator.connection.saveData);

  const updateHeader = () => {
    if (header) header.classList.toggle('is-fixed',window.scrollY > 50);
  };
  updateHeader();
  window.addEventListener('scroll', updateHeader, {passive:true});

  function closeMenu() {
    if (!toggle || !mobile) return;
    toggle.setAttribute('aria-expanded','false');
    toggle.setAttribute('aria-label','Open navigation');
    mobile.hidden = true;
  }
  if(toggle && mobile) {
    toggle.addEventListener('click', () => {
      const nowOpen = toggle.getAttribute('aria-expanded')!=='true';
      toggle.setAttribute('aria-expanded',String(nowOpen));
      toggle.setAttribute('aria-label',nowOpen?'Close navigation':'Open navigation');
      mobile.hidden = !nowOpen;
    });
    mobile.querySelectorAll('a').forEach(a=>a.addEventListener('click',closeMenu));
    document.addEventListener('keydown', e=>{if(e.key==='Escape')closeMenu();});
    document.addEventListener('click', e=>{
      if (!mobile.hidden && !header.contains(e.target)) closeMenu();
    });
  }

  const reveals = document.querySelectorAll('.reveal');
  if('IntersectionObserver' in window && !reduced.matches) {
    const observer = new IntersectionObserver(entries=>{
      for (const entry of entries) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      }
    },{threshold:.07,rootMargin:'0px 0px -15px 0px'});
    reveals.forEach(el=>observer.observe(el));
  } else {
    reveals.forEach(el=>el.classList.add('is-visible'));
  }

                                                                        
                                                                             
  const video = $('#home-axi-video');
  const visual = $('.hero-visual');
  let videoLoaded = false;
  function activateVideo() {
    if (!video || !visual || reduced.matches || saveData || videoLoaded) return;
    videoLoaded = true;
    const source = document.createElement('source');
    source.src = video.dataset.src;
    source.type = 'video/webm';
    video.appendChild(source);
    video.load();
    video.muted = true;
    const result = video.play();
    if (result && typeof result.catch === 'function') result.catch(()=>visual.classList.remove('is-playing'));
  }
  if(video && visual) {
    video.addEventListener('playing',()=>{if(!reduced.matches)visual.classList.add('is-playing');});
    video.addEventListener('error',()=>visual.classList.remove('is-playing'));
    video.addEventListener('stalled',()=>{if(video.readyState<2)visual.classList.remove('is-playing');});
    if('IntersectionObserver' in window) {
      const io = new IntersectionObserver(entries=>{
        const visible = entries.some(e=>e.isIntersecting);
        if(visible) {
          activateVideo();
          if(!reduced.matches && videoLoaded) video.play().catch(()=>{});
        } else if (videoLoaded) {
          video.pause();
        }
      },{rootMargin:'110px 0px',threshold:.01});
      io.observe(visual);
    } else {
      activateVideo();
    }
    document.addEventListener('visibilitychange',()=>{
      if(document.hidden) video.pause();
      else if(videoLoaded && !reduced.matches) video.play().catch(()=>{});
    });
    reduced.addEventListener?.('change',()=>{
      if(reduced.matches) {video.pause();visual.classList.remove('is-playing');}
      else activateVideo();
    });
  }

                                                                               
  const serviceSelect = $('#enquiry-service');
  document.querySelectorAll('[data-service]').forEach(link=>{
    link.addEventListener('click',()=>{
      if(serviceSelect) serviceSelect.value=link.dataset.service;
    });
  });

                                                                           
                                                                        
  const form = $('#project-form');
  const status = $('#form-status');
  if(form) {
    form.addEventListener('submit',e=>{
      e.preventDefault();
      if(!form.reportValidity()) return;
      const name = $('#enquiry-name').value.trim();
      const email = $('#enquiry-email').value.trim();
      const service = serviceSelect.value;
      const message = $('#enquiry-message').value.trim();
      if(!name || !email || !service) return;
      const subject = `AX'ETL website enquiry — ${service}`;
      const body = `Name: ${name}\nEmail: ${email}\nService: ${service}\n\nProject details:\n${message || '(Not provided)'}`;
      if(status) status.textContent = 'Your email application should open with the enquiry prepared. Review it and press Send there.';
      window.location.href = 'mailto:info@axetl.co.za?subject=' + encodeURIComponent(subject) + '&body=' + encodeURIComponent(body);
    });
  }

  // Preserve content accessibility when browser motion preferences change.
  reduced.addEventListener?.('change',()=> {
    if(reduced.matches) reveals.forEach(el=>el.classList.add('is-visible'));
  });
})();
                                                                    
(() => {
 const video=document.getElementById('ecosystem-motion');
 const section=document.getElementById('why-axetl');
 if(!video||!section)return;
 const reduced=window.matchMedia('(prefers-reduced-motion: reduce)');
 const saveData=Boolean(navigator.connection&&navigator.connection.saveData);
 let loaded=false,visible=false;
 function play(){
   if(reduced.matches||saveData||!visible)return;
   if(!loaded){
     loaded=true;
     const source=document.createElement('source');
     source.src=video.dataset.src;
     source.type='video/mp4';
     video.appendChild(source);
     video.load();
   }
   video.muted=true;
   const result=video.play();
   if(result&&typeof result.catch==='function')result.catch(()=>section.classList.remove('is-motion-playing'));
 }
 video.addEventListener('playing',()=>{if(visible&&!reduced.matches)section.classList.add('is-motion-playing');});
 video.addEventListener('error',()=>section.classList.remove('is-motion-playing'));
 if('IntersectionObserver'in window){
   const observer=new IntersectionObserver(entries=>{
     visible=entries.some(entry=>entry.isIntersecting);
     if(visible)play();else{video.pause();section.classList.remove('is-motion-playing');}
   },{rootMargin:'40px 0px',threshold:.04});
   observer.observe(section);
 }else{visible=true;play();}
 reduced.addEventListener?.('change',()=>{
   if(reduced.matches){video.pause();section.classList.remove('is-motion-playing');}
   else play();
 });
 document.addEventListener('visibilitychange',()=>{if(document.hidden)video.pause();else play()});
})();
