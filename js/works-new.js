(function () {
  if (!window.gsap) return;
  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const counter = document.getElementById('work-counter');
  gsap.registerPlugin(ScrollTrigger);

  if (counter) gsap.to(counter, { opacity: 1, duration: .6, delay: .9, ease: 'power2.out' });

  // Split intro heading lines
  document.querySelectorAll('.work-intro h1 span').forEach((el, i) => {
    gsap.fromTo(el, { yPercent: 110 }, {
      yPercent: 0, duration: 1, delay: .35 + i * .07, ease: 'power4.out'
    });
  });
  gsap.fromTo('.work-intro-lede', { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 1, delay: .7, ease: 'power3.out' });
  gsap.fromTo('.work-intro-meta', { opacity: 0 }, { opacity: 1, duration: .8, delay: .9, ease: 'power2.out' });

  if (reduced) {
    document.querySelectorAll('.work-curtain').forEach(c => c.style.display = 'none');
    return;
  }

  // Curtain reveal per project row — panel wipes up to reveal the image
  document.querySelectorAll('.work-item').forEach((item, i) => {
    const curtain = item.querySelector('.work-curtain');
    const img = item.querySelector('.work-img');
    const title = item.querySelector('.work-title span');
    const rest = item.querySelectorAll('.work-meta, .work-brief, .work-tags, .work-cta');

    const tl = gsap.timeline({
      scrollTrigger: { trigger: item, start: 'top 78%', once: true }
    });

    if (curtain) tl.to(curtain, { scaleY: 0, duration: 1.1, ease: 'power4.inOut' }, 0);
    if (img) tl.fromTo(img, { scale: 1.18 }, { scale: 1, duration: 1.3, ease: 'power3.out' }, 0);
    if (title) tl.fromTo(title, { yPercent: 100 }, { yPercent: 0, duration: .9, ease: 'power4.out' }, .25);
    tl.fromTo(rest, { opacity: 0, y: 22 }, { opacity: 1, y: 0, duration: .7, stagger: .06, ease: 'power3.out' }, .35);
  });

  document.querySelectorAll('.eyebrow').forEach(el => gsap.fromTo(el,
    { clipPath: 'inset(0 100% 0 0)' },
    { clipPath: 'inset(0 0% 0 0)', duration: .9, ease: 'power3.inOut', scrollTrigger: { trigger: el, start: 'top 88%', once: true } }
  ));
})();
