// A real-time hero film: cursor-responsive camera, circles and a travelling line.
(()=>{
const stage=document.querySelector('.reel');if(!stage)return;
stage.querySelector('.orb')?.remove();stage.querySelector('.threads')?.remove();
const canvas=document.createElement('canvas');canvas.setAttribute('aria-label','An abstract galaxy of circles connected by a translucent moving line');canvas.setAttribute('role','img');stage.prepend(canvas);
const ctx=canvas.getContext('2d');if(!ctx)return;
let w=1,h=1,dpr=1,time=0,last=0,paused=false,visible=true;
const reduced=matchMedia('(prefers-reduced-motion: reduce)');
const pointer={x:0,y:0},camera={x:0,y:0};
let seed=451;function random(){seed=(seed*16807)%2147483647;return(seed-1)/2147483646}
const circles=Array.from({length:125},(_,i)=>{const a=i*2.399963+random()*.3,r=100+Math.sqrt(i/125)*1050;return{x:Math.cos(a)*r,y:(random()-.5)*560,z:Math.sin(a)*r,radius:i%19===0?35+random()*30:3+random()*15,alpha:.35+random()*.6,tone:i%5}});
function resize(){w=stage.clientWidth;h=stage.clientHeight;dpr=Math.min(devicePixelRatio||1,2);canvas.width=Math.round(w*dpr);canvas.height=Math.round(h*dpr);canvas.style.width=w+'px';canvas.style.height=h+'px';if(reduced.matches)draw(0)}
new ResizeObserver(resize).observe(stage);
stage.addEventListener('pointermove',e=>{const r=stage.getBoundingClientRect();pointer.x=(e.clientX-r.left)/r.width*2-1;pointer.y=(e.clientY-r.top)/r.height*2-1});stage.addEventListener('pointerleave',()=>{pointer.x=0;pointer.y=0});
new IntersectionObserver(entries=>visible=entries[0].isIntersecting).observe(stage);
const button=stage.querySelector('#motion');button.onclick=()=>{paused=!paused;stage.classList.toggle('paused',paused);button.textContent=paused?'Play motion ▷':'Pause motion Ⅱ'};
const palette=['222,231,218','161,186,170','238,231,211','148,164,184','197,163,134'];
function draw(delta){
 if(!paused&&!reduced.matches)time+=Math.min(delta,40)*.00012;
 camera.x+=(pointer.x-camera.x)*.035;camera.y+=(pointer.y-camera.y)*.035;
 ctx.setTransform(dpr,0,0,dpr,0,0);ctx.fillStyle='#111b20';ctx.fillRect(0,0,w,h);
 const glow=ctx.createRadialGradient(w*.5,h*.48,0,w*.5,h*.48,w*.7);glow.addColorStop(0,'#30423f');glow.addColorStop(.5,'#1b2a30');glow.addColorStop(1,'#0d151d');ctx.fillStyle=glow;ctx.fillRect(0,0,w,h);
 const yaw=time*.17+camera.x*.15,pitch=-.26+Math.sin(time*.2)*.07+camera.y*.10,zoom=1+Math.sin(time*.3)*.07;
 const projected=circles.map((p,i)=>{const x=p.x*Math.cos(yaw)-p.z*Math.sin(yaw),z=p.x*Math.sin(yaw)+p.z*Math.cos(yaw);const y=p.y*Math.cos(pitch)-z*Math.sin(pitch),depth=p.y*Math.sin(pitch)+z*Math.cos(pitch)+1750;const scale=Math.min(w,h)*1.9*zoom/Math.max(depth,400);return{x:w*.5+x*scale-camera.x*25,y:h*.48+y*scale-camera.y*18,r:p.radius*scale,depth,alpha:p.alpha,tone:p.tone,i}});
 // An unbroken translucent path travels through the constellation.
 const route=projected.filter((_,i)=>i%7===0).sort((a,b)=>a.i-b.i);
 ctx.lineWidth=.7;ctx.strokeStyle='rgba(192,218,206,.12)';ctx.beginPath();route.forEach((p,i)=>i?ctx.lineTo(p.x,p.y):ctx.moveTo(p.x,p.y));ctx.stroke();
 const travel=(time*.55)%route.length;
 for(let j=0;j<5;j++){const position=(travel-j*.45+route.length)%route.length,index=Math.floor(position),f=position-index,a=route[index],b=route[(index+1)%route.length];const grad=ctx.createLinearGradient(a.x,a.y,b.x,b.y);grad.addColorStop(0,'rgba(207,236,221,0)');grad.addColorStop(1,`rgba(224,245,232,${.5-j*.08})`);ctx.strokeStyle=grad;ctx.lineWidth=1.2;ctx.beginPath();ctx.moveTo(a.x,a.y);ctx.lineTo(a.x+(b.x-a.x)*f,a.y+(b.y-a.y)*f);ctx.stroke();}
 projected.sort((a,b)=>b.depth-a.depth).forEach(p=>{if(p.x<-100||p.x>w+100||p.y<-100||p.y>h+100)return;ctx.beginPath();ctx.arc(p.x,p.y,Math.max(1,p.r),0,Math.PI*2);ctx.fillStyle=`rgba(${palette[p.tone]},${p.alpha})`;ctx.fill();ctx.strokeStyle=`rgba(234,243,230,${p.alpha*.4})`;ctx.lineWidth=.65;ctx.stroke();if(p.r>18){ctx.beginPath();ctx.arc(p.x,p.y,p.r+5,0,Math.PI*2);ctx.strokeStyle='rgba(214,233,222,.14)';ctx.stroke()}});
}
function frame(stamp){const dt=last?stamp-last:16;last=stamp;if(visible&&(!paused||camera.x!==pointer.x||camera.y!==pointer.y))draw(dt);requestAnimationFrame(frame)}resize();draw(0);requestAnimationFrame(frame);
})();
