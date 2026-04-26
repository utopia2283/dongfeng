/* ============================================================
 * 東風 DONG FENG · 張良引擎 · MVP Front-End Logic
 * ------------------------------------------------------------
 * 此 JS 模擬:
 *   1. WhatsApp Zero-UI 主動推送 (前店)
 *   2. DAG 因果推理 trace (張良引擎)
 *   3. TimesFM 高維時序預測曲線 (轉折點預判)
 *   4. 一鍵閉環執行日誌 (後廠)
 * 真實後端見 backend/ 目錄.
 * ============================================================ */

// ----- Scenario data: 4 個實戰場景 -----
const SCENARIOS = {
  insurance: {
    name: "保險經紀 · 客戶流失預警",
    persona: "Match (保險經紀)",
    forecast: {
      history: [82, 80, 78, 81, 79, 76, 74, 72, 70, 68, 65, 63],
      forecast: [62, 60, 57, 53, 47, 38, 30, 24, 20],
      turnIndex: 14,        // 在歷史第14點後出現轉折
      yLabel: "客戶活躍度指數"
    },
    dag: {
      nodes: [
        {id:"A", x:60,  y:50,  label:"銀行加息週期", type:"cause"},
        {id:"B", x:60,  y:120, label:"陳生IG瀏覽\n股票內容↑", type:"cause"},
        {id:"C", x:60,  y:190, label:"客戶WhatsApp\n回覆延遲", type:"cause"},
        {id:"D", x:200, y:80,  label:"客戶投資\n意願轉移", type:"effect"},
        {id:"E", x:200, y:170, label:"陳生對保單\n猶豫期延長", type:"effect"},
        {id:"F", x:320, y:120, label:"續保流失\n風險 +68%", type:"alert"}
      ],
      edges: [["A","D"],["B","D"],["C","E"],["D","F"],["E","F"]]
    },
    trace: [
      ["data",  "→ 接入 WhatsApp / Meta Ads / CRM 數據流"],
      ["step",  "[1/5] TimesFM 載入近 90 日 12 維時序"],
      ["step",  "[2/5] 偵測到客戶活躍度斜率 < -0.42 σ"],
      ["step",  "[3/5] DAG 因果反推, 排除假性相關 27 條"],
      ["cause", "✓ 鎖定因果鏈: 加息週期 → 投資意願轉移"],
      ["cause", "✓ 輔助證據: 陳生IG瀏覽股票內容上升 +210%"],
      ["alert", "⚠ 預警: 續保流失風險 68% (信賴區間 91%)"],
      ["step",  "[5/5] 生成主動推送 + 反向狙擊話術"]
    ],
    chat: [
      {kind:"alert", html:`<span class="tag">⚠ 主動預警</span>
        <strong>Match,</strong> 張良引擎雷達剛剛偵測到你的大客 <strong>陳Sir</strong> 出現「客戶轉移」前兆訊號 (流失風險 68%, 提前預判 18 天)。
        <br/><br/>
        因果鏈分析:<br/>
        ① 加息週期啟動 → 高淨值客戶投資意願轉向定存/股票<br/>
        ② 陳Sir 近 14 日 IG 股票相關內容瀏覽 +210%<br/>
        ③ WhatsApp 回覆延遲從 2 小時 → 13 小時<br/>
        <br/>
        <strong>千萬不要直接 Cold Call 逼單!</strong> 會直接被 block.`},
      {kind:"bot", html:`📋 <strong>反向狙擊方案 (張良式)</strong><br/>
        ① 今晚 9:15 PM 發送一份 <em>《加息環境下儲蓄險 vs 定存對比表》</em><br/>
        ② 7 天後邀請陳Sir 參加你的「家族財富傳承」線下小聚<br/>
        ③ 14 天後再 follow-up — 此時轉折點到, 簽單機率 73%<br/>
        <br/>
        我已為你準備好所有素材, 包括他關注的 3 隻港股做配套對比。`,
        actions: [
          {label:"⚡ 一鍵執行三步方案", primary:true, exec:"執行 3 步保溫方案 → 已排程 (T+0, T+7, T+14)"},
          {label:"✏️ 微調話術", exec:null}
        ]}
    ]
  },

  sme_cafe: {
    name: "SME · 連鎖咖啡店銷量異常",
    persona: "Annie (連鎖咖啡店店主)",
    forecast: {
      history: [120, 125, 130, 128, 132, 129, 127, 125, 110, 95, 80, 72],
      forecast: [70, 72, 78, 88, 102, 118, 128, 135, 138],
      turnIndex: 13,
      yLabel: "日均訂單數"
    },
    dag: {
      nodes: [
        {id:"A", x:60,  y:50,  label:"天氣突變\n(降溫 8°C)", type:"cause"},
        {id:"B", x:60,  y:130, label:"隔壁新開\n手搖飲料店", type:"cause"},
        {id:"C", x:60,  y:200, label:"FB演算法\n4/18 改版", type:"cause"},
        {id:"D", x:200, y:120, label:"自然流量\n下降 -47%", type:"effect"},
        {id:"E", x:320, y:120, label:"日訂單\n暴跌 -38%", type:"alert"}
      ],
      edges: [["A","E"],["B","E"],["C","D"],["D","E"]]
    },
    trace: [
      ["data",  "→ 拉取 POS / Meta Insights / 天氣 API"],
      ["step",  "[1/5] 偵測 7 日訂單異常下跌 -38%"],
      ["step",  "[2/5] 排除天氣相關 (對照組: 同區其他咖啡店僅 -3%)"],
      ["step",  "[3/5] 排除競品干擾 (隔壁手搖店客群重疊度僅 12%)"],
      ["cause", "✓ 鎖定真因: FB 演算法 4/18 改版, 自然觸達 -47%"],
      ["alert", "⚠ 平庸 AI 會建議「打折」→ 純血虧!"],
      ["step",  "[5/5] 生成觸達修復方案 (非價格策略)"]
    ],
    chat: [
      {kind:"alert", html:`<span class="tag">⚠ 法醫式診斷</span>
        <strong>Annie 老闆,</strong> 你 7 日訂單跌了 -38%, 但問題<strong>不是天氣, 也不是隔壁新店</strong> (我已用對照組排除)。
        <br/><br/>
        真兇是: <strong>FB 在 4/18 演算法改版, 你貼文觸達掉了 47%。</strong><br/>
        — 跟著打折是純血虧, 因為客戶根本沒看到你。`},
      {kind:"bot", html:`🎯 <strong>修復方案 (3 步)</strong><br/>
        ① 立即啟用 IG Reels 短視頻 (新演算法權重最高)<br/>
        ② 把熟客名單 (213 人) 轉到 WhatsApp Broadcast — 觸達 100%<br/>
        ③ 投放 HK$200 精準廣告 lookalike 你 Top 20% 客戶<br/>
        <br/>
        預估 14 天內訂單回升至 -8%, 21 天反超 +12%。`,
        actions: [
          {label:"⚡ 一鍵執行修復", primary:true, exec:"已生成 3 條 Reels 文案 + 啟動 WhatsApp Broadcast (213 人)"},
          {label:"📊 看詳細因果圖", exec:"開啟後廠 DAG 詳情"}
        ]}
    ]
  },

  insurance_close: {
    name: "保險經紀 · 完美狙擊逼單時點",
    persona: "Match (保險經紀)",
    forecast: {
      history: [40, 42, 45, 48, 50, 52, 55, 58, 60, 62, 63, 65],
      forecast: [67, 70, 73, 76, 80, 83, 85, 84, 81],
      turnIndex: 18,
      yLabel: "客戶下單意願 %"
    },
    dag: {
      nodes: [
        {id:"A", x:60,  y:60,  label:"近 10 年加息\n減息週期", type:"cause"},
        {id:"B", x:60,  y:140, label:"陳生樓市新聞\n停留時間↑", type:"cause"},
        {id:"C", x:60,  y:210, label:"同區租金回報\n微幅上揚", type:"cause"},
        {id:"D", x:200, y:130, label:"租轉買\n情緒轉折點", type:"effect"},
        {id:"E", x:320, y:130, label:"3週後 週四\n下午簽單峰值", type:"alert"}
      ],
      edges: [["A","D"],["B","D"],["C","D"],["D","E"]]
    },
    trace: [
      ["data",  "→ 接入樓市新聞 / 客戶閱讀軌跡 / 利率數據"],
      ["step",  "[1/5] TimesFM 處理 10 年週期 × 12 維特徵"],
      ["step",  "[2/5] 偵測 3 週後將出現「租轉買」情緒轉折"],
      ["step",  "[3/5] 個體建模: 陳生決策疲勞期 / 觀望期"],
      ["cause", "✓ 現在逼單 = 反效果, 簽單率 0%"],
      ["cause", "✓ T+21 (週四 15:00) 為峰值窗口, 預測 85%"],
      ["alert", "⚠ 最佳行動: 按兵不動 + 保溫 + 精準狙擊"],
      ["step",  "[5/5] 生成 21 日陪跑 sequence"]
    ],
    chat: [
      {kind:"alert", html:`<span class="tag">🎯 時序狙擊</span>
        <strong>Match,</strong> 你的大客 <strong>陳Sir</strong> 目前處於「決策疲勞 + 觀望期」, 現在逼單成功率 = <strong>0%</strong>。
        <br/><br/>
        但 TimesFM 雷達預測:<br/>
        <strong>📅 T+21 天 (週四 15:00)</strong> 將出現「租轉買」情緒轉折點, 簽單意願將達 <strong>85% 峰值</strong>。`},
      {kind:"bot", html:`🛡 <strong>21 日陪跑方案</strong><br/>
        ① <strong>本週</strong>: 按兵不動, 不要打擾<br/>
        ② <strong>T+7</strong>: 發送客觀「租金走勢圖」, 不推銷<br/>
        ③ <strong>T+14</strong>: 分享一則「香港加息見頂」評論文章<br/>
        ④ <strong>T+21 週四 15:00</strong>: 「X 樓盤 最後 3 個靚坐向獨家盤」<br/>
        <br/>
        準時狙擊, 預估簽單成功率 <strong>85%</strong>。`,
        actions: [
          {label:"⚡ 一鍵排程 21 日 sequence", primary:true, exec:"已排程 4 個觸點 (T+0/+7/+14/+21)"},
          {label:"❓ 為何不能現在推?", exec:"張良引擎: 決策疲勞期推銷 → 客戶 block 率 73%"}
        ]}
    ]
  },

  sme_beauty: {
    name: "SME · 美容院避開紅海競爭",
    persona: "Lily (美容院老闆娘)",
    forecast: {
      history: [50, 55, 60, 80, 130, 220, 350, 480, 580, 620, 640, 650],
      forecast: [660, 670, 680, 690, 700, 705, 710],
      turnIndex: 6,
      yLabel: "母女同行廣告 CPM (HK$)"
    },
    dag: {
      nodes: [
        {id:"A", x:60,  y:80,  label:"母親節\n(T-21)", type:"cause"},
        {id:"B", x:60,  y:170, label:"全行同質\n打母女牌", type:"cause"},
        {id:"C", x:200, y:80,  label:"廣告競價\n+300%", type:"effect"},
        {id:"D", x:200, y:170, label:"15% 客戶\n關注產後修復", type:"cause"},
        {id:"E", x:320, y:130, label:"切「新手媽媽\n犒賞」藍海", type:"alert"}
      ],
      edges: [["A","C"],["B","C"],["C","E"],["D","E"]]
    },
    trace: [
      ["data",  "→ Meta Ads 競價 + 客戶 IG 興趣標籤"],
      ["step",  "[1/5] TimesFM 預測「母女同行」CPM 將飆 +300%"],
      ["step",  "[2/5] 全網語料分析: 80% 同行用 AI 寫同樣文案"],
      ["step",  "[3/5] 私域分群: 15% 高消費客近期關注產後修復"],
      ["cause", "✓ 機會: 「新手媽媽自我犒賞」零競爭藍海"],
      ["alert", "⚠ 跟著大隊打折 → CAC 飆 5 倍, 純虧"],
      ["step",  "[5/5] 生成精準分群 broadcast"]
    ],
    chat: [
      {kind:"alert", html:`<span class="tag">🌊 紅海預警</span>
        <strong>Lily 老闆娘,</strong> 距離母親節還有 21 天, 但「母女同行」的 FB 廣告競價已經<strong>飆升 +300%</strong>!
        <br/><br/>
        全港 80% 美容院都在用 AI 寫一樣的「母女 8 折」文案 — 跟著打就是<strong>純血虧</strong>。`},
      {kind:"bot", html:`💡 <strong>避開紅海, 切藍海</strong><br/>
        張良引擎發現: 你現有 213 名 VIP 中, <strong>15% (32 人)</strong> 近期 IG 關注「產後修復」。<br/>
        <br/>
        建議改打 <strong>「新手媽媽的自我犒賞」</strong> 專屬療程:<br/>
        ✓ 預估 CAC 僅同行 1/5<br/>
        ✓ 客單價可提升 +40%<br/>
        ✓ 我已寫好 32 份 個性化 WhatsApp 邀請函 (用她們各自的稱呼)`,
        actions: [
          {label:"⚡ 一鍵發送 32 份個性化邀請", primary:true, exec:"已發送 32 份個性化 WhatsApp 邀請 (含 VIP 客戶名)"},
          {label:"📈 對比兩種方案 ROI", exec:"紅海方案 ROI: -32% / 藍海方案 ROI: +218%"}
        ]}
    ]
  }
};

