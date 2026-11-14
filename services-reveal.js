// A red thread draws down the Capabilities rows, connecting each part as it arrives.
(()=>{
 if(!window.gsap||!window.ScrollTrigger)return;
 gsap.registerPlugin(ScrollTrigger);
 const section=document.querySelector('#services');
 if(!section)return;
 const rows=[...section.querySelectorAll('.cap-row')];
 if(rows.length<2)return;
 const list=rows[0].parentElement;
 const intro=[...section.children[0].querySelectorAll('.eyebrow,h2,p')];
 gsap.matchMedia().add('(min-width:992px) and (prefers-reduced-motion:no-preference)',()=>{
  gsap.set(list,{position:'relative'});
  const track=document.createElement('div');
  track.className='cap-list-track';
  track.innerHTML='<span class="cap-thread"></span>'+rows.map(()=>'<span class="cap-node"></span>').join('');
  list.prepend(track);
  const thread=track.querySelector('.cap-thread'),nodes=[...track.querySelectorAll('.cap-node')];
  const height=list.scrollHeight||1;
  nodes.forEach((node,i)=>node.style.top=(rows[i].offsetTop-3)+'px');
  gsap.set(rows,{opacity:0,x:-28});
  gsap.set(intro,{opacity:0,y:26});
  const tl=gsap.timeline({scrollTrigger:{trigger:section,start:'top 72%',end:'top 15%',scrub:.4}});
  tl.to(intro,{opacity:1,y:0,duration:.5,stagger:.15},0)
    .to(thread,{scaleY:1,duration:2.4,ease:'none'},.2);
  rows.forEach((row,i)=>{
   const at=.2+2.4*(row.offsetTop/height);
   tl.to(nodes[i],{scale:1,duration:.3,ease:'back.out(2)'},at)
     .to(row,{opacity:1,x:0,duration:.45},at);
  });
  return ()=>{track.remove();gsap.set(rows.concat(intro),{clearProps:'opacity,transform'});};
 });
})();
