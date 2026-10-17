(function(){
  document.addEventListener('DOMContentLoaded',function(){
    var current=(location.pathname.split('/').pop()||'index.html');
    document.querySelectorAll('a[href]').forEach(function(link){
      var href=link.getAttribute('href');
      if(!href||href.charAt(0)==='#'||href.indexOf(':')>-1)return;
      var parts=href.split('#');
      var target=(parts[0].split('/').pop()||'index.html');
      var targetHash=parts[1]?'#'+parts[1]:'';
      if(target===current&&(!targetHash||targetHash===location.hash))link.setAttribute('aria-current','page');
    });
    var header=document.querySelector('.commercial-site-head');
    if(!header)return;
    var toggle=header.querySelector('.commercial-nav-toggle');
    var nav=header.querySelector('.main-nav');
    var service=header.querySelector('.commercial-services-item');
    var trigger=header.querySelector('.commercial-services-trigger');
    function setNav(open){nav.classList.toggle('is-open',open);toggle.setAttribute('aria-expanded',String(open));document.body.style.overflow=open?'hidden':''}
    function setServices(open){service.classList.toggle('is-open',open);trigger.setAttribute('aria-expanded',String(open))}
    toggle.addEventListener('click',function(){setNav(!nav.classList.contains('is-open'))});
    trigger.addEventListener('click',function(){setServices(!service.classList.contains('is-open'))});
    document.addEventListener('click',function(e){if(!service.contains(e.target))setServices(false)});
    document.addEventListener('keydown',function(e){if(e.key==='Escape'){setServices(false);setNav(false);toggle.focus()}});
    nav.querySelectorAll('a').forEach(function(link){link.addEventListener('click',function(){setNav(false);setServices(false)})});
    window.addEventListener('resize',function(){if(window.innerWidth>980)setNav(false)});
  });
})();
