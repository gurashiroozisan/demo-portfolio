const form = document.getElementById('contactForm');
const submitBtn = document.getElementById('submitBtn');
const btnText = submitBtn.querySelector('.btn__text');
const btnLoader = submitBtn.querySelector('.btn__loader');
const stepsEl = document.getElementById('steps');
const flowPanel = document.querySelector('.panel--flow');
const previews = document.getElementById('previews');
const idleState = document.getElementById('idleState');
const emailBody = document.getElementById('emailBody');
const slackBody = document.getElementById('slackBody');

const STEP_ORDER = ['form', 'email', 'slack'];
const STEP_LABELS = {
  form: { running: '送信中…', done: '完了' },
  email: { running: '送信中…', done: '送信完了' },
  slack: { running: '投稿中…', done: '投稿完了' },
};

function getStepEl(key) {
  return stepsEl.querySelector(`[data-step="${key}"]`);
}

function resetFlow() {
  STEP_ORDER.forEach((key) => {
    const el = getStepEl(key);
    el.classList.remove('is-active', 'is-running', 'is-done');
    el.querySelector('.step__status').textContent = '待機中';
    el.querySelector('.step__check').hidden = true;
    el.querySelector('.step__pending').hidden = false;
  });
  flowPanel.classList.remove('is-busy');
  previews.hidden = true;
  idleState.hidden = false;
}

function setStepRunning(key) {
  const el = getStepEl(key);
  el.classList.add('is-active', 'is-running');
  el.classList.remove('is-done');
  el.querySelector('.step__status').textContent = STEP_LABELS[key].running;
}

function setStepDone(key) {
  const el = getStepEl(key);
  el.classList.remove('is-running');
  el.classList.add('is-done');
  el.querySelector('.step__status').textContent = STEP_LABELS[key].done;
  el.querySelector('.step__pending').hidden = true;
  el.querySelector('.step__check').hidden = false;
}

function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function buildEmailBody(data) {
  return `新しいお問い合わせがありました。

お名前: ${data.name}
メール: ${data.email}

--- お問い合わせ内容 ---
${data.message}`;
}

function buildSlackBody(data) {
  return `:incoming_envelope: *新規お問い合わせ*\n\n*お名前:* ${data.name}\n*メール:* ${data.email}\n\n> ${data.message.replace(/\n/g, '\n> ')}`;
}

function validateForm() {
  let valid = true;
  form.querySelectorAll('.field').forEach((field) => field.classList.remove('is-error'));

  ['name', 'email', 'message'].forEach((id) => {
    const input = document.getElementById(id);
    if (!input.value.trim()) {
      input.closest('.field').classList.add('is-error');
      valid = false;
    }
  });

  const email = document.getElementById('email');
  if (email.value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value)) {
    email.closest('.field').classList.add('is-error');
    valid = false;
  }

  return valid;
}

async function runFlow(data) {
  resetFlow();
  flowPanel.classList.add('is-busy');
  idleState.hidden = true;

  const subjectLine = document.querySelectorAll('.preview__meta')[1];
  if (subjectLine) {
    subjectLine.innerHTML = `<span>件名:</span> 【新規お問い合わせ】${data.name} 様`;
  }

  emailBody.textContent = buildEmailBody(data);
  slackBody.textContent = buildSlackBody(data);

  for (const key of STEP_ORDER) {
    setStepRunning(key);
    await delay(key === 'form' ? 900 : 1200);
    setStepDone(key);
    if (key === 'email') {
      previews.hidden = false;
    }
    await delay(300);
  }
}

form.addEventListener('submit', async (e) => {
  e.preventDefault();
  if (!validateForm()) return;

  const data = {
    name: document.getElementById('name').value.trim(),
    email: document.getElementById('email').value.trim(),
    message: document.getElementById('message').value.trim(),
  };

  submitBtn.disabled = true;
  btnText.hidden = true;
  btnLoader.hidden = false;

  await runFlow(data);

  submitBtn.disabled = false;
  btnText.hidden = false;
  btnLoader.hidden = true;
});

resetFlow();
