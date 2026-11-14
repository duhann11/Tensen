// Literalizes "TEN means dot, SEN means line" as a scroll-scrubbed draw-on for the About section.
(()=>{
 if(!window.gsap||!window.ScrollTrigger)return;
 gsap.registerPlugin(ScrollTrigger);
 const principles=document.querySelector('.about-principles');
 if(!principles)return;
 const articles=[...principles.children].filter(el=>el.tagName==='ARTICLE');
 if(articles.length!==3)return;
 gsap.matchMedia().add('(min-width:992px) and (prefers-reduced-motion:no-preference)',()=>{
  const track=document.createElement('div');
  track.className='principle-track';
  track.innerHTML='<span class="principle-dot"></span><span class="principle-line"></span>';
  principles.prepend(track);
  const dot=track.querySelector('.principle-dot'),line=track.querySelector('.principle-line');
  gsap.set(articles,{opacity:0,y:24});
  const tl=gsap.timeline({scrollTrigger:{trigger:principles,start:'top 78%',end:'top 28%',scrub:.4}});
  tl.to(dot,{scale:1,duration:.4,ease:'back.out(2)'})
    .to(line,{scaleX:1,duration:2.2,ease:'none'},'<')
    .to(articles[0],{opacity:1,y:0,duration:.5},.1)
    .to(articles[1],{opacity:1,y:0,duration:.5},.85)
    .to(articles[2],{opacity:1,y:0,duration:.5},1.6);
  return ()=>{track.remove();gsap.set(articles,{clearProps:'opacity,transform'});};
 });
})();
