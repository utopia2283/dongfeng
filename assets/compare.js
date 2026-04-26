/* ============================================================
 * 三方對決 · ChatGPT vs Perplexity vs 東風
 * 用 staggered typing 模擬三方同時運行, 結果在用戶眼前形成對比
 * ============================================================ */

const TASKS = {
  // ----------------------------------------------------------
  churn: {
    label: "保險經紀 · 大客戶流失預警",
    gptPrompt: "我是保險經紀, 我的客戶最近有點冷淡, 怎麼辦?",
    pplxPrompt: "保險經紀 客戶流失 挽回 最佳實踐",
    gpt: [
      ["bad", "📚 一般建議:"],
      ["", "1. 主動聯繫客戶, 例如發送 WhatsApp 問候。"],
      ["", "2. 提供節日禮品或優惠券。"],
      ["", "3. 安排面談, 了解客戶最新需求。"],
      ["", "4. 定期分享理財資訊, 增加互動。"],
      ["bad", "⚠ 缺陷: 不認識你的客戶, 無法判斷時機, 建議僅為通用模板。"]
    ],
    pplx: [
      ["meh", "🌐 來源: insurancejournal.com / linkedin.com (3 篇)"],
      ["", "依據 2023 業界研究, 客戶流失原因前三:"],
      ["", "① 缺乏定期 touchpoint (33%)"],
      ["", "② 競爭對手低價挖角 (28%)"],
      ["", "③ 個人化不足 (19%)"],
      ["", "建議: 建立 90 天 touch cadence, 並使用 CRM 自動化。"],
      ["meh", "⚠ 缺陷: 無法看到你的客戶實際行為, 只能引用公網普遍建議。"]
    ],
    df: [
      ["good", "🚨 主動預警 (用戶未提問, 雷達自動觸發)"],
      ["", "<strong>用戶: Match, 對象: 陳Sir (大客戶)</strong>"],
      ["", "📡 接入數據:"],
      ["", "  • Facebook: 陳Sir 連續 14 日無互動 (基線 2.1 次/週)"],
      ["", "  • <strong>Instagram: 股票/債券內容瀏覽 +210%</strong>"],
      ["", "  • WhatsApp: 回覆延遲 2h → 13h"],
      ["", "  • 公網: 銀行加息週期啟動 (HKD Prime +0.5%)"],
      ["good", "🧠 張良 DAG 因果鏈:"],
      ["", "  加息週期 → 高淨值資產轉移 → 陳Sir 投資意願偏移"],
      ["", "  排除假性相關 27 條 (季節性/天氣/節假日)"],
      ["", "📈 張良雷達預測: 流失機率 <strong>68%</strong>, 提前預判 18 天"],
      ["good", "🎯 個人化方案 (非通用):"],
      ["", "  T+0  發送《加息環境下儲蓄險 vs 定存對比表》"],
      ["", "  T+7  邀請陳Sir 參加「家族財富傳承」線下小聚"],
      ["", "  T+14 follow-up · 預測簽單機率回升至 <strong>73%</strong>"],
      ["good", "⚡ WhatsApp 一鍵閉環: 點「執行」→ 已透過 Meta API 排程"]
    ],
    verdict: "ChatGPT 給你一份 <em>萬能模板</em> — 90% 像保險公司新人手冊。Perplexity 引用 <em>兩年前的業界研究</em>。<strong>只有東風</strong>看見陳Sir 在 IG 看了股票, 在 WhatsApp 拖延回覆, 並把這些信號餵入因果模型, 給出 <strong>提前 18 天</strong> 的個人化狙擊方案。"
  },

  // ----------------------------------------------------------
  cafe: {
    label: "SME · 咖啡店訂單暴跌診斷",
    gptPrompt: "我的咖啡店這週訂單跌了 38%, 怎麼辦?",
    pplxPrompt: "咖啡店 銷量下跌 原因 解決方案",
    gpt: [
      ["bad", "📚 一般診斷:"],
      ["", "可能原因 (按常見度排序):"],
      ["", "① 季節性因素 (天氣轉冷, 客流減少)"],
      ["", "② 競爭加劇 (同區新開咖啡店)"],
      ["", "③ 產品老化, 缺乏新品"],
      ["bad", "建議: 推出 8 折優惠券、新品試飲、社群媒體推廣。"]
    ],
    pplx: [
      ["meh", "🌐 來源: hbr.org / forbes.com / smallbiz.com"],
      ["", "F&B 銷量下跌標準應對:"],
      ["", "① 短期: 限時折扣 + Loyalty Program"],
      ["", "② 中期: 重新審視 menu engineering"],
      ["", "③ 長期: brand positioning 調整"],
      ["meh", "⚠ 缺陷: 無法判斷你的具體下跌原因, 給的是 textbook 答案。"]
    ],
    df: [
      ["good", "🚨 法醫式診斷 (主動觸發)"],
      ["", "<strong>用戶: Annie (連鎖咖啡店店主)</strong>"],
      ["", "📡 接入數據 (對照組驗證):"],
      ["", "  • 天氣 API: 同區其他 12 家咖啡店僅跌 -3% → <strong>排除天氣</strong>"],
      ["", "  • IG 興趣標籤: 隔壁手搖店客群與你重疊度僅 12% → <strong>排除競品</strong>"],
      ["", "  • <strong>Facebook Insights: 4/18 起貼文觸達 -47%</strong>"],
      ["", "  • POS 數據: 跌幅集中在 IG 引流的客群"],
      ["good", "🧠 張良 DAG 鎖定真兇:"],
      ["", "  → FB 演算法 4/18 改版 (Reels 權重提升)"],
      ["", "  → 你貼文觸達崩盤 -47% → 自然流量蒸發 → 訂單 -38%"],
      ["good", "🎯 修復方案 (避開血虧紅海):"],
      ["", "  ① 啟用 IG Reels 短視頻 (新演算法權重最高)"],
      ["", "  ② WhatsApp Broadcast 213 名熟客 (觸達 100%)"],
      ["", "  ③ HK$200 Lookalike Top 20% 客戶"],
      ["", "  📈 張良雷達預測: 21 天反超 <strong>+12%</strong>"],
      ["good", "⚠ 千萬不要打折! 客戶根本沒看見你, 折扣只會加速倒閉。"]
    ],
    verdict: "ChatGPT 直接告訴 Annie 「打折」, 結果是 <em>純血虧</em> — 因為客戶根本沒看見她。Perplexity 給 <em>HBR 教科書</em> 答案, 一樣不解決問題。<strong>東風的法醫式 DAG 推理</strong> 用對照組精準排除天氣與競品, 鎖定真兇是 <strong>FB 演算法改版</strong>, 並給出 21 天反超 +12% 的可執行方案。"
  },

  // ----------------------------------------------------------
  beauty: {
    label: "SME · 美容院母親節促銷",
    gptPrompt: "幫我寫一個母親節美容促銷方案",
    pplxPrompt: "美容院 母親節 行銷活動 案例",
    gpt: [
      ["bad", "🎁 母親節促銷企劃:"],
      ["", "主題: 「母女同行, 美麗加倍」"],
      ["", "策略:"],
      ["", "  ① 母女同行 8 折優惠"],
      ["", "  ② 送限量康乃馨"],
      ["", "  ③ 投放 FB / IG 廣告"],
      ["bad", "⚠ 缺陷: 全港 80% 美容院都用同樣 prompt, 廣告競價飆 3 倍, 紅海血戰。"]
    ],
    pplx: [
      ["meh", "🌐 來源: 7 篇行銷案例 (主要來自 2022-2023)"],
      ["", "經典母親節 F&B / Beauty 行銷套路:"],
      ["", "① 親子套裝 ② 母女同行 ③ 限量贈品 ④ 線上抽獎"],
      ["", "建議結合 KOL 合作, 並使用 UGC 增加觸達。"],
      ["meh", "⚠ 缺陷: 不知道你客戶是誰, 也不知道現在廣告競價已飆升。"]
    ],
    df: [
      ["good", "🚨 紅海預警 (主動觸發, 距母親節 21 天)"],
      ["", "<strong>用戶: Lily (美容院老闆娘)</strong>"],
      ["", "📡 接入數據:"],
      ["", "  • <strong>Meta Ads 即時競價: 「母女同行」CPM 飆 +300%</strong>"],
      ["", "  • 全網 NLP 分析: 80% 同行用 AI 寫一樣文案"],
      ["", "  • <strong>IG 興趣標籤: 你 213 名 VIP 中, 32 人關注「產後修復」</strong>"],
      ["", "  • CRM: 該 32 名客戶平均客單價是普通客 1.8 倍"],
      ["good", "🧠 張良 DAG 切藍海:"],
      ["", "  紅海 (母女牌) ROI 預測: <strong>-32%</strong>"],
      ["", "  藍海 (新手媽媽自我犒賞) ROI 預測: <strong>+218%</strong>"],
      ["good", "🎯 個人化執行:"],
      ["", "  • 32 份個性化 WhatsApp 邀請函已寫好 (含客戶稱呼)"],
      ["", "  • CAC 預估僅同行 1/5"],
      ["", "  • 客單價可提升 +40%"],
      ["good", "⚡ 一鍵發送 → Meta API 跨平台閉環"]
    ],
    verdict: "ChatGPT 給的「母女同行 8 折」 — <em>全港 80% 美容院</em> 都在用一樣的 prompt, FB 競價飆 3 倍, 跟著用就是 <strong>純血虧 -32% ROI</strong>。Perplexity 也只能引用公網行銷案例。<strong>只有東風</strong>能看到 Lily 的 213 名 VIP 中, 哪 32 人正在 IG 看產後修復內容, 並切到 <strong>藍海 +218% ROI</strong>。"
  },

  // ----------------------------------------------------------
  close: {
    label: "保險經紀 · 何時逼單?",
    gptPrompt: "我有一個猶豫的客戶, 什麼時候適合逼單?",
    pplxPrompt: "保險銷售 逼單 時機 心理學 技巧",
    gpt: [
      ["bad", "📚 銷售技巧:"],
      ["", "通用逼單時機判斷:"],
      ["", "  ① 客戶提出具體問題 → 表示有興趣"],
      ["", "  ② 連續 3 次積極互動 → 可推進"],
      ["", "  ③ 用「假設成交法」測試"],
      ["bad", "⚠ 缺陷: 完全不懂你的客戶現在在哪個情緒階段, 推錯時機反而 block。"]
    ],
    pplx: [
      ["meh", "🌐 來源: salesforce.com / hubspot.com"],
      ["", "B2C 銷售逼單最佳實踐:"],
      ["", "① BANT 框架評估"],
      ["", "② SPIN Selling 技巧"],
      ["", "③ 創造稀缺性 (限時優惠)"],
      ["meh", "⚠ 缺陷: 給的是銷售方法論, 而非「現在該不該打給陳Sir」這個具體答案。"]
    ],
    df: [
      ["good", "🚨 時序狙擊 (個體化建模)"],
      ["", "<strong>用戶: Match, 對象: 陳Sir (大客戶)</strong>"],
      ["", "📡 接入多維時序:"],
      ["", "  • 過去 10 年加息/減息週期 × 該客戶歷史下單 pattern"],
      ["", "  • IG: 陳Sir 樓市新聞停留時間斜率 +63%"],
      ["", "  • 同區租金回報率微幅上揚 (公網)"],
      ["", "  • WhatsApp 對話情緒分析: 決策疲勞 + 觀望"],
      ["good", "🧠 張良雷達 · 高維時序預測:"],
      ["", "  <strong>現在</strong> 逼單成功率: <strong>0%</strong> (會被 block 73%)"],
      ["", "  <strong>T+7</strong>  保溫期: 5%"],
      ["", "  <strong>T+14</strong> 觀察期: 28%"],
      ["", "  <strong>T+21 週四 15:00</strong> 簽單峰值: <strong>85% ★</strong>"],
      ["good", "🎯 21 日 sequence 已排程:"],
      ["", "  T+0  按兵不動 / T+7 租金走勢圖 / T+14 加息見頂評論"],
      ["", "  <strong>T+21 週四 15:00 — 「X 樓盤最後 3 個靚坐向」獨家盤</strong>"],
      ["good", "⚡ 排程已寫入 Meta + WhatsApp Business API"]
    ],
    verdict: "ChatGPT 教你「BANT 框架」 — Match 看完還是不知道現在該不該打。Perplexity 給 Salesforce 教科書答案。<strong>只有東風</strong>用張良雷達結合陳Sir 個人 IG 軌跡 + 10 年加息週期, 算出 <em>3 週後週四 15:00</em> 才是 <strong>85% 簽單峰值</strong>。這是公網 AI 永遠做不到的 — 因為它們看不見你的客戶。"
  },

  // ----------------------------------------------------------
  fitness: {
    label: "健身教練 · 會員續會預警",
    gptPrompt: "我的會員最近不怎麼來了, 怎麼挽留她?",
    pplxPrompt: "健身房 會員流失 挽留 策略",
    gpt: [
      ["bad", "📚 一般建議:"],
      ["", "1. 發訊息問候: 「最近怎麼沒來呀, 要不要約個時間?」"],
      ["", "2. 提供折扣或免費課程吸引回來。"],
      ["", "3. 推薦新課程或私教方案。"],
      ["bad", "⚠ 缺陷: 完全不知道會員為什麼不來, 通用挽留 90% 沒效。"]
    ],
    pplx: [
      ["meh", "🌐 來源: ihrsa.org / fitnessbusiness.com"],
      ["", "健身房會員流失通用解方:"],
      ["", "① 個人化關心訊息 ② 凍結會籍方案"],
      ["", "③ 引入 group class ④ 推薦補品/裝備"],
      ["meh", "⚠ 缺陷: 不認識會員的真實狀態與興趣轉變。"]
    ],
    df: [
      ["good", "🚨 主動預警 (流失前 3 週)"],
      ["", "<strong>用戶: Kenny, 對象: Sandra (會員 8 個月)</strong>"],
      ["", "📡 接入數據:"],
      ["", "  • <strong>Apple Health (授權): 步數 +35%, 心率區間正常</strong>"],
      ["", "  • <strong>IG: 馬拉松訓練內容停留 +340%</strong>"],
      ["", "  • <strong>FB: 加入「香港跑友會」社團</strong>"],
      ["", "  • 出席記錄: 月課時 12 → 2"],
      ["good", "🧠 張良 DAG 反事實檢驗:"],
      ["", "  ✗ 排除: 身體不適 (健康數據正常)"],
      ["", "  ✗ 排除: 工作太忙 (步數反而上升)"],
      ["", "  ✓ 鎖定: 運動偏好從健身轉向跑步"],
      ["good", "🎯 偏好對齊挽留方案:"],
      ["", "  ① 推「跑者專屬肌力訓練」(她痛點對中)"],
      ["", "  ② WhatsApp: 「下個月渣馬訓練營」"],
      ["", "  📈 預測續會率: 21% → <strong>74%</strong>"],
      ["good", "⚡ 一鍵發送個性化訊息"]
    ],
    verdict: "ChatGPT 教 Kenny 發「最近怎麼沒來呀」 — 90% 會被讀不回。Perplexity 給 IHRSA 教科書答案。<strong>只有東風</strong>看見 Sandra 在 IG 看馬拉松、加入跑步社團, 並用 Apple Health 數據反事實檢驗排除「身體不適」「太忙」, 最後給出 <strong>偏好對齊挽留方案</strong> — 續會率 21% → 74%。"
  },

  // ----------------------------------------------------------
  estate: {
    label: "地產代理 · 帶看後何時 follow-up?",
    gptPrompt: "我帶完客戶看樓, 什麼時候跟進最好?",
    pplxPrompt: "地產 帶看後 follow-up 最佳時機",
    gpt: [
      ["bad", "📚 銷售標準作業:"],
      ["", "① 24 小時黃金 follow-up 法則"],
      ["", "② 發感謝訊息 + 房屋資料"],
      ["", "③ 3 天內再致電確認意向"],
      ["bad", "⚠ 缺陷: 24h follow-up 對「已看 7 套」的觀望客戶反而會嚇跑。"]
    ],
    pplx: [
      ["meh", "🌐 來源: NAR.realtor / inman.com"],
      ["", "地產經紀 follow-up 最佳實踐:"],
      ["", "① 24h 內發送 thank you note + 物件資料"],
      ["", "② 1 週內提供市場走勢分析"],
      ["", "③ 客戶反對議題 (objections) 提前處理"],
      ["meh", "⚠ 缺陷: 給的是 SOP, 不是針對「Mr. Wong」這位具體客戶。"]
    ],
    df: [
      ["good", "🚨 個人化時序狙擊"],
      ["", "<strong>用戶: David, 對象: Mr. Wong (已看 7 套樓)</strong>"],
      ["", "📡 接入數據:"],
      ["", "  • <strong>IG: 收藏「裝修風格」內容 +210%</strong>"],
      ["", "  • <strong>網站埋點: 按揭計算器訪問 3 次</strong>"],
      ["", "  • 帶看記錄: 已看 7 套 (已過比較期)"],
      ["", "  • CRM: 客戶心理階段 = 「擁有想像」"],
      ["good", "🧠 張良雷達預測簽約意願曲線:"],
      ["", "  T+1: 25% (24h follow-up = 警戒)"],
      ["", "  T+3: 58%"],
      ["", "  <strong>T+5 週四 18:00: 91% ★ 峰值</strong>"],
      ["good", "🎯 個人化 5 日 sequence:"],
      ["", "  T+0~T+3: 不打擾, 只發成交價走勢圖"],
      ["", "  T+4: 推送他偏好的裝修風格案例"],
      ["", "  <strong>T+5 週四 18:00: 約看樓書 + 限期優惠</strong>"],
      ["good", "⚡ 排程已寫入 Meta + WhatsApp API"]
    ],
    verdict: "ChatGPT/Perplexity 給的「24h 黃金法則」對 Mr. Wong 是<strong>毒藥</strong> — 他已看 7 套樓, 24h 推銷會被 block (block 率 68%)。<strong>東風</strong>用 IG 收藏 + 按揭計算器訪問 + 帶看歷史, 算出 <strong>T+5 週四 18:00 才是 91% 簽約峰值</strong>。這就是「公網 SOP」與「個人化時序狙擊」的差距。"
  },

  // ----------------------------------------------------------
  restaurant: {
    label: "餐廳 · 下午茶空台優化",
    gptPrompt: "下午茶時段沒人, 怎麼增加生意?",
    pplxPrompt: "餐廳 空閒時段 promotion 案例",
    gpt: [
      ["bad", "📚 通用方案:"],
      ["", "① 推下午茶套餐 8 折"],
      ["", "② 發 IG 貼文宣傳"],
      ["", "③ 加入 Open Rice / foodpanda 推廣"],
      ["bad", "⚠ 缺陷: 全面降價會傷淨利, 通用宣傳沒目標客群。"]
    ],
    pplx: [
      ["meh", "🌐 來源: restaurantbusiness.com / 7 篇案例"],
      ["", "F&B off-peak 經典套路:"],
      ["", "① Happy Hour 定價 ② Loyalty 累積點數"],
      ["", "③ Co-working 空間轉換 ④ 主題日活動"],
      ["meh", "⚠ 缺陷: 不知道你周邊有什麼客群, 也沒分時策略。"]
    ],
    df: [
      ["good", "🚨 私域 + 地理 + 動態定價"],
      ["", "<strong>用戶: Ivy (港式茶餐廳)</strong>"],
      ["", "📡 接入數據:"],
      ["", "  • <strong>POS: 15-17 點翻台率僅 28% (其他時段 90%)</strong>"],
      ["", "  • <strong>FB Geo-data: 1.5km 內 4,300 名 OL</strong>"],
      ["", "  • <strong>IG hashtag「下午茶」搜尋 +180%</strong>"],
      ["", "  • 對照組: 同區 3 家分時定價店翻台 +47%"],
      ["good", "🧠 張良 DAG 反事實:"],
      ["", "  ✗ 排除: 「下午茶就是冷時段」"],
      ["", "  ✗ 排除: 全面降價 (淨利率 -12%)"],
      ["", "  ✓ 鎖定: 動態定價 + 精準 OL 觸達"],
      ["good", "🎯 3 步落地方案:"],
      ["", "  ① 15-17 點蛋撻買一送半 + WiFi 升速"],
      ["", "  ② IG Story 廣告 (1.5km Geo + OL 興趣)"],
      ["", "  ③ Loyalty 加 WhatsApp 鎖回頭客"],
      ["", "  📈 預估 21 天: 翻台 28% → <strong>75%</strong>, 月增 HK$28,000"]
    ],
    verdict: "ChatGPT 給「下午茶 8 折」 — 全面降價傷淨利。Perplexity 給 Happy Hour 範本 — 不認識你周邊的人。<strong>東風</strong>看見你 1.5km 內有 4,300 OL, 而且她們在 IG 搜「下午茶 hashtag」+180%, 並用對照組驗證「動態定價 + 精準 Geo 觸達」 — 翻台率 28% → 75%, 月增 HK$28,000。"
  },
};