// ----- State -----
let currentScenario = "insurance";

// ----- DOM helpers -----
const $ = (s) => document.querySelector(s);
const chat = $("#chat");
const trace = $("#engineTrace");
const execLog = $("#execLog");

// ----- Scenario buttons -----
document.querySelectorAll(".scenario").forEach(btn => {
  btn.addEventListener("click", () => {
    document.querySelectorAll(".scenario").forEach(b => b.classList.remove("active"));
    btn.classList.add("active");
    currentScenario = btn.dataset.scenario;
    resetAll();
    drawForecast(SCENARIOS[currentScenario].forecast);
    drawDAG(SCENARIOS[currentScenario].dag);
  });
});

// ----- Trigger button -----
$("#triggerBtn").addEventListener("click", () => runScenario(currentScenario));
$("#resetBtn").addEventListener("click", resetAll);

// ----- Run scenario -----
async function runScenario(key) {
  const s = SCENARIOS[key];
  resetAll();

  // 1) Animate engine trace (張良引擎推理)
  for (let i = 0; i < s.trace.length; i++) {
    await sleep(420);
    const [type, text] = s.trace[i];
    const line = document.createElement("div");
    line.className = `trace-line ${type}`;
    line.textContent = text;
    trace.appendChild(line);
    trace.scrollTop = trace.scrollHeight;

    // Animate DAG nodes in sync
    if (type === "cause" || type === "alert") {
      highlightNextDagNode();
    }
  }

  await sleep(400);

  // 2) Type indicator + bot bubbles
  for (const msg of s.chat) {
    const typing = addTyping();
    await sleep(900);
    typing.remove();
    addBubble(msg);
    await sleep(500);
  }
}

