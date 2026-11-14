// One shared reveal interaction; existing project data and case studies are retained.
(()=>{
 const brand=document.querySelector('#work');
 const web=document.createElement('section');web.id='website-work';brand.after(web);
 const fine=matchMedia('(hover:hover) and (pointer:fine)');
 let active=null,pointer=null,scrollFrame=0;
 // Follow real pointer movement, not enter/leave events caused by resizing rows.
 // Switching directly avoids an intermediate collapse and cancels the old CSS target.
 function rowAt(target){return target instanceof Element?target.closest('.showcase-row'):null;}
 document.addEventListener('pointermove',e=>{
  if(!fine.matches||e.pointerType==='touch')return;
  pointer={x:e.clientX,y:e.clientY};setActive(rowAt(e.target));
 },{passive:true});
 addEventListener('scroll',()=>{
  if(!fine.matches||!pointer||scrollFrame)return;
  scrollFrame=requestAnimationFrame(()=>{scrollFrame=0;setActive(rowAt(document.elementFromPoint(pointer.x,pointer.y)));});
 },{passive:true});
 document.documentElement.addEventListener('pointerleave',()=>{pointer=null;setActive(null)});
 addEventListener('blur',()=>{pointer=null;setActive(null)});
 function setActive(row){
  if(active===row)return;
  if(active){active.classList.remove('is-open');active.querySelector('.showcase-toggle').setAttribute('aria-expanded','false');active.querySelector('.showcase-action').tabIndex=-1;}
  active=row;
  if(row){row.classList.add('is-open');row.querySelector('.showcase-toggle').setAttribute('aria-expanded','true');row.querySelector('.showcase-action').tabIndex=0;}
 }
 function build(section,tag,title,number){
  section.className='reveal-work';section.setAttribute('aria-labelledby',section.id+'-title');
  section.innerHTML=`<div class="showcase-heading"><p class="eyebrow">// SELECTED WORK / ${number}</p><h2 id="${section.id}-title">${title}</h2></div><div class="showcase-list"></div>`;
  const list=section.querySelector('.showcase-list');
  projects.forEach((p,i)=>{
   if(p.tag!==tag)return;
   const row=document.createElement('article');row.className='showcase-row '+(tag==='digital'?'showcase-web':'showcase-brand');
   const target=p.url||(p.website?`sample.html?site=${p.website}`:null);
   // Use the same fixed-aspect image surface as the three live websites.
   const previewFile={sportswear:'pace-preview.svg',hospital:'northwell-preview.svg'}[p.website];
   const previewArt=previewFile?`<img class="website-preview" src="images/${previewFile}" alt="${p.name} homepage preview" width="1264" height="712" loading="lazy">`:p.art;
   row.innerHTML=`<div class="showcase-media" id="preview-${i}"><div class="art ${p.class}">${p.art}</div></div><button type="button" class="showcase-toggle" aria-expanded="false" aria-controls="preview-${i}" aria-label="Preview ${p.name}"><span class="showcase-label"><span class="showcase-name">${p.name}</span><span class="showcase-tags">${p.scope.split(' / ').map(t=>`<span>${t}</span>`).join('')}</span></span></button><div class="showcase-bottom"><p>${p.sub}</p>${target?`<a class="showcase-action" tabindex="-1" href="${target}" target="_blank" rel="noopener noreferrer">${p.url?'Visit website':'Explore prototype'} ↗</a>`:`<button class="showcase-action" tabindex="-1" type="button">Explore case study ↗</button>`}</div>`;
   if(previewFile){const art=row.querySelector('.showcase-media .art');art.className='art featured-website';art.innerHTML=previewArt;}
   row.querySelector('.showcase-media').setAttribute('aria-hidden','true');
   const toggle=row.querySelector('.showcase-toggle');
   row.addEventListener('focusin',()=>setActive(row));
   row.addEventListener('focusout',e=>{if(active===row&&!row.contains(e.relatedTarget))setActive(rowAt(e.relatedTarget))});
   toggle.addEventListener('click',()=>setActive(row));
   row.addEventListener('keydown',e=>{if(e.key==='Escape')setActive(null)});
   if(!target)row.querySelector('.showcase-action').onclick=()=>openCase(i);
   list.append(row);
  });
 }
 build(brand,'identity','Branding and Logos','01');
 build(web,'digital','Website Design','02');
 // Decode nearby previews before hover so the first reveal does not wait for an image.
 const preload=new IntersectionObserver(entries=>entries.forEach(entry=>{
  if(!entry.isIntersecting)return;
  entry.target.querySelectorAll('img').forEach(img=>{img.loading='eager';img.decode?.().catch(()=>{});});
  preload.unobserve(entry.target);
 }),{rootMargin:'800px'});
 document.querySelectorAll('.showcase-row').forEach(row=>preload.observe(row));
 document.addEventListener('pointerdown',e=>{if(active&&!active.contains(e.target))setActive(null)},{passive:true});
})();
