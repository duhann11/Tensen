// Branding-only interpretation of the supplied sketch and perspective-card reference.
(()=>{
 const root=document.querySelector('#work');root.className='branding-work';
 const entries=projects.map((p,i)=>({p,i})).filter(({p})=>p.tag==='identity');
 const names=['nami','FORME®','OFFGRID↗','morrow','Sora','mitti','Relay↗','aster','AFTERHOURS'];
 root.setAttribute('aria-labelledby','branding-title');
 root.innerHTML=`<div class="branding-pin"><div class="branding-heading"><p class="eyebrow">// SELECTED WORK / 01</p><h2 id="branding-title">Branding and Logos</h2></div><div class="branding-stage"><div class="branding-layer layer-back" aria-hidden="true"></div><div class="branding-layer layer-middle" aria-hidden="true"></div>${entries.map(({p,i},n)=>`<article class="branding-card" data-brand-index="${n}"><div class="branding-logo" data-theme="${p.class}" aria-label="${p.name} concept wordmark"><span class="brand-symbol" aria-hidden="true">${n===0?'≋':n===3?'◎':n===6?'↗':n===7?'✳':'○'}</span><strong>${names[n]}</strong><small>IDENTITY / ${String(n+1).padStart(2,'0')}</small></div><div class="branding-copy"><p class="eyebrow">${String(n+1).padStart(2,'0')} / BRAND IDENTITY</p><h3>${p.name}</h3><p class="branding-description">${p.brief}</p><div class="branding-card-foot"><span>${p.scope}</span><button type="button" class="branding-case" data-project="${i}">Explore case study <span>↗</span></button></div></div></article>`).join('')}</div><div class="branding-controls"><span class="branding-counter">01 / 09</span><div class="branding-progress"><i></i></div><span class="branding-scroll">SCROLL TO DISCOVER ↓</span><button type="button" class="branding-prev" aria-label="Previous brand">↑</button><button type="button" class="branding-next" aria-label="Next brand">↓</button></div></div>`;
 const cards=Array.from(root.querySelectorAll('.branding-card')),stage=root.querySelector('.branding-stage'),counter=root.querySelector('.branding-counter');
 const reduced=matchMedia('(prefers-reduced-motion: reduce)');const desktop=()=>innerWidth>=992&&!reduced.matches;

 // ?brand-motion=stack keeps the previous presentation available for comparison.
 if(window.gsap&&window.ScrollTrigger&&new URLSearchParams(location.search).get('brand-motion')!=='stack'){
  gsap.registerPlugin(ScrollTrigger);
  const media=gsap.matchMedia();let active=0,stepSize=600,trigger;
  const progressBar=root.querySelector('.branding-progress i'),prev=root.querySelector('.branding-prev'),next=root.querySelector('.branding-next');
  const clamp=gsap.utils.clamp(0,1),turnEase=gsap.parseEase('power1.inOut');
  function accessibility(index){active=index;cards.forEach((card,i)=>{card.inert=i!==index;card.setAttribute('aria-hidden',String(i!==index));card.style.pointerEvents=i===index?'auto':'none'});counter.textContent=`${String(index+1).padStart(2,'0')} / ${String(cards.length).padStart(2,'0')}`;prev.disabled=index===0;next.disabled=index===cards.length-1}
  media.add('(min-width:992px) and (prefers-reduced-motion:no-preference)',()=>{
   root.classList.add('notebook-flip');const state={position:0};let travel=0;
   function measure(){const header=Math.ceil(document.querySelector('header').getBoundingClientRect().height);root.style.setProperty('--brand-header',header+'px');stepSize=Math.max(560,cards[0].offsetHeight*1.5);travel=(cards.length-1)*stepSize;root.style.height=innerHeight-header+travel+stepSize*.25+'px'}
   function paint(){const index=Math.min(cards.length-1,Math.floor(state.position)),phase=state.position-index,t=turnEase(clamp((phase-.12)/.84));
    cards.forEach((card,i)=>{const outgoing=i===index,incoming=i===index+1&&t>0;card.style.visibility=outgoing||incoming?'visible':'hidden';card.style.zIndex=incoming?'3':'2';
     gsap.set(card,{rotationX:outgoing?t*2:-88*(1-t),y:outgoing?-14*t:0,z:outgoing?-32*t:0,scale:outgoing?1-.025*t:.97+.03*t,opacity:1,transformOrigin:'50% 100%',force3D:true});
     card.style.setProperty('--page-shade',incoming?String(Math.sin((1-t)*Math.PI/2)*.15):String(t*.055));
    });accessibility(Math.min(cards.length-1,index+(t>.65?1:0)));progressBar.style.transform=`scaleX(${state.position/(cards.length-1)})`;
   }
   measure();paint();
   const tween=gsap.to(state,{position:cards.length-1,duration:cards.length-1,ease:'none',onUpdate:paint,scrollTrigger:{id:'branding-notebook',trigger:root,start:()=>`top top+=${Math.ceil(document.querySelector('header').getBoundingClientRect().height)}`,end:()=>'+='+travel,scrub:.12,invalidateOnRefresh:true,onRefreshInit:measure}});trigger=tween.scrollTrigger;
   const observer=new ResizeObserver(()=>ScrollTrigger.refresh());observer.observe(document.querySelector('header'));document.fonts?.ready.then(()=>ScrollTrigger.refresh());
   return()=>{observer.disconnect();trigger=null;root.classList.remove('notebook-flip');root.style.height='auto';cards.forEach(card=>{gsap.set(card,{clearProps:'all'});card.inert=false;card.removeAttribute('aria-hidden')})};
  });
  function goFlip(direction){if(trigger)window.scrollTo({top:trigger.start+Math.max(0,Math.min(cards.length-1,active+direction))*stepSize,behavior:'smooth'})}
  prev.onclick=()=>goFlip(-1);next.onclick=()=>goFlip(1);root.querySelectorAll('[data-project]').forEach(button=>button.addEventListener('click',()=>openCase(Number(button.dataset.project))));
  return;
 }
 let headerHeight=94,step=900,distance=0,position=0,target=0,raf=0,last=0,current=0;
 const clamp=(x,min,max)=>Math.max(min,Math.min(max,x));const ease=x=>x*x*(3-2*x);
 function paint(){
  const index=Math.min(cards.length-1,Math.floor(position)),phase=position-index,t=ease(clamp((phase-.10)/.86,0,1));current=Math.min(cards.length-1,index+(t>.6?1:0));
  const height=cards[0].offsetHeight;
  cards.forEach((card,i)=>{if(!desktop()){card.style.cssText='';card.querySelector('.branding-copy').style.opacity='';card.querySelector('.branding-logo').style.opacity='';card.inert=false;card.removeAttribute('aria-hidden');return}const outgoing=i===index,incoming=i===index+1&&t>0,show=outgoing||incoming;card.style.visibility=show?'visible':'hidden';card.style.pointerEvents=i===current?'auto':'none';card.style.zIndex=outgoing?'2':'3';card.style.opacity='1';card.style.transform=outgoing?`translate3d(0,${-t*20}px,${-t*50}px) rotateX(${t*4}deg) scale(${1-t*.025})`:`translate3d(0,${(1-t)*(height+12)}px,0) rotateX(${-3*(1-t)}deg) scale(${.985+t*.015})`;const contentOpacity='1';card.querySelector('.branding-copy').style.opacity=contentOpacity;card.querySelector('.branding-logo').style.opacity=contentOpacity;card.inert=i!==current;card.setAttribute('aria-hidden',String(i!==current))});
  counter.textContent=`${String(current+1).padStart(2,'0')} / ${String(cards.length).padStart(2,'0')}`;root.querySelector('.branding-progress i').style.transform=`scaleX(${position/(cards.length-1)})`;root.querySelector('.branding-prev').disabled=current===0;root.querySelector('.branding-next').disabled=current===cards.length-1;
 }
 function animate(now){raf=0;if(!desktop())return;const dt=last?Math.min(50,now-last):16;last=now;const raw=headerHeight-root.getBoundingClientRect().top;target=clamp(raw/step,0,cards.length-1);position+=(target-position)*(1-Math.exp(-Math.max(1,dt)/110));if(Math.abs(target-position)<.0005||raw<0||raw>distance)position=target;paint();if(Math.abs(target-position)>.0005)schedule()}
 function schedule(){if(!raf)raf=requestAnimationFrame(animate)}
 function measure(){headerHeight=Math.ceil(document.querySelector('header').getBoundingClientRect().height);root.style.setProperty('--brand-header',headerHeight+'px');step=Math.max(480,(cards[0].offsetHeight+12)/.86);distance=(cards.length-1)*step+step*.45;root.style.height=desktop()?innerHeight-headerHeight+distance+'px':'auto';position=desktop()?clamp((headerHeight-root.getBoundingClientRect().top)/step,0,cards.length-1):0;paint();schedule()}
 root.querySelectorAll('[data-project]').forEach(button=>button.addEventListener('click',()=>openCase(Number(button.dataset.project))));
 function go(direction){if(!desktop())return;const next=clamp(current+direction,0,cards.length-1),sectionTop=scrollY+root.getBoundingClientRect().top;window.scrollTo({top:sectionTop-headerHeight+next*step,behavior:'smooth'})}
 root.querySelector('.branding-prev').onclick=()=>go(-1);root.querySelector('.branding-next').onclick=()=>go(1);
 addEventListener('scroll',schedule,{passive:true});addEventListener('resize',measure);reduced.addEventListener('change',measure);new ResizeObserver(()=>requestAnimationFrame(measure)).observe(document.querySelector('header'));document.fonts?.ready.then(measure);requestAnimationFrame(measure);
})();