function addTyping() {
  const t = document.createElement("div");
  t.className = "typing";
  t.innerHTML = "<span></span><span></span><span></span>";
  chat.appendChild(t);
  chat.scrollTop = chat.scrollHeight;
  return t;
}

function addBubble(msg) {
  const b = document.createElement("div");
  b.className = `bubble ${msg.kind || "bot"}`;
  b.innerHTML = msg.html;
  if (msg.actions) {
    const row = document.createElement("div");
    row.className = "actions-row";
    msg.actions.forEach(a => {
      const btn = document.createElement("button");
      btn.className = "a-btn" + (a.primary ? " primary" : "");
      btn.textContent = a.label;
      btn.addEventListener("click", () => handleAction(a));
      row.appendChild(btn);
    });
    b.appendChild(row);
  }
  const meta = document.createElement("div");
  meta.className = "meta";
  meta.textContent = nowTime() + "  ✓✓";
  b.appendChild(meta);
  chat.appendChild(b);
  chat.scrollTop = chat.scrollHeight;
}

function handleAction(a) {
  // user "confirms" — show user bubble + execute log
  const userBubble = document.createElement("div");
  userBubble.className = "bubble user";
  userBubble.innerHTML = a.label + `<div class="meta">${nowTime()}  ✓✓</div>`;
  chat.appendChild(userBubble);
  chat.scrollTop = chat.scrollHeight;

  if (a.exec) {
    addExecLog(a.exec);
    // bot acknowledges
    setTimeout(() => {
      const ack = document.createElement("div");
      ack.className = "bubble bot";
      ack.innerHTML = `✅ <strong>已執行</strong><br/>${a.exec}<br/><br/>📡 已透過 Meta API / WhatsApp Business API 跨平台閉環。<div class="meta">${nowTime()}  ✓✓</div>`;
      chat.appendChild(ack);
      chat.scrollTop = chat.scrollHeight;
    }, 600);
  }
}

