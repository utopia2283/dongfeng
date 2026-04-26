/* ===== 東風 · 戰略管理控制台 (console.js) ===== */
document.addEventListener('DOMContentLoaded', () => {

  /* ── TAB SWITCHING ─────────────────────────────────────── */
  const tabs = document.querySelectorAll('.cn-tab');
  const pages = document.querySelectorAll('.cn-page');

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      const target = tab.dataset.tab;

      tabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');

      pages.forEach(p => {
        p.classList.remove('active');
        if (p.dataset.page === target) {
          p.classList.add('active');
        }
      });

      // Re-trigger animations when tab becomes active
      if (target === 'dashboard') initDashboard();
      if (target === 'forecast') animateMultiFc();
      if (target === 'campaigns') animateSequences();
    });
  });

  /* ── KPI SPARKLINE ANIMATIONS ──────────────────────────── */
  function animateSparklines() {
    document.querySelectorAll('.kpi-spark polyline').forEach((line, i) => {
      const len = line.getTotalLength ? line.getTotalLength() : 0;
      if (!len) return;
      line.style.strokeDasharray = len;
      line.style.strokeDashoffset = len;
      line.style.transition = `stroke-dashoffset ${1 + i * 0.15}s cubic-bezier(0.22,1,0.36,1)`;
      setTimeout(() => { line.style.strokeDashoffset = 0; }, 80 * i);
    });
  }

  /* ── HEATMAP ───────────────────────────────────────────── */
  // 7 days × 24 hours; generate realistic activity pattern
  const HEATMAP_DATA = [
    /* 0=Sun, 1=Mon, ... 6=Sat */
    [1,0,0,0,0,0,0,1,2,3,3,4,3,2,2,3,4,3,2,1,1,1,0,0],  // Sun
    [0,0,0,0,0,1,2,3,4,5,5,4,3,3,4,5,5,4,3,2,2,1,1,0],  // Mon (high)
    [0,0,0,0,0,1,2,3,4,4,4,3,3,3,4,4,4,3,3,2,1,1,1,0],  // Tue
    [0,0,0,0,0,1,2,3,4,5,5,4,3,3,4,5,5,4,3,2,2,1,1,0],  // Wed (high)
    [0,0,0,0,0,1,2,3,4,4,4,3,3,3,4,4,4,3,3,2,1,1,1,0],  // Thu
    [0,0,0,0,0,1,2,3,4,4,4,3,3,3,4,4,4,3,3,2,1,1,1,0],  // Fri
    [1,0,0,0,0,0,0,1,2,3,3,2,2,2,2,2,3,3,2,1,1,1,0,0],  // Sat
  ];

  function initHeatmap() {
    const container = document.getElementById('heatmap');
    if (!container) return;

    // Add day labels as first column via CSS grid; use a wrapper
    container.innerHTML = '';
    container.style.display = 'grid';
    container.style.gridTemplateColumns = 'repeat(24, 1fr)';
    container.style.gridTemplateRows = 'repeat(7, 22px)';
    container.style.gap = '3px';

    const days = ['日', '一', '二', '三', '四', '五', '六'];
    HEATMAP_DATA.forEach((row, dayIdx) => {
      row.forEach((val, hourIdx) => {
        const cell = document.createElement('div');
        cell.className = `hm-cell hm-${val}`;
        cell.title = `週${days[dayIdx]} ${hourIdx}:00 — ${['', '低', '中', '高', '很高', '極高'][val + 1]}`;
        cell.style.opacity = '0';
        cell.style.transition = `opacity 0.3s ease ${(dayIdx * 24 + hourIdx) * 8}ms`;
        container.appendChild(cell);
        setTimeout(() => { cell.style.opacity = '1'; }, 10);
      });
    });
  }

  /* ── DASHBOARD INIT ─────────────────────────────────────── */
  function initDashboard() {
    animateSparklines();
    initHeatmap();
    animateFunnel();
    animateVerticalROI();
  }

  /* ── FUNNEL ANIMATION ───────────────────────────────────── */
  function animateFunnel() {
    document.querySelectorAll('.fn-bar span').forEach((bar, i) => {
      const target = bar.style.width;
      bar.style.width = '0';
      setTimeout(() => {
        bar.style.width = target;
      }, 300 + i * 150);
    });
  }

  /* ── VERTICAL ROI BARS ─────────────────────────────────── */
  function animateVerticalROI() {
    document.querySelectorAll('.vl-bar span').forEach((bar, i) => {
      const target = bar.style.width;
      bar.style.width = '0';
      setTimeout(() => {
        bar.style.width = target;
      }, 400 + i * 120);
    });
  }

  /* ── MULTI-FORECAST SVG ANIMATION ──────────────────────── */
  function animateMultiFc() {
    document.querySelectorAll('.multi-fc polyline').forEach((line, i) => {
      const len = line.getTotalLength ? line.getTotalLength() : 0;
      if (!len) return;
      line.style.strokeDasharray = len;
      line.style.strokeDashoffset = len;
      line.style.transition = `stroke-dashoffset ${1.2 + i * 0.3}s cubic-bezier(0.22,1,0.36,1)`;
      setTimeout(() => { line.style.strokeDashoffset = 0; }, 100 + i * 200);
    });
  }

  /* ── SEQUENCE PROGRESS BARS ────────────────────────────── */
  function animateSequences() {
    document.querySelectorAll('.sq-prog').forEach((bar, i) => {
      const target = bar.style.width;
      bar.style.width = '0';
      setTimeout(() => {
        bar.style.width = target;
      }, 200 + i * 150);
    });
  }

  /* ── LAB SIMULATOR BUTTON ───────────────────────────────── */
  const labRunBtn = document.querySelector('.lab-run');
  if (labRunBtn) {
    labRunBtn.addEventListener('click', () => {
      const resultNum = document.querySelector('.lab-result-num');
      const resultDetail = document.querySelector('.lab-result-detail strong');
      if (!resultNum) return;

      // Simulate computing...
      labRunBtn.textContent = '⏳ 計算中...';
      labRunBtn.disabled = true;

      setTimeout(() => {
        const values = [73, 68, 81, 55, 79, 62];
        const val = values[Math.floor(Math.random() * values.length)];
        resultNum.textContent = val + '%';
        if (resultDetail) resultDetail.parentElement.innerHTML = `提升 <strong>+${val - 32}pp</strong>`;
        labRunBtn.textContent = '▶ 模擬';
        labRunBtn.disabled = false;
      }, 1200);
    });
  }

  /* ── ALERT BUTTONS ──────────────────────────────────────── */
  document.querySelectorAll('.al-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const original = btn.textContent;
      btn.textContent = '✓ 已接收';
      btn.style.background = 'rgba(40,212,154,0.2)';
      btn.style.color = 'var(--cn-green)';
      btn.style.borderColor = 'var(--cn-green)';
      setTimeout(() => {
        btn.textContent = original;
        btn.style.background = '';
        btn.style.color = '';
        btn.style.borderColor = '';
      }, 2000);
    });
  });

  /* ── ACTION PLAN BUTTONS ────────────────────────────────── */
  document.querySelectorAll('.ap-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const original = btn.textContent;
      btn.textContent = '✓ 已排程';
      btn.disabled = true;
      btn.style.opacity = '0.7';
      setTimeout(() => {
        btn.textContent = original;
        btn.disabled = false;
        btn.style.opacity = '';
      }, 2500);
    });
  });

  /* ── API KEY COPY BUTTON ────────────────────────────────── */
  document.querySelectorAll('.api-btn').forEach(btn => {
    if (btn.textContent.includes('複製')) {
      btn.addEventListener('click', () => {
        const code = document.querySelector('.api-key-row code');
        if (!code) return;
        navigator.clipboard.writeText(code.textContent).then(() => {
          const orig = btn.textContent;
          btn.textContent = '✓ 已複製';
          setTimeout(() => { btn.textContent = orig; }, 1800);
        }).catch(() => {
          // Fallback for environments without clipboard API
          const orig = btn.textContent;
          btn.textContent = '✓ 已複製';
          setTimeout(() => { btn.textContent = orig; }, 1800);
        });
      });
    }
  });

  /* ── DATA SOURCE CONNECT BUTTONS ────────────────────────── */
  document.querySelectorAll('.ds-status.warn').forEach(btn => {
    btn.addEventListener('click', () => {
      const orig = btn.textContent;
      btn.textContent = '連接中...';
      btn.style.color = 'var(--cn-accent)';
      setTimeout(() => {
        btn.textContent = '已連接';
        btn.classList.remove('warn');
        btn.style.color = 'var(--cn-green)';
        btn.parentElement.classList.add('connected');
      }, 1500);
    });
  });

  /* ── TEAM ADD BUTTON ────────────────────────────────────── */
  const tmAdd = document.querySelector('.tm-add');
  if (tmAdd) {
    tmAdd.addEventListener('click', () => {
      const orig = tmAdd.textContent;
      tmAdd.textContent = '✓';
      tmAdd.style.borderColor = 'var(--cn-green)';
      tmAdd.style.color = 'var(--cn-green)';
      setTimeout(() => {
        tmAdd.textContent = orig;
        tmAdd.style.borderColor = '';
        tmAdd.style.color = '';
      }, 2000);
    });
  }

  /* ── SCROLL REVEAL ANIMATION ───────────────────────────── */
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0)';
      }
    });
  }, { threshold: 0.1 });

  document.querySelectorAll('.cn-card').forEach(card => {
    card.style.opacity = '0';
    card.style.transform = 'translateY(16px)';
    card.style.transition = 'opacity 0.4s ease, transform 0.4s ease';
    revealObserver.observe(card);
  });

  /* ── INIT ──────────────────────────────────────────────── */
  initDashboard();

}); // DOMContentLoaded