const $ = (s) => document.querySelector(s);
let currentTask = "churn";

document.querySelectorAll(".task-tab").forEach(tab => {
  tab.addEventListener("click", () => {
    document.querySelectorAll(".task-tab").forEach(t => t.classList.remove("active"));
    tab.classList.add("active");
    currentTask = tab.dataset.task;
    resetAll();
  });
});

$("#runBtn").addEventListener("click", () => runTask(currentTask));

function resetAll() {
  $("#gptOutput").innerHTML  = `<div class="empty">點擊「同時運行三方」開始</div>`;
  $("#pplxOutput").innerHTML = `<div class="empty">點擊「同時運行三方」開始</div>`;
  $("#dfOutput").innerHTML   = `<div class="empty">點擊「同時運行三方」開始</div>`;
  $("#gptPrompt").textContent  = TASKS[currentTask].gptPrompt;
  $("#pplxPrompt").textContent = TASKS[currentTask].pplxPrompt;
  $("#verdictBody").innerHTML = "先運行測試, 再看結論。";
  // restart data stream animation
  const stream = $("#dfStream");
  const rows = stream.innerHTML;
  stream.innerHTML = "";
  setTimeout(() => stream.innerHTML = rows, 30);
}

async function runTask(key) {
  resetAll();
  const t = TASKS[key];
  $("#gptPrompt").textContent  = t.gptPrompt;
  $("#pplxPrompt").textContent = t.pplxPrompt;
  $("#gptOutput").innerHTML  = "";
  $("#pplxOutput").innerHTML = "";
  $("#dfOutput").innerHTML   = "";

  // run all three concurrently with different speeds
  await Promise.all([
    streamLines("#gptOutput",  t.gpt,  220),
    streamLines("#pplxOutput", t.pplx, 240),
    streamLines("#dfOutput",   t.df,   180),
  ]);

  // verdict
  $("#verdictBody").innerHTML = t.verdict;
}