function addExecLog(text) {
  // remove muted placeholder
  const muted = execLog.querySelector(".muted");
  if (muted) muted.remove();
  const item = document.createElement("div");
  item.className = "log-item exec";
  const ts = new Date().toLocaleTimeString("zh-HK", {hour12: false});
  item.textContent = `[${ts}] ${text}`;
  execLog.prepend(item);
  // increment KPI
  const sig = $("#kpiSignals");
  sig.textContent = parseInt(sig.textContent) + 1;
}

// ----- Reset -----
function resetAll() {
  chat.innerHTML = "";
  trace.innerHTML = `<div class="trace-empty">點擊「啟動主動預警」開始推理...</div>`;
  // welcome bubble
  const welcome = document.createElement("div");
  welcome.className = "bubble bot";
  welcome.innerHTML = `👋 你好, 我是 <strong>東風 · 張良軍師</strong>。<br/>我正在為你 24/7 監控市場與客戶數據。<br/><br/>當前場景: <strong>${SCENARIOS[currentScenario].name}</strong><div class="meta">${nowTime()}</div>`;
  chat.appendChild(welcome);
  // reset DAG highlight
  document.querySelectorAll(".dag .node").forEach(n => n.classList.remove("active"));
  document.querySelectorAll(".dag .edge").forEach(e => e.classList.remove("active"));
  dagHighlightIdx = 0;
}

