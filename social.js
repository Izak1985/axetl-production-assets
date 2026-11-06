                                                                                 
(() => {
 'use strict';
 const hero=document.querySelector('.social-hero'),video=document.getElementById('social-hero-video');
 if(!hero||!video)return;
 const reduced=window.matchMedia('(prefers-reduced-motion:reduce)');
 const saveData=Boolean(navigator.connection&&navigator.connection.saveData);
 let inView=true;
 const pause=()=>{video.pause();hero.classList.remove('is-playing')};
 const play=()=>{
   if(document.hidden||reduced.matches||saveData||!inView){pause();return}
   video.muted=true;
   const x=video.play();if(x&&x.catch)x.catch(()=>hero.classList.remove('is-playing'))
 };
 video.addEventListener('playing',()=>{if(!reduced.matches&&!saveData)hero.classList.add('is-playing')});
 video.addEventListener('error',()=>hero.classList.remove('is-playing'));
 if('IntersectionObserver' in window)new IntersectionObserver(entries=>{inView=entries.some(e=>e.isIntersecting);inView?play():pause()},{threshold:.02}).observe(hero);
 document.addEventListener('visibilitychange',()=>document.hidden?pause():play());
 reduced.addEventListener?.('change',()=>reduced.matches?pause():play());
 play();
})();