async function streamLines(sel, lines, delay) {
  const el = $(sel);
  for (const [tag, text] of lines) {
    await sleep(delay);
    const div = document.createElement("div");
    div.className = "resp-line";
    if (tag) {
      const span = document.createElement("span");
      span.className = `resp-tag ${tag}`;
      span.textContent = tag === "good" ? "✓ 因果" : tag === "meh" ? "公網" : "❌ 通用";
      div.appendChild(span);
    }
    const txt = document.createElement("span");
    txt.innerHTML = text;
    div.appendChild(txt);
    el.appendChild(div);
    el.scrollTop = el.scrollHeight;
  }
}

const sleep = (ms) => new Promise(r => setTimeout(r, ms));

// ----- Init -----
resetAll();

// Animate accuracy bars on scroll into view
const acc = document.querySelector(".acc-grid");
if (acc) {
  const obs = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        document.querySelectorAll(".bar").forEach(b => {
          const w = b.style.width;
          b.style.width = "0%";
          requestAnimationFrame(() => {
            setTimeout(() => b.style.width = w, 50);
          });
        });
        obs.disconnect();
      }
    });
  }, {threshold: 0.3});
  obs.observe(acc);
}

/* ============================================================
 *  OAuth flow animation
 *  - Auto-plays when section scrolls into view
 *  - Replayable via "▶ 播放接入動畫" button
 * ============================================================ */
