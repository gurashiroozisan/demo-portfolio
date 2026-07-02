const COMMENTS = [
  { text: 'スタッフの接客がとても丁寧でした', tags: ['接客', '丁寧'] },
  { text: '店内が清潔で気持ちよかった', tags: ['清潔', '店内'] },
  { text: '待ち時間が少し長かった', tags: ['待ち時間'] },
  { text: '価格に対して満足しています', tags: ['価格', '満足'] },
  { text: '商品の品揃えが豊富', tags: ['品揃え', '商品'] },
  { text: '接客対応がスムーズで助かりました', tags: ['接客', 'スムーズ'] },
  { text: 'もう少し待ち時間を短くしてほしい', tags: ['待ち時間', '改善'] },
  { text: '清潔感があり安心できた', tags: ['清潔', '安心'] },
  { text: 'スタッフの笑顔が印象的', tags: ['接客', '笑顔'] },
  { text: '価格がやや高いと感じた', tags: ['価格'] },
  { text: '店内の雰囲気が良かった', tags: ['店内', '雰囲気'] },
  { text: '商品の説明がわかりやすかった', tags: ['接客', '説明'] },
  { text: 'また利用したいと思います', tags: ['満足', 'リピート'] },
  { text: '待ち時間は許容範囲', tags: ['待ち時間'] },
  { text: '清潔で整理整頓されている', tags: ['清潔', '整理'] },
];

const NAMES = ['匿名A', '匿名B', '匿名C', '匿名D', '匿名E', '匿名F', '匿名G', '匿名H'];

function generateDemoResponses() {
  const responses = [];
  let seed = 137;

  const rand = () => {
    seed = (seed * 16807) % 2147483647;
    return seed / 2147483647;
  };

  for (let i = 0; i < 50; i++) {
    const r = rand();
    let satisfaction;
    if (r < 0.08) satisfaction = 1;
    else if (r < 0.15) satisfaction = 2;
    else if (r < 0.28) satisfaction = 3;
    else if (r < 0.55) satisfaction = 4;
    else satisfaction = 5;

    const npsRoll = rand();
    let nps;
    if (npsRoll < 0.12) nps = Math.floor(rand() * 7);
    else if (npsRoll < 0.35) nps = 7 + Math.floor(rand() * 2);
    else nps = 9 + Math.floor(rand() * 2);

    const comment = COMMENTS[Math.floor(rand() * COMMENTS.length)];
    const day = 28 - Math.floor(i / 3);
    const hour = 10 + Math.floor(rand() * 10);
    const min = Math.floor(rand() * 60);

    responses.push({
      datetime: `2026/06/${String(day).padStart(2, '0')} ${String(hour).padStart(2, '0')}:${String(min).padStart(2, '0')}`,
      satisfaction,
      nps,
      comment: comment.text,
      tags: comment.tags,
      sortKey: day * 10000 + hour * 100 + min,
    });
  }

  return responses.sort((a, b) => b.sortKey - a.sortKey);
}

const DEMO_RESPONSES = generateDemoResponses();

let satisfactionChart, npsChart;

const chartDefaults = {
  color: '#8892A8',
  borderColor: 'rgba(255,255,255,0.08)',
};

function showLoading(show) {
  document.getElementById('loading').hidden = !show;
  document.getElementById('runDemo').disabled = show;
  if (show) document.getElementById('dashboard').hidden = true;
}

function calcNps(responses) {
  const total = responses.length;
  const promoters = responses.filter((r) => r.nps >= 9).length;
  const detractors = responses.filter((r) => r.nps <= 6).length;
  const score = Math.round(((promoters - detractors) / total) * 100);
  const promoterPct = Math.round((promoters / total) * 100);
  return { score, promoterPct, promoters, passives: responses.filter((r) => r.nps >= 7 && r.nps <= 8).length, detractors };
}

function extractKeywords(responses) {
  const counts = {};
  responses.forEach((r) => {
    r.tags.forEach((tag) => {
      counts[tag] = (counts[tag] || 0) + 1;
    });
  });
  return Object.entries(counts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 12);
}

function renderWordCloud(keywords) {
  const max = keywords[0]?.[1] || 1;
  document.getElementById('wordCloud').innerHTML = keywords.map(([word, count]) => {
    const scale = 0.75 + (count / max) * 0.5;
    return `<span class="word-tag" style="font-size:${scale}rem"><span>${word}</span><span class="word-tag__count">${count}</span></span>`;
  }).join('');
}

function renderTable(responses) {
  const tbody = document.querySelector('#responseTable tbody');
  tbody.innerHTML = responses.slice(0, 12).map((r) => `
    <tr>
      <td>${r.datetime}</td>
      <td><span class="rating-badge rating-badge--${r.satisfaction}">${r.satisfaction}</span></td>
      <td>${r.nps}</td>
      <td class="comment" title="${r.comment}">${r.comment}</td>
    </tr>
  `).join('');
}

function destroyCharts() {
  if (satisfactionChart) { satisfactionChart.destroy(); satisfactionChart = null; }
  if (npsChart) { npsChart.destroy(); npsChart = null; }
}

function renderCharts(responses) {
  destroyCharts();

  const satCounts = [1, 2, 3, 4, 5].map((n) => responses.filter((r) => r.satisfaction === n).length);
  const npsData = calcNps(responses);

  satisfactionChart = new Chart(document.getElementById('satisfactionChart'), {
    type: 'bar',
    data: {
      labels: ['1', '2', '3', '4', '5'],
      datasets: [{
        label: '回答数',
        data: satCounts,
        backgroundColor: ['#EF4444', '#F97316', '#F59E0B', '#06B6D4', '#22C55E'],
        borderRadius: 6,
      }],
    },
    options: {
      responsive: true,
      plugins: { legend: { display: false } },
      scales: {
        x: { grid: { color: chartDefaults.borderColor }, ticks: { color: chartDefaults.color } },
        y: { beginAtZero: true, grid: { color: chartDefaults.borderColor }, ticks: { color: chartDefaults.color, stepSize: 2 } },
      },
    },
  });

  npsChart = new Chart(document.getElementById('npsChart'), {
    type: 'doughnut',
    data: {
      labels: ['推奨者 (9-10)', '中立者 (7-8)', '批判者 (0-6)'],
      datasets: [{
        data: [npsData.promoters, npsData.passives, npsData.detractors],
        backgroundColor: ['#22C55E', '#F59E0B', '#EF4444'],
        borderWidth: 0,
      }],
    },
    options: {
      responsive: true,
      plugins: {
        legend: { position: 'bottom', labels: { color: chartDefaults.color, padding: 14, font: { size: 11 } } },
      },
    },
  });
}

function renderDashboard(responses) {
  const avg = (responses.reduce((s, r) => s + r.satisfaction, 0) / responses.length).toFixed(1);
  const nps = calcNps(responses);

  document.getElementById('kpiTotal').textContent = responses.length;
  document.getElementById('kpiAvg').textContent = avg;
  document.getElementById('kpiNps').textContent = nps.score > 0 ? `+${nps.score}` : nps.score;
  document.getElementById('kpiPromoter').textContent = nps.promoterPct;
  document.getElementById('surveyMeta').textContent = `店舗満足度アンケート — ${responses.length}件`;

  renderCharts(responses);
  renderWordCloud(extractKeywords(responses));
  renderTable(responses);
  document.getElementById('dashboard').hidden = false;
}

document.getElementById('runDemo').addEventListener('click', () => {
  showLoading(true);
  setTimeout(() => {
    showLoading(false);
    renderDashboard(DEMO_RESPONSES);
  }, 1400);
});