// ----- TimesFM forecast chart -----
function drawForecast(fc) {
  const cv = $("#forecastChart");
  const ctx = cv.getContext("2d");
  // hi-DPI
  const dpr = window.devicePixelRatio || 1;
  const W = cv.clientWidth, H = cv.clientHeight;
  cv.width = W * dpr; cv.height = H * dpr;
  ctx.scale(dpr, dpr);
  ctx.clearRect(0, 0, W, H);

  const all = [...fc.history, ...fc.forecast];
  const max = Math.max(...all) * 1.1;
  const min = Math.min(...all) * 0.9;
  const padL = 30, padR = 10, padT = 18, padB = 24;
  const innerW = W - padL - padR;
  const innerH = H - padT - padB;
  const stepX = innerW / (all.length - 1);
  const yAt = v => padT + innerH - ((v - min) / (max - min)) * innerH;
  const xAt = i => padL + i * stepX;

  // grid
  ctx.strokeStyle = "rgba(255,255,255,0.05)";
  ctx.lineWidth = 1;
  for (let i = 0; i <= 4; i++) {
    const y = padT + (innerH / 4) * i;
    ctx.beginPath(); ctx.moveTo(padL, y); ctx.lineTo(W - padR, y); ctx.stroke();
  }

  // history line
  ctx.strokeStyle = "#4ea1ff";
  ctx.lineWidth = 2;
  ctx.beginPath();
  fc.history.forEach((v, i) => {
    if (i === 0) ctx.moveTo(xAt(i), yAt(v));
    else ctx.lineTo(xAt(i), yAt(v));
  });
  ctx.stroke();

  // forecast line (dashed orange)
  const fStart = fc.history.length - 1;
  ctx.strokeStyle = "#ff7a2e";
  ctx.setLineDash([5, 4]);
  ctx.beginPath();
  ctx.moveTo(xAt(fStart), yAt(fc.history[fc.history.length - 1]));
  fc.forecast.forEach((v, i) => {
    ctx.lineTo(xAt(fStart + 1 + i), yAt(v));
  });
  ctx.stroke();
  ctx.setLineDash([]);

  // forecast band (uncertainty)
  ctx.fillStyle = "rgba(255,122,46,0.15)";
  ctx.beginPath();
  ctx.moveTo(xAt(fStart), yAt(fc.history[fc.history.length - 1]));
  fc.forecast.forEach((v, i) => ctx.lineTo(xAt(fStart + 1 + i), yAt(v * 1.1)));
  for (let i = fc.forecast.length - 1; i >= 0; i--) {
    ctx.lineTo(xAt(fStart + 1 + i), yAt(fc.forecast[i] * 0.9));
  }
  ctx.closePath();
  ctx.fill();

  // turn point
  if (fc.turnIndex !== undefined && fc.turnIndex < all.length) {
    const tx = xAt(fc.turnIndex), ty = yAt(all[fc.turnIndex]);
    ctx.fillStyle = "#ff5a5f";
    ctx.beginPath(); ctx.arc(tx, ty, 6, 0, Math.PI*2); ctx.fill();
    ctx.strokeStyle = "rgba(255,90,95,0.4)"; ctx.lineWidth = 2;
    ctx.beginPath(); ctx.arc(tx, ty, 11, 0, Math.PI*2); ctx.stroke();
    ctx.fillStyle = "#ff5a5f"; ctx.font = "bold 10px monospace";
    ctx.fillText("轉折點", tx - 16, ty - 14);
  }

  // y-label
  ctx.fillStyle = "#8aa0c4"; ctx.font = "10px sans-serif";
  ctx.fillText(fc.yLabel, padL, 12);
  ctx.fillText("now →", xAt(fStart) - 14, H - 6);
}

