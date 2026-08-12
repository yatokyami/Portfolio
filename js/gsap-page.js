(function(){
  if(!window.gsap)return;

  // page-background.js provides the hero-like animated blue background on these pages.
  const reduced=matchMedia('(prefers-reduced-motion: reduce)').matches;
  const fade=document.getElementById('page-fade'),title=document.getElementById('page-title'),back=document.getElementById('back-btn');
  function chars(){
    document.querySelectorAll('[data-chr]').forEach(el=>{
      const t=el.dataset.chr;el.removeAttribute('data-chr');el.innerHTML='';
      [...t].forEach((c,i)=>{const w=document.createElement('span');w.className='ch-wrap';w.style.setProperty('--i',i);w.innerHTML=`<span class="ch-top">${c===' '?'&nbsp;':c}</span><span class="ch-bot">${c===' '?'&nbsp;':c}</span>`;el.appendChild(w)});
    });
  }
  chars();
  gsap.set(fade,{opacity:0});
  const fadeTargets=[title,back].filter(Boolean);
  if(fadeTargets.length) gsap.set(fadeTargets,{opacity:0});
  // Two-panel cinematic wipe matching homepage reveal
  const _pBase='position:fixed;inset:0;pointer-events:none;';
  const _pDark=document.createElement('div');
  _pDark.style.cssText=_pBase+'background:#0a0a0a;z-index:9998;transform:translateY(0%)';
  const _pBlue=document.createElement('div');
  _pBlue.style.cssText=_pBase+'background:#1e6bff;z-index:9997;transform:translateY(0%)';
  document.body.appendChild(_pDark);
  document.body.appendChild(_pBlue);
  const tl=gsap.timeline({onComplete:()=>{_pDark.remove();_pBlue.remove();}});
  tl.to(_pBlue,{yPercent:-100,duration:.55,ease:'power3.inOut'});
  tl.to(_pDark,{yPercent:-100,duration:.55,ease:'power3.inOut'},'+=0');
  if(back) tl.to(back,{opacity:1,duration:.45,ease:'power2.out'},'-=0.3');
  if(title) tl.to(title,{opacity:1,duration:.45,ease:'power2.out'},'<');
  back?.addEventListener('click',e=>{
    e.preventDefault();
    const exitTargets=[title,back].filter(Boolean);
    gsap.timeline({onComplete:()=>location.href='../index.html'})
      .to(exitTargets.length?exitTargets:fade,{opacity:0,duration:.2})
      .to(fade,{opacity:1,duration:.6,ease:'power2.inOut'});
  });
  if(reduced)return;
  gsap.registerPlugin(ScrollTrigger);
  document.querySelectorAll('.fluid-line path').forEach(path=>{
    const len=path.getTotalLength();gsap.set(path,{strokeDasharray:len,strokeDashoffset:len});
    gsap.to(path,{strokeDashoffset:0,duration:2,ease:'none',scrollTrigger:{trigger:path.closest('section'),start:'top 80%',end:'bottom 20%',scrub:1}});
  });
  document.querySelectorAll('.eyebrow').forEach(el=>gsap.fromTo(el,{clipPath:'inset(0 100% 0 0)'},{clipPath:'inset(0 0% 0 0)',duration:.9,ease:'power3.inOut',scrollTrigger:{trigger:el,start:'top 88%',once:true}}));
  document.querySelectorAll('.skill-group,.favorite-card,.loop-track article,.detail-links a').forEach((el,i)=>{
    gsap.fromTo(el,{opacity:0,y:45,filter:'blur(8px)'},{opacity:1,y:0,filter:'blur(0px)',duration:.75,delay:(i%5)*.04,ease:'power3.out',scrollTrigger:{trigger:el,start:'top 90%',once:true}});
  });
  document.querySelectorAll('.chips span').forEach((el,i)=>gsap.fromTo(el,{opacity:0,y:12},{opacity:1,y:0,duration:.45,delay:i*.025,ease:'power2.out',scrollTrigger:{trigger:el.closest('.skill-group'),start:'top 78%',once:true}}));
  document.querySelectorAll('.magnetic').forEach(el=>{
    const s=.16;el.addEventListener('mousemove',e=>{const r=el.getBoundingClientRect();gsap.to(el,{x:(e.clientX-r.left-r.width/2)*s,y:(e.clientY-r.top-r.height/2)*s,duration:.35,ease:'power3.out'})});el.addEventListener('mouseleave',()=>gsap.to(el,{x:0,y:0,duration:.6,ease:'elastic.out(1,.5)'}) )
  });
  document.querySelectorAll('[data-tilt]').forEach(el=>{
    el.addEventListener('mousemove',e=>{const r=el.getBoundingClientRect(),x=(e.clientX-r.left)/r.width-.5,y=(e.clientY-r.top)/r.height-.5;gsap.to(el,{rotationY:x*6,rotationX:-y*6,transformPerspective:800,duration:.35})});
    el.addEventListener('mouseleave',()=>gsap.to(el,{rotationY:0,rotationX:0,duration:.6,ease:'power3.out'}));
  });
  const loop=document.querySelector('.loop-track');
  if(loop)gsap.to(loop,{x:()=>-(loop.scrollWidth-innerWidth*.55),ease:'none',scrollTrigger:{trigger:'.about-loop',start:'top top',end:'bottom bottom',scrub:1,pin:true,anticipatePin:1}});
  document.querySelectorAll('.contact-hero .art-card').forEach((el,i)=>gsap.to(el,{y:i?70:-55,rotation:i?12:-10,ease:'none',scrollTrigger:{trigger:'.contact-hero',start:'top top',end:'bottom top',scrub:1}}));
  const finalFrame=document.querySelector('.final-frame');
  if(finalFrame)gsap.to(finalFrame,{y:-70,rotation:1,ease:'none',scrollTrigger:{trigger:'.contact-final',start:'top bottom',end:'bottom top',scrub:1}});
  document.querySelectorAll('.hello-form label').forEach((el,i)=>{
    gsap.fromTo(el,{opacity:0,y:24},{opacity:1,y:0,duration:.65,delay:i*.08,ease:'power3.out',scrollTrigger:{trigger:'.hello-form',start:'top 78%',once:true}});
  });
  const formTitle=document.querySelector('.final-copy h2');
  if(formTitle)gsap.fromTo(formTitle,{y:45,opacity:0},{y:0,opacity:1,duration:.9,ease:'power3.out',scrollTrigger:{trigger:'.contact-final',start:'top 78%',once:true}});

  const orbit=document.querySelector('.contact-orbit');if(orbit)gsap.to(orbit,{rotation:360,duration:12,repeat:-1,ease:'none'});
  const final=document.querySelector('.final-frame');if(final)gsap.to(final,{y:-80,rotation:-2,ease:'none',scrollTrigger:{trigger:'.contact-final',start:'top bottom',end:'bottom top',scrub:1}});
})();