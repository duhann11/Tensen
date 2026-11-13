// Inset hero -> full-bleed media, with a separate inner parallax layer.
(()=>{
 const media=document.querySelector('.reel'),canvas=media?.querySelector('canvas'),hero=document.querySelector('.hero');if(!media||!canvas||!hero)return;
 const wrapper=document.createElement('div');wrapper.className='hero-media-scroll';media.before(wrapper);wrapper.append(media);
 const reduced=matchMedia('(prefers-reduced-motion: reduce)'),wide=matchMedia('(min-width:768px)');
 const enabled=()=>wide.matches&&!reduced.matches;
 let progress=0,target=0,fullScale=1,end=1,raf=0,last=0;
 const clamp=x=>Math.max(0,Math.min(1,x));
 function paint(){media.style.setProperty('--hero-scale',String(1+(fullScale-1)*progress));media.style.setProperty('--hero-lift',(-24*progress).toFixed(3)+'px');media.style.setProperty('--hero-radius',(8*(1-progress)).toFixed(3)+'px');canvas.style.transform=`translate3d(0,${(6*progress).toFixed(3)}%,0) scale(${(1+.14*progress).toFixed(5)})`;wrapper.dataset.expansion=progress.toFixed(3)}
 function animate(now){raf=0;const dt=last?Math.min(50,now-last):16;last=now;target=enabled()?clamp(scrollY/end):0;progress+=(target-progress)*(1-Math.exp(-Math.max(1,dt)/180));if(Math.abs(target-progress)<.0002)progress=target;paint();if(Math.abs(target-progress)>.0002)schedule()}
 function schedule(){if(!raf)raf=requestAnimationFrame(animate)}
 function measure(){
  const pageWidth=document.documentElement.clientWidth;
  wrapper.style.width=enabled()?pageWidth+'px':'100%';wrapper.style.marginLeft=enabled()?`calc((100% - ${pageWidth}px) / 2)`:'0px';
  const headerHeight=document.querySelector('header').getBoundingClientRect().height;
  fullScale=enabled()?pageWidth/media.offsetWidth:1;
  // Finish expanding as the media reaches the sticky header, then scroll away normally.
  end=Math.max(innerHeight*.55,scrollY+wrapper.getBoundingClientRect().top+24-headerHeight);
  progress=enabled()?clamp(scrollY/end):0;paint();schedule();
 }
 addEventListener('scroll',schedule,{passive:true});addEventListener('resize',measure);reduced.addEventListener('change',measure);wide.addEventListener('change',measure);new ResizeObserver(()=>requestAnimationFrame(measure)).observe(hero);document.fonts?.ready.then(measure);measure();
})();
