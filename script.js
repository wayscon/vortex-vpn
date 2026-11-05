/* ============================================================
   VORTEX — логика сайта
   ============================================================ */

/* ---------- Мобильное меню ---------- */
const burger = document.getElementById('burger');
const navLinks = document.getElementById('navLinks');

burger.addEventListener('click', () => navLinks.classList.toggle('open'));
navLinks.querySelectorAll('a').forEach(a =>
  a.addEventListener('click', () => navLinks.classList.remove('open'))
);

/* ---------- Терминал: печатающийся вывод ---------- */
const termLines = [
  { text: '$ vortex connect --region NL', type: 'cmd' },
  { text: '[OK] ключи обменены · curve25519', type: 'out' },
  { text: '[OK] туннель установлен · WireGuard', type: 'out' },
  { text: '[OK] DNS-запросы перенаправлены', type: 'out' },
  { text: '[OK] kill-switch: АКТИВЕН', type: 'out' },
  { text: 'IP: 185.***.***.42 → зашифровано', type: 'ok' },
  { text: 'статус: АНОНИМНО. логи: не ведутся.', type: 'ok' },
];
const term = document.getElementById('term');
let li = 0;

function typeLine() {
  if (li >= termLines.length) {
    // Курсор в конце, затем перезапуск цикла
    setTimeout(() => { term.innerHTML = ''; li = 0; typeLine(); }, 6000);
    return;
  }
  const line = termLines[li];
  const div = document.createElement('div');
  if (line.type === 'cmd') div.className = 'p';
  if (line.type === 'ok') div.className = 'ok';
  term.appendChild(div);
  let ci = 0;
  (function tick() {
    if (ci <= line.text.length) {
      div.textContent = line.text.slice(0, ci);
      ci++;
      setTimeout(tick, line.type === 'cmd' ? 55 : 14);
    } else {
      li++;
      setTimeout(typeLine, line.type === 'cmd' ? 350 : 220);
    }
  })();
}
typeLine();

/* ---------- Анимированные счётчики ---------- */
const counters = document.querySelectorAll('[data-count]');
const counterObs = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (!e.isIntersecting) return;
    const el = e.target;
    counterObs.unobserve(el);
    const target = +el.dataset.count;
    const suffix = el.dataset.suffix || '';
    const t0 = performance.now(), dur = 1400;
    (function step(t) {
      const k = Math.min((t - t0) / dur, 1);
      el.textContent = Math.round(target * (1 - Math.pow(1 - k, 3))) + (k === 1 ? suffix : '');
      if (k < 1) requestAnimationFrame(step);
    })(t0);
  });
}, { threshold: .6 });
counters.forEach(c => counterObs.observe(c));

/* ---------- Появление при скролле ---------- */
const revealObs = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.classList.add('visible');
      revealObs.unobserve(e.target);
    }
  });
}, { threshold: .12 });
document.querySelectorAll('.reveal').forEach(el => revealObs.observe(el));

/* ---------- FAQ-аккордеон ---------- */
document.querySelectorAll('.faq-q').forEach(btn => {
  btn.addEventListener('click', () => {
    const item = btn.parentElement;
    const answer = item.querySelector('.faq-a');
    const isOpen = item.classList.contains('open');
    document.querySelectorAll('.faq-item.open').forEach(i => {
      i.classList.remove('open');
      i.querySelector('.faq-a').style.maxHeight = null;
    });
    if (!isOpen) {
      item.classList.add('open');
      answer.style.maxHeight = answer.scrollHeight + 'px';
    }
  });
});