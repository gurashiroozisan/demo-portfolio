const header = document.getElementById('header');
const burger = document.getElementById('burger');
const nav = document.getElementById('nav');
if (burger && nav) {
  burger.addEventListener('click', () => { burger.classList.toggle('is-open'); nav.classList.toggle('is-open'); });
  nav.querySelectorAll('a').forEach(l => l.addEventListener('click', () => { burger.classList.remove('is-open'); nav.classList.remove('is-open'); }));
}
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry, i) => {
    if (entry.isIntersecting) { setTimeout(() => entry.target.classList.add('is-visible'), i * 80); revealObserver.unobserve(entry.target); }
  });
}, { threshold: 0.15 });
document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));
