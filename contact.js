                                                                              
(() => {
 'use strict';
 const hero=document.querySelector('.contact-hero');
 const video=document.getElementById('contact-hero-video');
 const reduced=window.matchMedia('(prefers-reduced-motion: reduce)');
 const saveData=Boolean(navigator.connection && navigator.connection.saveData);
 if(hero && video){
   let visible=true;
   const pause=()=>{video.pause();hero.classList.remove('is-playing');};
   const play=()=>{
     if(reduced.matches||saveData||document.hidden||!visible){pause();return;}
     video.muted=true;
     const p=video.play();
     if(p&&typeof p.catch==='function')p.catch(()=>hero.classList.remove('is-playing'));
   };
   video.addEventListener('playing',()=>{if(!reduced.matches&&!saveData)hero.classList.add('is-playing');});
   video.addEventListener('error',()=>hero.classList.remove('is-playing'));
   video.addEventListener('stalled',()=>{if(video.readyState<2)hero.classList.remove('is-playing');});
   if('IntersectionObserver' in window){
     new IntersectionObserver(entries=>{
       visible=entries.some(entry=>entry.isIntersecting);
       visible?play():pause();
     },{threshold:.02}).observe(hero);
   }
   document.addEventListener('visibilitychange',()=>document.hidden?pause():play());
   reduced.addEventListener?.('change',()=>reduced.matches?pause():play());
   if(reduced.matches||saveData)pause();else play();
 }
 const form=document.getElementById('contact-enquiry-form');
 const status=document.getElementById('contact-form-status');
 const select=document.getElementById('contact-service');
 document.querySelectorAll('[data-service]').forEach(link=>link.addEventListener('click',()=>{
   if(select)select.value=link.dataset.service;
   if(status)status.textContent='';
 }));
 if(!form)return;
 form.addEventListener('submit',event=>{
   event.preventDefault();
   if(!form.reportValidity())return;
   const name=document.getElementById('contact-name')?.value.trim();
   const email=document.getElementById('contact-email')?.value.trim();
   const company=document.getElementById('contact-company')?.value.trim()||'Not provided';
   const phone=document.getElementById('contact-phone')?.value.trim()||'Not provided';
   const service=select?.value?.trim();
   const project=document.getElementById('contact-project')?.value.trim();
   const website=document.getElementById('contact-website')?.value.trim()||'Not provided';
   const timeframe=document.getElementById('contact-when')?.value.trim()||'No specific timeframe';
   if(!name||!email||!service||!project){
     if(status)status.textContent='Please complete your name, email, service and enquiry.';
     return;
   }
   const subject='AX’ETL enquiry — '+service;
   const body=[
     'Name: '+name,
     'Email: '+email,
     'Company: '+company,
     'Phone: '+phone,
     'Service: '+service,
     'Website: '+website,
     'Preferred timeframe: '+timeframe,
     '',
     'Project or question:',
     project
   ].join('\n');
   if(status)status.textContent='Your email application should open a prepared enquiry. Please review it and press Send.';
   window.location.href='mailto:info@axetl.co.za?subject='+encodeURIComponent(subject)+'&body='+encodeURIComponent(body);
 });
})();
