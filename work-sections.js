// Two consecutive, independently pinned galleries share the same card treatment.
(()=>{
 const brandSection=document.querySelector('#work');
 const webSection=document.createElement('section');webSection.id='website-work';webSection.className='work';brandSection.after(webSection);
 const motionPreference=matchMedia('(prefers-reduced-motion: reduce)');
 const galleries=[];let frame=0,lastTime=0;
 const pinned=()=>innerWidth>=992&&!motionPreference.matches;
 function makeGallery(section,tag,title,description,index){
  const entries=projects.map((project,i)=>({project,i})).filter(({project})=>project.tag===tag);
  const headingId=section.id+'-title';section.setAttribute('aria-labelledby',headingId);
  section.innerHTML=`<div class="work-pin"><div class="section-head"><div><p class="eyebrow">// SELECTED WORK / ${index}</p><h2 id="${headingId}">${title}</h2></div><p>${description}</p></div><div class="work-viewport" tabindex="0" role="region" aria-label="${title} project gallery"><div class="project-track">${entries.map(({project:p,i},n)=>`<button class="project work-slide" data-project="${i}" aria-label="${p.url?'Visit':'View'} ${p.name}${p.url?' website (opens in a new tab)':' case study'}"><div class="art ${p.class}">${p.art}<span class="case-pill">${p.url?'Visit website':'Explore case study'} ↗</span></div><div class="work-card-body"><div><p class="eyebrow">${String(n+1).padStart(2,'0')} / ${tag==='identity'?'BRAND DESIGN':'WEBSITE DESIGN'}</p><h3>${p.name}<br>${p.sub}</h3><p>${p.scope}</p></div><div class="work-card-brief"><p>${p.brief}</p><span>${p.url?new URL(p.url).hostname:'SELF-INITIATED CONCEPT · 2026'}</span></div></div></button>`).join('')}</div></div><div class="work-progress"><span class="work-position">01 / ${String(entries.length).padStart(2,'0')}</span><div><i></i></div><span class="work-scroll-hint">SCROLL TO EXPLORE →</span></div></div>`;
  const viewport=section.querySelector('.work-viewport'),track=section.querySelector('.project-track');
  const gallery={section,viewport,track,cards:Array.from(track.children),starts:[],count:entries.length,x:0,distance:0,headerHeight:0};galleries.push(gallery);
  track.querySelectorAll('[data-project]').forEach(button=>button.addEventListener('click',()=>{const i=Number(button.dataset.project);const p=projects[i];if(p.url){window.open(p.url,'_blank','noopener,noreferrer');return}openCase(i);if(p.website){const link=document.createElement('a');link.className='button';link.href=`sample.html?site=${p.website}`;link.target='_blank';link.rel='noopener';link.textContent='Explore website prototype ↗';document.querySelector('#case-content').append(link)}}));
  viewport.addEventListener('scroll',()=>{if(!pinned())paint(gallery,viewport.scrollLeft,viewport.scrollWidth-viewport.clientWidth)},{passive:true});
 }
 function paint(g,position,distance){g.cards.forEach((card,i)=>{if(!pinned()){card.style.transform='';return}const left=(g.starts[i]||0)-position,start=g.viewport.clientWidth*.90,end=g.viewport.clientWidth*.35,progress=Math.max(0,Math.min(1,(start-left)/(start-end))),eased=progress*progress*(3-2*progress),lift=Math.min(150,g.viewport.clientHeight*.28)*(1-eased);card.style.transform=`translate3d(0,${lift.toFixed(3)}px,0)`;});const progress=distance?Math.max(0,Math.min(1,position/distance)):0;g.section.querySelector('.work-progress i').style.transform=`scaleX(${progress})`;g.section.querySelector('.work-position').textContent=`${String(Math.min(g.count,Math.round(progress*(g.count-1))+1)).padStart(2,'0')} / ${String(g.count).padStart(2,'0')}`}
 function measure(){
  const headerHeight=Math.ceil(document.querySelector('header').getBoundingClientRect().height);
  // Set both gallery heights before reading positions, so the second starts after the first.
  galleries.forEach(g=>{g.headerHeight=headerHeight;g.section.style.setProperty('--header-height',headerHeight+'px');g.starts=g.cards.map(card=>card.offsetLeft-g.cards[0].offsetLeft);g.distance=Math.max(0,g.track.scrollWidth-g.viewport.clientWidth);g.section.style.height=pinned()?Math.max(1,innerHeight-headerHeight)+g.distance+'px':'auto';g.section.querySelector('.work-scroll-hint').textContent=pinned()?'SCROLL TO EXPLORE →':'SWIPE TO EXPLORE →'});
  galleries.forEach(g=>{g.x=pinned()?Math.max(0,Math.min(g.distance,headerHeight-g.section.getBoundingClientRect().top)):0;g.track.style.transform=pinned()?`translate3d(${-g.x}px,0,0)`:'none';paint(g,pinned()?g.x:g.viewport.scrollLeft,pinned()?g.distance:g.viewport.scrollWidth-g.viewport.clientWidth)});schedule();
 }
 function animate(now){frame=0;const dt=lastTime?Math.min(50,now-lastTime):16;lastTime=now;let moving=false;if(pinned())galleries.forEach(g=>{const raw=g.headerHeight-g.section.getBoundingClientRect().top,target=Math.max(0,Math.min(g.distance,raw));g.x+=(target-g.x)*(1-Math.exp(-Math.max(1,dt)/110));if(Math.abs(target-g.x)<.15||raw<0||raw>g.distance)g.x=target;g.track.style.transform=`translate3d(${-g.x.toFixed(3)}px,0,0)`;paint(g,g.x,g.distance);if(Math.abs(target-g.x)>.15)moving=true});if(moving)schedule()}
 function schedule(){if(!frame)frame=requestAnimationFrame(animate)}
 // Branding is handled separately by branding-stack.js.
 makeGallery(webSection,'digital','Website design.','Selected websites and digital experiences.<br>Thoughtful interfaces, connected by design.','02');
 addEventListener('scroll',schedule,{passive:true});addEventListener('resize',measure);motionPreference.addEventListener('change',measure);
 new ResizeObserver(()=>requestAnimationFrame(measure)).observe(document.querySelector('header'));
 document.fonts?.ready.then(measure);requestAnimationFrame(measure);
})();