async function playOAuthFlow() {
  const stage1 = $("#oauthStage1");
  const stage2 = $("#oauthStage2");
  const stage3 = $("#oauthStage3");
  const arrow1 = $("#oauthArrow1");
  const arrow2 = $("#oauthArrow2");
  const btn = $("#oauthBtn");
  const scopes = document.querySelectorAll("#oauthScopes li");
  const confirm = $("#oauthConfirm");
  const streams = document.querySelectorAll("#dataStreams .stream");
  const finalHint = $("#oauthFinalHint");

  if (!stage1) return;

  // reset
  [stage1, stage2, stage3].forEach(s => s.classList.remove("active"));
  [arrow1, arrow2].forEach(a => a.classList.remove("flowing"));
  btn?.classList.remove("clicked");
  confirm?.classList.remove("ready", "clicked");
  scopes.forEach(s => s.classList.remove("shown"));
  streams.forEach(s => s.classList.remove("streaming"));
  if (finalHint) finalHint.textContent = "等待授權...";

  await sleep(400);

  // Step 1: user device
  stage1.classList.add("active");
  await sleep(900);

  // user clicks Connect
  btn?.classList.add("clicked");
  await sleep(500);

  // arrow 1 flows
  arrow1.classList.add("flowing");
  await sleep(700);

  // Step 2: OAuth window
  stage2.classList.add("active");
  await sleep(500);

  // scopes appear one by one
  for (let i = 0; i < scopes.length; i++) {
    scopes[i].classList.add("shown");
    await sleep(280);
  }
  await sleep(300);
  confirm?.classList.add("ready");
  await sleep(700);

  // user allows
  confirm?.classList.add("clicked");
  await sleep(600);

  // arrow 2 flows
  arrow2.classList.add("flowing");
  await sleep(700);

  // Step 3: engine + data streams
  stage3.classList.add("active");
  if (finalHint) finalHint.textContent = "🟢 雷達啟動 · 24/7 監控中";
  await sleep(400);
  for (let i = 0; i < streams.length; i++) {
    streams[i].classList.add("streaming");
    await sleep(220);
  }
}

const oauthReplayBtn = $("#oauthReplayBtn");
if (oauthReplayBtn) oauthReplayBtn.addEventListener("click", playOAuthFlow);

// auto-play when scrolled into view (once)
const oauthSection = document.querySelector(".oauth-section");
if (oauthSection) {
  let played = false;
  const oauthObs = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting && !played) {
        played = true;
        playOAuthFlow();
      }
    });
  }, {threshold: 0.35});
  oauthObs.observe(oauthSection);
}