// ----- DAG diagram -----
function drawDAG(dag) {
  const svg = $("#dagSvg");
  svg.innerHTML = `
    <defs>
      <marker id="arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto">
        <path d="M0,0 L10,5 L0,10 z" fill="#8aa0c4" />
      </marker>
    </defs>`;
  // edges
  dag.edges.forEach(([from, to]) => {
    const a = dag.nodes.find(n => n.id === from);
    const b = dag.nodes.find(n => n.id === to);
    const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
    const cx = (a.x + b.x) / 2;
    path.setAttribute("d", `M${a.x+30},${a.y} Q${cx},${(a.y+b.y)/2} ${b.x-30},${b.y}`);
    path.setAttribute("class", "edge");
    path.dataset.from = from; path.dataset.to = to;
    svg.appendChild(path);
  });
  // nodes
  dag.nodes.forEach(n => {
    const g = document.createElementNS("http://www.w3.org/2000/svg", "g");
    const rect = document.createElementNS("http://www.w3.org/2000/svg", "rect");
    rect.setAttribute("x", n.x - 30); rect.setAttribute("y", n.y - 16);
    rect.setAttribute("width", 60); rect.setAttribute("height", 32);
    rect.setAttribute("rx", 6);
    rect.setAttribute("class", `node ${n.type}`);
    rect.dataset.id = n.id;
    g.appendChild(rect);
    // text (multi-line)
    const lines = n.label.split("\n");
    lines.forEach((line, i) => {
      const t = document.createElementNS("http://www.w3.org/2000/svg", "text");
      t.setAttribute("x", n.x);
      t.setAttribute("y", n.y - 2 + i * 10 - (lines.length-1)*4);
      t.setAttribute("text-anchor", "middle");
      t.textContent = line;
      g.appendChild(t);
    });
    svg.appendChild(g);
  });
}

let dagHighlightIdx = 0;
function highlightNextDagNode() {
  const dag = SCENARIOS[currentScenario].dag;
  if (dagHighlightIdx >= dag.nodes.length) return;
  const node = dag.nodes[dagHighlightIdx];
  const rect = document.querySelector(`.dag rect[data-id="${node.id}"]`);
  if (rect) rect.classList.add("active");
  // light up edges leaving this node
  document.querySelectorAll(`.dag .edge[data-from="${node.id}"]`).forEach(e => e.classList.add("active"));
  dagHighlightIdx++;
}

// ----- Utils -----
const sleep = (ms) => new Promise(r => setTimeout(r, ms));
const nowTime = () => new Date().toLocaleTimeString("zh-HK", {hour: "2-digit", minute: "2-digit", hour12: false});

// ----- Init -----
resetAll();
drawForecast(SCENARIOS.insurance.forecast);
drawDAG(SCENARIOS.insurance.dag);
