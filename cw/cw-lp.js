/**
 * Food Huggers 提案LP — cw-lp.js
 */
(function () {
  'use strict';

  const root = document.querySelector('.cw-lp');
  if (!root) return;

  // モバイルナビ
  const burger = root.querySelector('.cw-lp-burger');
  const nav = root.querySelector('.cw-lp-header__nav');
  if (burger && nav) {
    burger.addEventListener('click', () => {
      const open = nav.classList.toggle('is-open');
      burger.setAttribute('aria-expanded', open);
    });
    nav.querySelectorAll('a').forEach((link) => {
      link.addEventListener('click', () => nav.classList.remove('is-open'));
    });
  }

  // FAQアコーディオン
  root.querySelectorAll('.cw-lp-faq__q').forEach((btn) => {
    btn.addEventListener('click', () => {
      const item = btn.closest('.cw-lp-faq__item');
      const isOpen = item.classList.contains('is-open');
      root.querySelectorAll('.cw-lp-faq__item').forEach((el) => {
        el.classList.remove('is-open');
        el.querySelector('.cw-lp-faq__q').setAttribute('aria-expanded', 'false');
      });
      if (!isOpen) {
        item.classList.add('is-open');
        btn.setAttribute('aria-expanded', 'true');
      }
    });
  });

  // スクロール表示
  const reveals = root.querySelectorAll('.cw-lp-reveal');
  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
    );
    reveals.forEach((el) => io.observe(el));
  } else {
    reveals.forEach((el) => el.classList.add('is-visible'));
  }

  // スムーススクロール
  root.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener('click', (e) => {
      const id = anchor.getAttribute('href');
      if (id === '#') return;
      const target = root.querySelector(id);
      if (!target) return;
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  });
})();
