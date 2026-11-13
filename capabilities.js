// Capability descriptions follow hover; touch and keyboard retain explicit controls.
(()=>{
 const source=Array.from(document.querySelectorAll('#services details'));if(!source.length)return;
 const rows=[],finePointer=matchMedia('(hover:hover) and (pointer:fine)');
 let keyboardMode=false;
 function setOpen(row,open){row.classList.toggle('is-active',open);row.querySelector('button').setAttribute('aria-expanded',String(open));const panel=row.querySelector('.cap-panel');panel.setAttribute('aria-hidden',String(!open));panel.inert=!open}
 function activate(row){rows.forEach(item=>setOpen(item,item===row))}
 document.addEventListener('keydown',e=>{if(e.key==='Tab')keyboardMode=true});document.addEventListener('pointerdown',()=>keyboardMode=false,{passive:true});
 source.forEach((detail,i)=>{
  const title=detail.querySelector('summary').childNodes;const label=Array.from(title).filter(n=>n.nodeType===Node.TEXT_NODE).map(n=>n.textContent).join('').trim();
  const description=detail.querySelector('p').textContent;
  const row=document.createElement('article');row.className='cap-row';
  row.innerHTML=`<h3><button type="button" id="cap-toggle-${i}" aria-expanded="false" aria-controls="cap-panel-${i}"><span class="cap-number">${String(i+1).padStart(2,'0')}</span><span class="cap-title">${label}</span><span class="cap-icon" aria-hidden="true"></span></button></h3><div class="cap-panel" id="cap-panel-${i}" role="region" aria-labelledby="cap-toggle-${i}" aria-hidden="true" inert><div class="cap-content"><p class="cap-description">${description}</p></div></div>`;
  detail.replaceWith(row);rows.push(row);const button=row.querySelector('button');
  row.addEventListener('pointerenter',e=>{if(finePointer.matches&&e.pointerType!=='touch'){keyboardMode=false;activate(row)}});
  row.addEventListener('pointerleave',e=>{if(finePointer.matches&&e.pointerType!=='touch')setOpen(row,false)});
  button.addEventListener('focus',()=>{if(keyboardMode)activate(row)});
  row.addEventListener('focusout',e=>{if(!row.contains(e.relatedTarget)&&(!finePointer.matches||!row.matches(':hover')))setOpen(row,false)});
  button.addEventListener('click',e=>{if(!finePointer.matches||e.detail===0){const open=button.getAttribute('aria-expanded')!=='true';activate(open?row:null)}else activate(row)});
  button.addEventListener('keydown',e=>{if(e.key==='Escape'){setOpen(row,false);e.preventDefault()}});
 });
 finePointer.addEventListener('change',()=>activate(null));
})();

