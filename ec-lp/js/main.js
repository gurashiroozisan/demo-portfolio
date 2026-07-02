document.querySelectorAll('.size-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.size-btn').forEach(b => b.classList.remove('is-active'));
    btn.classList.add('is-active');
  });
});

const cartBtn = document.getElementById('cartBtn');
const cartMsg = document.getElementById('cartMsg');
cartBtn.addEventListener('click', () => {
  const size = document.querySelector('.size-btn.is-active')?.dataset.size || 'M';
  cartMsg.textContent = `サイズ ${size} をカートに追加しました（デモ）`;
  cartMsg.hidden = false;
  cartBtn.textContent = '追加済み';
  setTimeout(() => { cartBtn.textContent = 'カートに追加'; }, 2000);
});

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry, i) => {
    if (entry.isIntersecting) { setTimeout(() => entry.target.classList.add('is-visible'), i * 80); revealObserver.unobserve(entry.target); }
  });
}, { threshold: 0.15 });
document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));
