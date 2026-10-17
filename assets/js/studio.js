(function(){
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  document.getElementById('year').textContent = new Date().getFullYear();

  /* fit: scale fixed-size mockups to their container */
  var fits = document.querySelectorAll('.fit');
  function sizeFit(el){
    var cs = getComputedStyle(el), w = parseFloat(cs.getPropertyValue('--w')) || el.clientWidth;
    var s = el.clientWidth / w, max = parseFloat(el.dataset.maxs);
    /* data-maxs: stop a mockup growing past this scale; centre it and shrink the box to fit */
    if (max && s > max){
      s = max;
      el.style.height = (parseFloat(cs.getPropertyValue('--h')) * s).toFixed(1) + 'px';
      el.style.setProperty('--ox', ((el.clientWidth - w * s) / 2).toFixed(1) + 'px');
    } else if (max){
      el.style.height = ''; el.style.removeProperty('--ox');
    }
    el.style.setProperty('--s', s.toFixed(4));
  }
  if ('ResizeObserver' in window){
    var ro = new ResizeObserver(function(entries){ entries.forEach(function(e){ sizeFit(e.target); }); });
    fits.forEach(function(el){ sizeFit(el); ro.observe(el); });
  } else {
    fits.forEach(sizeFit);
    window.addEventListener('resize', function(){ fits.forEach(sizeFit); });
  }

  /* header */
  var hdr = document.getElementById('header');
  function onScroll(){ hdr.classList.toggle('scrolled', window.scrollY > 20); }
  onScroll(); window.addEventListener('scroll', onScroll, {passive:true});

  var burger = hdr.querySelector('.burger');
  burger.addEventListener('click', function(){
    var open = hdr.classList.toggle('menu');
    burger.setAttribute('aria-expanded', open);
    burger.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
  });
  hdr.querySelectorAll('.nav a').forEach(function(a){
    a.addEventListener('click', function(){ hdr.classList.remove('menu'); burger.setAttribute('aria-expanded', false); dd.classList.remove('open'); });
  });

  /* services mega menu: hover on desktop, click everywhere */
  var dd = document.getElementById('dd-services'), ddt = dd.querySelector('.dd-t'), t;
  var desktop = window.matchMedia('(min-width: 981px) and (hover: hover)');
  function setDD(open){ dd.classList.toggle('open', open); ddt.setAttribute('aria-expanded', open); }
  ddt.addEventListener('click', function(){ setDD(!dd.classList.contains('open')); });
  dd.addEventListener('mouseenter', function(){ if (desktop.matches){ clearTimeout(t); setDD(true); } });
  dd.addEventListener('mouseleave', function(){ if (desktop.matches){ t = setTimeout(function(){ setDD(false); }, 120); } });
  document.addEventListener('keydown', function(e){ if (e.key === 'Escape'){ setDD(false); hdr.classList.remove('menu'); } });
  document.addEventListener('click', function(e){ if (!dd.contains(e.target) && desktop.matches) setDD(false); });

  /* reveal on scroll */
  var rv = document.querySelectorAll('.rv, .bars');
  if ('IntersectionObserver' in window && !reduce){
    var io = new IntersectionObserver(function(entries){
      entries.forEach(function(e){ if (e.isIntersecting){ e.target.classList.add('in'); io.unobserve(e.target); } });
    }, {rootMargin:'0px 0px -8% 0px', threshold:0.08});
    rv.forEach(function(el){ io.observe(el); });
  } else { rv.forEach(function(el){ el.classList.add('in'); }); }
  document.querySelectorAll('.hl').forEach(function(h){ if (!h.closest('.rv')) h.classList.add('in'); });

  window.addEventListener('load', function(){ document.body.classList.add('loaded'); });
  setTimeout(function(){ document.body.classList.add('loaded'); }, 1200);

  /* before / after slider */
  var ba = document.getElementById('ba');
  if (ba){
    var range = ba.querySelector('input');
    range.addEventListener('input', function(){ ba.style.setProperty('--pos', range.value); });
    if (!reduce){
      var io2 = new IntersectionObserver(function(es){
        if (!es[0].isIntersecting) return; io2.disconnect();
        var start = null, from = 52;
        function step(ts){ if (!start) start = ts; var p = Math.min((ts - start) / 1800, 1);
          var v = from + Math.sin(p * Math.PI * 2) * 24 * (1 - p);
          ba.style.setProperty('--pos', v.toFixed(1)); range.value = v; if (p < 1) requestAnimationFrame(step); }
        requestAnimationFrame(step);
      }, {threshold:.5});
      io2.observe(ba);
    }
  }

  /* count up */
  if (!reduce && 'IntersectionObserver' in window){
    var io3 = new IntersectionObserver(function(es){
      es.forEach(function(e){
        if (!e.isIntersecting) return; io3.unobserve(e.target);
        var el = e.target, end = parseFloat(el.dataset.count), dec = parseInt(el.dataset.dec || 0, 10), s = null;
        function step(ts){ if (!s) s = ts; var p = Math.min((ts - s) / 1200, 1), k = 1 - Math.pow(1 - p, 3);
          el.textContent = (end * k).toFixed(dec); if (p < 1) requestAnimationFrame(step); }
        requestAnimationFrame(step);
      });
    }, {threshold:.6});
    document.querySelectorAll('[data-count]').forEach(function(el){ io3.observe(el); });
  }

  /* hero: live revenue tick + gentle tilt that flattens as you scroll */
  var tick = document.querySelector('[data-tick]');
  if (tick && !reduce){
    var val = parseInt(tick.dataset.tick, 10);
    setInterval(function(){ val += Math.round(40 + Math.random() * 220); tick.textContent = '$' + val.toLocaleString('en-US'); }, 2600);
  }
  var apw = document.getElementById('apwin');
  if (apw && !reduce){
    var tilt = function(){ var t = Math.max(0, Math.min(1, 1 - window.scrollY / 520)); apw.style.setProperty('--tilt', (t * 9).toFixed(2) + 'deg'); };
    tilt(); window.addEventListener('scroll', tilt, {passive:true});
  }
  /* system diagram: draw a wire from every source into the hub, and from the hub to every destination */
  var sys = document.getElementById('sys');
  if (sys){
    var svgNS = 'http://www.w3.org/2000/svg', wires = sys.querySelector('.sys-w'), hub = sys.querySelector('.sys-hub');
    var drawSys = function(){
      while (wires.firstChild) wires.removeChild(wires.firstChild);
      if (getComputedStyle(wires).display === 'none') return;
      var box = sys.getBoundingClientRect(), h = hub.getBoundingClientRect();
      var add = function(d, i, back){
        var base = document.createElementNS(svgNS, 'path'); base.setAttribute('d', d); wires.appendChild(base);
        var fl = document.createElementNS(svgNS, 'path'); fl.setAttribute('d', d); fl.setAttribute('class', 'fl'); wires.appendChild(fl);
        if (reduce) return;
        var dot = document.createElementNS(svgNS, 'circle'); dot.setAttribute('r', 3.5);
        var mo = document.createElementNS(svgNS, 'animateMotion');
        mo.setAttribute('dur', '2.6s'); mo.setAttribute('repeatCount', 'indefinite'); mo.setAttribute('begin', -((back ? 1.3 : 0) + i * .37) + 's'); mo.setAttribute('path', d);
        dot.appendChild(mo); wires.appendChild(dot);
      };
      var side = function(sel, out){
        var nodes = sys.querySelectorAll(sel + ' .sys-n');
        [].forEach.call(nodes, function(n, i){
          var r = n.getBoundingClientRect(), y = r.top + r.height / 2 - box.top;
          var hy = h.top - box.top + h.height * (.22 + .56 * i / Math.max(1, nodes.length - 1));
          var x1, x2;
          if (out){ x1 = h.right - box.left; x2 = r.left - box.left; add('M' + x1 + ' ' + hy + 'C' + (x1 + x2) / 2 + ' ' + hy + ' ' + (x1 + x2) / 2 + ' ' + y + ' ' + x2 + ' ' + y, i, true); }
          else { x1 = r.right - box.left; x2 = h.left - box.left; add('M' + x1 + ' ' + y + 'C' + (x1 + x2) / 2 + ' ' + y + ' ' + (x1 + x2) / 2 + ' ' + hy + ' ' + x2 + ' ' + hy, i, false); }
        });
      };
      side('.sys-col.in', false); side('.sys-col.out', true);
    };
    drawSys();
    if ('ResizeObserver' in window) new ResizeObserver(drawSys).observe(sys); else window.addEventListener('resize', drawSys);
    window.addEventListener('load', drawSys);
  }

  /* busywork calculator: everything is worked out here, nothing is sent anywhere */
  var calc = document.getElementById('calc');
  if (calc){
    var tasks = [].slice.call(calc.querySelectorAll('input[data-task]')), rate = document.getElementById('c5');
    var bars = document.getElementById('co-bars'), wk = document.getElementById('co-wk');
    var gbp = function(n){ return '£' + Math.round(n).toLocaleString('en-GB'); };
    for (var w = 0; w < 52; w++) wk.appendChild(document.createElement('i'));
    bars.innerHTML = tasks.map(function(t){ return '<div class="co-b"><div class="r"><span>' + t.dataset.task + '</span><b></b></div><div class="t"><i></i></div></div>'; }).join('');
    var fill = function(el){ el.style.setProperty('--p', (el.value - el.min) / (el.max - el.min) * 100 + '%'); };
    var runCalc = function(){
      var r = +rate.value, hrs = tasks.map(function(t){ return +t.value * 52; });
      var total = hrs.reduce(function(a, b){ return a + b; }, 0), top = Math.max.apply(null, hrs), weeks = total / 37.5;
      tasks.concat(rate).forEach(fill);
      tasks.forEach(function(t){ document.getElementById(t.id + '-o').textContent = t.value + ' h'; });
      document.getElementById('c5-o').textContent = gbp(r);
      document.getElementById('co-cost').innerHTML = gbp(total * r) + '<small>a year</small>';
      document.getElementById('co-sub').innerHTML = '<b>' + total.toLocaleString('en-GB') + ' hours</b>, or about ' + Math.round(weeks) + ' working week' + (Math.round(weeks) === 1 ? '' : 's');
      document.getElementById('co-wk-l').textContent = Math.round(weeks) + ' week' + (Math.round(weeks) === 1 ? '' : 's') + ' of busywork';
      [].forEach.call(bars.children, function(b, i){
        var isTop = hrs[i] === top && top > 0;
        b.classList.toggle('top', isTop);
        b.querySelector('b').innerHTML = gbp(hrs[i] * r) + (isTop ? '<em>Start here</em>' : '');
        b.querySelector('i').style.width = (top ? hrs[i] / top * 100 : 0) + '%';
      });
      [].forEach.call(wk.children, function(c, i){
        var f = Math.max(0, Math.min(1, weeks - i));
        c.className = f >= 1 ? 'on' : f > 0 ? 'pt' : '';
        c.style.setProperty('--f', (f * 100).toFixed(0) + '%');
      });
    };
    tasks.concat(rate).forEach(function(t){ t.addEventListener('input', runCalc); });
    runCalc();
  }
})();
