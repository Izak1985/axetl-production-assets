                                                                                                    
(() => {
 'use strict';
 const hero=document.querySelector('.biz-hero');
 const video=document.getElementById('biz-hero-video');
 const reduced=window.matchMedia('(prefers-reduced-motion: reduce)');
 const saveData=Boolean(navigator.connection && navigator.connection.saveData);
 if(hero&&video){
  let inView=true;
  const pause=()=>{video.pause();hero.classList.remove('is-playing');};
  const play=()=>{
    if(reduced.matches||saveData||document.hidden||!inView){pause();return;}
    video.muted=true;
    const p=video.play();
    if(p&&typeof p.catch==='function')p.catch(()=>hero.classList.remove('is-playing'));
  };
  video.addEventListener('playing',()=>{if(!reduced.matches&&!saveData)hero.classList.add('is-playing');});
  video.addEventListener('error',()=>hero.classList.remove('is-playing'));
  video.addEventListener('stalled',()=>{if(video.readyState<2)hero.classList.remove('is-playing');});
  if('IntersectionObserver' in window){
   new IntersectionObserver(entries=>{
     inView=entries.some(entry=>entry.isIntersecting);
     inView?play():pause();
   },{threshold:.02}).observe(hero);
  }
  document.addEventListener('visibilitychange',()=>document.hidden?pause():play());
  reduced.addEventListener?.('change',()=>reduced.matches?pause():play());
  if(reduced.matches||saveData)pause();else play();
 }
 const workflows={
  payroll:{
   name:'Monthly payroll cycle',
   description:'A repeatable sequence that keeps input collection, processing and client approvals distinct.',
   status:'PAYROLL PROCESS / SELECTED',
   steps:[
    ['Collect & check','Receive staff changes and monthly inputs with an agreed checklist.'],
    ['Process & review','Prepare calculations, reports and a clear exception record.'],
    ['Client approves','Present a release-ready pack for the authorised client’s review.'],
    ['File & hand over','Retain agreed supporting records and organise the monthly handoff.']
   ]
  },
  records:{
   name:'Bookkeeping records',
   description:'Give monthly transactions and supporting documents a consistent place to live.',
   status:'RECORDS PROCESS / SELECTED',
   steps:[
    ['Gather documents','Collect income, expense, bank and other relevant source records.'],
    ['Categorise & reconcile','Organise transactions and check balances or exceptions.'],
    ['Review summaries','Prepare an understandable monthly record pack for discussion.'],
    ['Archive & hand off','Retain documents and share agreed outputs with the responsible adviser.']
   ]
  },
  sops:{
   name:'Standard procedures',
   description:'Turn a recurring task into a consistent sequence your team can follow.',
   status:'SOP PROCESS / SELECTED',
   steps:[
    ['Observe the work','Identify the current steps, owners and inputs involved.'],
    ['Document the route','Write practical instructions, decisions and handoff points.'],
    ['Check with the team','Review the procedure with the people responsible for it.'],
    ['Maintain the version','Agree on ownership, updates and how the SOP is shared.']
   ]
  }
 };
 const steps=document.getElementById('biz-workflow-steps');
 const name=document.getElementById('biz-workflow-name');
 const description=document.getElementById('biz-workflow-description');
 const status=document.getElementById('biz-workflow-state');
 const tabs=[...document.querySelectorAll('[data-workflow]')];
 function setWorkflow(key){
  const model=workflows[key];if(!model||!steps)return;
  if(name)name.textContent=model.name;
  if(description)description.textContent=model.description;
  if(status)status.textContent=model.status;
  steps.replaceChildren();
  model.steps.forEach(([heading,detail],i)=>{
    const li=document.createElement('li');
    const number=document.createElement('span');number.textContent=String(i+1).padStart(2,'0');
    const strong=document.createElement('strong');strong.textContent=heading;
    const p=document.createElement('p');p.textContent=detail;
    li.append(number,strong,p);steps.appendChild(li);
  });
  tabs.forEach(tab=>{
    const on=tab.dataset.workflow===key;
    tab.classList.toggle('active',on);
    tab.setAttribute('aria-pressed',String(on));
  });
 }
 tabs.forEach(tab=>tab.addEventListener('click',()=>setWorkflow(tab.dataset.workflow)));
 const choice=document.getElementById('biz-service');
 const form=document.getElementById('biz-enquiry-form');
 const formStatus=document.getElementById('biz-form-status');
 document.querySelectorAll('[data-service]').forEach(link=>link.addEventListener('click',()=>{
   if(choice)choice.value=link.dataset.service;
   if(formStatus)formStatus.textContent='';
 }));
 if(!form)return;
 form.addEventListener('submit',event=>{
  event.preventDefault();
  if(!form.reportValidity())return;
  const name=document.getElementById('biz-name')?.value.trim();
  const email=document.getElementById('biz-email')?.value.trim();
  const business=document.getElementById('biz-business')?.value.trim();
  const service=choice?.value?.trim();
  if(!name||!email||!business||!service){
    if(formStatus)formStatus.textContent='Please enter your name, email, business and service.';
    return;
  }
  const team=document.getElementById('biz-team-size')?.value.trim()||'Not provided';
  const website=document.getElementById('biz-website')?.value.trim()||'Not provided';
  const details=document.getElementById('biz-message')?.value.trim()||'Not provided';
  const subject='AX’ETL Business Solutions enquiry — '+service;
  const body=['Name: '+name,'Email: '+email,'Business: '+business,'Service: '+service,'Team size: '+team,'Website: '+website,'','Business challenge:',details].join('\n');
  if(formStatus)formStatus.textContent='Your email application should open a prepared enquiry. Please review and send it there.';
  window.location.href='mailto:info@axetl.co.za?subject='+encodeURIComponent(subject)+'&body='+encodeURIComponent(body);
 });
})();
