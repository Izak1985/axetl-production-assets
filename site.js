                                                             
                                                                                         
(() => {
 'use strict';
                                                                             
                                                                          
 document.querySelectorAll('a[href]').forEach(a=>{
   const raw=a.getAttribute('href');
   if(!raw)return;
   try{
     const url=new URL(raw,window.location.href);
     if(url.origin===window.location.origin && url.pathname==='/' && !url.search){
       a.setAttribute('href','/home-page/'+url.hash);
     }
   }catch(_error){}
 });

                                                                          
 const waNumber='27713615428';
 const waGreeting=encodeURIComponent("Hello AX’ETL, I’d like to discuss your digital services.");
 const waUrl='https://wa.me/'+waNumber+'?text='+waGreeting;
 const makeWaLink=(label,placement)=>{
   const a=document.createElement('a');
   a.className='axi-wa-cta axi-wa-'+placement;
   a.href=waUrl;
   a.target='_blank';
   a.rel='noopener noreferrer';
   a.setAttribute('aria-label','Chat with AX’ETL on WhatsApp (opens in a new tab)');
   const glyph=document.createElement('span');
   glyph.className='axi-wa-icon';
   glyph.textContent='☎';
   glyph.setAttribute('aria-hidden','true');
   const name=document.createElement('span');
   name.className='axi-wa-label';
   name.textContent=label;
   a.append(glyph,name);
   return a;
 };
 const topNav=document.querySelector('#site-header .nav-container');
 if(topNav&&!topNav.querySelector('.axi-wa-header')){
   const wa=makeWaLink('WhatsApp','header');
   const contact=topNav.querySelector('.nav-cta');
   if(contact)contact.before(wa);else topNav.append(wa);
 }
 const mobileNav=document.querySelector('#mobile-nav');
 if(mobileNav&&!mobileNav.querySelector('.axi-wa-mobile'))mobileNav.append(makeWaLink('Chat on WhatsApp','mobile'));
 const footerWa=document.querySelector('.site-footer a[href*="wa.me/"]');
 if(footerWa){
   footerWa.href=waUrl;
   footerWa.target='_blank';
   footerWa.rel='noopener noreferrer';
   footerWa.classList.add('axi-wa-cta','axi-wa-footer');
   footerWa.textContent='☎  WhatsApp us  ↗';
   footerWa.setAttribute('aria-label','Chat with AX’ETL on WhatsApp (opens in a new tab)');
 }

 const details=document.querySelector('.nav-services');
 if(details){
   document.addEventListener('click',event=>{
     if(details.open&&!details.contains(event.target))details.open=false;
   });
   document.addEventListener('keydown',event=>{
     if(event.key==='Escape')details.open=false;
   });
   details.querySelectorAll('a').forEach(a=>a.addEventListener('click',()=>details.open=false));
 }
 const contactForm=document.getElementById('contact-enquiry-form');
 if(!contactForm)return;
 const params=new URLSearchParams(window.location.search);
 const field=document.getElementById('contact-service');
 const project=document.getElementById('contact-project');
 const notice=document.getElementById('contact-service-context');
 const incoming=(params.get('service')||'').trim();
 if(field&&incoming){
   const available=[...field.options].some(option=>option.value===incoming&&!option.disabled);
   if(available){
     field.value=incoming;
     if(notice){
       notice.textContent='ENQUIRY SELECTED / '+incoming.toUpperCase();
       notice.hidden=false;
     }
   }
 }
 const topic=(params.get('topic')||'').trim().slice(0,180);
 if(topic&&project&&!project.value.trim()){
   project.value='I would like to discuss: '+topic+'\n\n';
 }
})();
