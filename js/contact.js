/* Contact page motion is handled by gsap-page.js. */

(function(){
  const form=document.getElementById('hello-form');
  const status=document.getElementById('hello-status');
  if(!form)return;
  form.addEventListener('submit',function(e){
    e.preventDefault();
    const name=form.elements.name.value.trim();
    const email=form.elements.email.value.trim();
    const message=form.elements.message.value.trim();
    if(!name||!email||!message){
      status.textContent='Please fill in all three fields.';
      gsap.fromTo(status,{x:-8},{x:0,duration:.45,ease:'elastic.out(1,.4)'});
      return;
    }
    status.textContent='Opening your email client…';
    const subject=encodeURIComponent('Portfolio inquiry from '+name);
    const body=encodeURIComponent('Name: '+name+'\nEmail: '+email+'\n\n'+message);
    window.location.href='mailto:aditya.sharma@email.com?subject='+subject+'&body='+body;
  });
})();
