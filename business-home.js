                                                                                          
(() => {
 'use strict';
 const hero=document.querySelector('.hero');
 const video=document.getElementById('home-business-video');
 if(!hero||!video)return;
 const reduce=window.matchMedia('(prefers-reduced-motion: reduce)');
 const saveData=Boolean(navigator.connection?.saveData);
 let inView=true;
 function pause(){video.pause();hero.classList.remove('is-video-playing');}
 function play(){
   if(reduce.matches||saveData||document.hidden||!inView){pause();return;}
   video.muted=true;
   const result=video.play();
   if(result&&typeof result.catch==='function')result.catch(()=>hero.classList.remove('is-video-playing'));
 }
 video.addEventListener('playing',()=>{if(!reduce.matches&&!saveData)hero.classList.add('is-video-playing');});
 video.addEventListener('error',()=>hero.classList.remove('is-video-playing'));
 video.addEventListener('stalled',()=>{if(video.readyState<2)hero.classList.remove('is-video-playing');});
 if('IntersectionObserver' in window){
   new IntersectionObserver(entries=>{
     inView=entries.some(entry=>entry.isIntersecting);
     if(inView)play();else pause();
   },{threshold:.02}).observe(hero);
 }
 document.addEventListener('visibilitychange',()=>document.hidden?pause():play());
 reduce.addEventListener?.('change',()=>reduce.matches?pause():play());
 if(reduce.matches||saveData)pause();else play();
})();
