/* ============================================================
 * 東風 DONG FENG · 張良引擎 · MVP Front-End Logic (v2)
 * ------------------------------------------------------------
 * v2 升級重點:
 *   ✦ SEXY DAG: 圓形節點 + 圖標 + 邊權重 + 能量流動粒子
 *   ✦ 信賴度 Gauge 半圓儀表
 *   ✦ 反事實檢驗 Counterfactual 排除動畫
 *   ✦ 7 個垂直行業實戰場景 (4 + 3 NEW)
 *   ✦ 推理 trace 每步含 P-value / 信賴度
 * ============================================================ */

const SCENARIOS = {
  // ============================================================
  //  保險經紀 · 客戶流失預警
  // ============================================================
  insurance: {
    name: "保險經紀 · 客戶流失預警",
    persona: "Match (保險經紀)",
    confidence: 91,
    counterfactuals: [
      "季節性下單習慣 (對照組同樣季節無此 effect)",
      "節假日影響 (Easter 期間其他客戶活躍度正常)",
      "整體市場情緒 (恆指同期 +1.2%, 排除大盤)",
    ],
    forecast: {
      history: [82, 80, 78, 81, 79, 76, 74, 72, 70, 68, 65, 63],
      forecast: [62, 60, 57, 53, 47, 38, 30, 24, 20],
      turnIndex: 14, yLabel: "客戶活躍度指數"
    },
    dag: {
      nodes: [
        {id:"A", x:80,  y:60,  icon:"💰", label:"加息週期", type:"cause"},
        {id:"B", x:80,  y:160, icon:"📸", label:"IG看股票↑210%", type:"evidence"},
        {id:"C", x:80,  y:260, icon:"💬", label:"WhatsApp 延遲", type:"evidence"},
        {id:"D", x:230, y:110, icon:"📉", label:"投資意願轉移", type:"effect"},
        {id:"E", x:230, y:210, icon:"⏳", label:"猶豫期延長", type:"effect"},
        {id:"F", x:360, y:160, icon:"🚨", label:"流失 +68%", type:"alert"},
      ],
      edges: [
        ["A","D",0.78],["B","D",0.65],["C","E",0.55],
        ["D","F",0.72],["E","F",0.41],
      ]
    },
    trace: [
      ["data",  "→ 接入 WhatsApp / Meta Ads / CRM 數據流", null],
      ["step",  "[1/5] 張良雷達載入近 90 日 12 維時序", 22],
      ["step",  "[2/5] 偵測客戶活躍度斜率 < -0.42σ", 41],
      ["step",  "[3/5] DAG do-calculus 反推, 排除假性相關 27 條", 68],
      ["cause", "✓ 真因鎖定: 加息週期 → 投資意願轉移", 84],
      ["cause", "✓ 證據驗證: IG 股票內容 +210% (P=0.93)", 89],
      ["alert", "⚠ 預警: 續保流失 68% · 信賴 91%", 91],
      ["step",  "[5/5] 生成主動推送 + 反向狙擊話術", 91],
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
        ① 今晚 9:15 PM 發送 <em>《加息環境下儲蓄險 vs 定存對比表》</em><br/>
        ② 7 天後邀請陳Sir 參加你的「家族財富傳承」線下小聚<br/>
        ③ 14 天後再 follow-up — 此時轉折點到, 簽單機率 73%`,
        actions: [
          {label:"⚡ 一鍵執行三步方案", primary:true, exec:"執行 3 步保溫方案 → 已排程 (T+0, T+7, T+14)"},
          {label:"✏️ 微調話術", tweak:"insurance"}
        ]}
    ]
  },

  // ============================================================
  //  SME · 連鎖咖啡店銷量異常
  // ============================================================
  sme_cafe: {
    name: "SME · 咖啡店銷量異常",
    confidence: 88,
    counterfactuals: [
      "天氣突變 (同區其他 12 家咖啡店僅 -3%)",
      "競品干擾 (隔壁手搖店客群重疊度僅 12%)",
      "節假日因素 (本週無公眾假期)",
    ],
    forecast: {
      history: [120, 125, 130, 128, 132, 129, 127, 125, 110, 95, 80, 72],
      forecast: [70, 72, 78, 88, 102, 118, 128, 135, 138],
      turnIndex: 13, yLabel: "日均訂單數"
    },
    dag: {
      nodes: [
        {id:"A", x:80,  y:60,  icon:"🌧️", label:"天氣突變", type:"cause"},
        {id:"B", x:80,  y:160, icon:"☕", label:"隔壁手搖店", type:"cause"},
        {id:"C", x:80,  y:260, icon:"📘", label:"FB 4/18 改版", type:"cause"},
        {id:"D", x:230, y:160, icon:"📡", label:"觸達 -47%", type:"effect"},
        {id:"E", x:360, y:160, icon:"💸", label:"訂單 -38%", type:"alert"},
      ],
      edges: [["C","D",0.91],["D","E",0.84]]
    },
    trace: [
      ["data",  "→ 拉取 POS / Meta Insights / 天氣 API", null],
      ["step",  "[1/5] 偵測 7 日訂單異常 -38%", 24],
      ["step",  "[2/5] 對照組: 同區咖啡店僅 -3% → 排除天氣", 51],
      ["step",  "[3/5] 客群重疊度 12% → 排除競品", 67],
      ["cause", "✓ 鎖定真因: FB 演算法 4/18 改版", 82],
      ["cause", "✓ 證據: 自然觸達崩盤 -47% (P=0.96)", 88],
      ["alert", "⚠ 平庸 AI 會建議「打折」→ 純血虧!", 88],
      ["step",  "[5/5] 生成觸達修復方案 (非價格策略)", 88],
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
          {label:"📊 看詳細因果圖", view:"dag"}
        ]}
    ]
  },

  // ============================================================
  //  保險經紀 · 完美狙擊逼單時點
  // ============================================================
  insurance_close: {
    name: "保險經紀 · 完美狙擊逼單",
    confidence: 84,
    counterfactuals: [
      "假性催促信號 (客戶其實在觀望期不在決策期)",
      "通用逼單時間表 (9-5 工作時間並非個人最佳)",
    ],
    forecast: {
      history: [40, 42, 45, 48, 50, 52, 55, 58, 60, 62, 63, 65],
      forecast: [67, 70, 73, 76, 80, 83, 85, 84, 81],
      turnIndex: 18, yLabel: "客戶下單意願 %"
    },
    dag: {
      nodes: [
        {id:"A", x:80,  y:60,  icon:"📈", label:"加息週期", type:"cause"},
        {id:"B", x:80,  y:160, icon:"🏠", label:"看樓市新聞↑", type:"evidence"},
        {id:"C", x:80,  y:260, icon:"💴", label:"租金上揚", type:"cause"},
        {id:"D", x:230, y:160, icon:"💡", label:"租轉買轉折點", type:"effect"},
        {id:"E", x:360, y:160, icon:"🎯", label:"T+21 簽單 85%", type:"alert"},
      ],
      edges: [["A","D",0.62],["B","D",0.71],["C","D",0.45],["D","E",0.85]]
    },
    trace: [
      ["data",  "→ 接入樓市新聞 / 客戶閱讀軌跡 / 利率數據", null],
      ["step",  "[1/5] 張良雷達處理 10 年週期 × 12 維特徵", 32],
      ["step",  "[2/5] 偵測 3 週後「租轉買」情緒轉折", 58],
      ["step",  "[3/5] 個體建模: 陳生決策疲勞 + 觀望期", 71],
      ["cause", "✓ 現在逼單 = 反效果, 簽單率 0%", 78],
      ["cause", "✓ T+21 (週四 15:00) 為峰值窗口, 預測 85%", 84],
      ["alert", "⚠ 最佳行動: 按兵不動 + 保溫 + 精準狙擊", 84],
      ["step",  "[5/5] 生成 21 日陪跑 sequence", 84],
    ],
    chat: [
      {kind:"alert", html:`<span class="tag">🎯 時序狙擊</span>
        <strong>Match,</strong> 你的大客 <strong>陳Sir</strong> 目前處於「決策疲勞 + 觀望期」, 現在逼單成功率 = <strong>0%</strong>。
        <br/><br/>
        但張良雷達預測:<br/>
        <strong>📅 T+21 天 (週四 15:00)</strong> 將出現「租轉買」情緒轉折點, 簽單意願將達 <strong>85% 峰值</strong>。`},
      {kind:"bot", html:`🛡 <strong>21 日陪跑方案</strong><br/>
        ① <strong>本週</strong>: 按兵不動<br/>
        ② <strong>T+7</strong>: 發送客觀「租金走勢圖」<br/>
        ③ <strong>T+14</strong>: 分享「香港加息見頂」評論文章<br/>
        ④ <strong>T+21 週四 15:00</strong>: 「X 樓盤 最後 3 個靚坐向獨家盤」`,
        actions: [
          {label:"⚡ 一鍵排程 21 日 sequence", primary:true, exec:"已排程 4 個觸點 (T+0/+7/+14/+21)"},
          {label:"❓ 為何不能現在推?", view:"explain", viewData:{
            title:"為何現在逼單會失敗?",
            points:[
              {icon:"🚫", label:"決策疲勞期", value:"客戶看完 7 套樓, 認知資源已耗盡"},
              {icon:"📉", label:"逼單成功率", value:"0% (block 率 73%)"},
              {icon:"⏰", label:"必須等的窗口", value:"T+21 週四 15:00 (峰值 85%)"},
              {icon:"🧠", label:"心理機制", value:"觀望期 → 比較期 → 決策期, 跳階 = 反感"},
            ]}}
        ]}
    ]
  },

  // ============================================================
  //  SME · 美容院避紅海
  // ============================================================
  sme_beauty: {
    name: "SME · 美容院避紅海",
    confidence: 86,
    counterfactuals: [
      "傳統「母女同行 8 折」(全行用 AI 寫出同質文案)",
      "盲目 KOL 合作 (與你客群匹配度僅 8%)",
    ],
    forecast: {
      history: [50, 55, 60, 80, 130, 220, 350, 480, 580, 620, 640, 650],
      forecast: [660, 670, 680, 690, 700, 705, 710],
      turnIndex: 6, yLabel: "母女同行 CPM (HK$)"
    },
    dag: {
      nodes: [
        {id:"A", x:80,  y:80,  icon:"💐", label:"母親節 T-21", type:"cause"},
        {id:"B", x:80,  y:200, icon:"🤖", label:"全行同質 AI 文案", type:"cause"},
        {id:"C", x:230, y:80,  icon:"📈", label:"CPM +300%", type:"effect"},
        {id:"D", x:230, y:200, icon:"📸", label:"15% 關注產後修復", type:"evidence"},
        {id:"E", x:360, y:140, icon:"🌊", label:"切藍海 ROI+218%", type:"alert"},
      ],
      edges: [["A","C",0.40],["B","C",0.78],["C","E",0.55],["D","E",0.72]]
    },
    trace: [
      ["data",  "→ Meta Ads 競價 + 客戶 IG 興趣標籤", null],
      ["step",  "[1/5] 張良雷達預測「母女同行」CPM 飆 +300%", 32],
      ["step",  "[2/5] NLP 偵測 80% 同行用 AI 寫同樣文案", 55],
      ["step",  "[3/5] 私域分群: 32 名 VIP 關注產後修復", 71],
      ["cause", "✓ 機會: 「新手媽媽自我犒賞」零競爭藍海", 82],
      ["alert", "⚠ 跟著大隊打折 → CAC 飆 5 倍, 純虧", 86],
      ["step",  "[5/5] 生成精準分群 broadcast", 86],
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
        ✓ 預估 CAC 僅同行 1/5 ✓ 客單價 +40%<br/>
        ✓ 我已寫好 32 份個性化 WhatsApp 邀請函`,
        actions: [
          {label:"⚡ 一鍵發送 32 份個性化邀請", primary:true, exec:"已發送 32 份個性化 WhatsApp 邀請"},
          {label:"📈 對比兩種方案 ROI", view:"roi", viewData:{
            title:"紅海 vs 藍海 · ROI 對比",
            options:[
              {name:"❌ 紅海:母女同行 8 折", roi:-32, color:"#ff5a5f", note:"全行同質, CPM +300%"},
              {name:"✅ 藍海:新手媽媽自我犒賞", roi:218, color:"#28d49a", note:"私域分群, CAC 同行 1/5"},
            ],
            recommend:"立即切藍海, 跳過 21 天紅海血戰"}}
        ]}
    ]
  },

  // ============================================================
  //  🆕 健身教練 · 會員續會預警
  // ============================================================
  fitness: {
    name: "健身教練 · 會員續會預警",
    persona: "Kenny (私人健身教練)",
    confidence: 89,
    counterfactuals: [
      "通用「健身打卡頻率」(此會員一直是低頻打卡型)",
      "天氣熱導致少出門 (對照組同期出席率 +5%)",
      "會員身體不適 (其 Apple Health 公開數據顯示心率/步數正常)",
    ],
    forecast: {
      history: [12, 11, 13, 12, 10, 9, 8, 7, 5, 4, 3, 2],
      forecast: [2, 1, 1, 0, 0, 0, 0, 0, 0],
      turnIndex: 11, yLabel: "月出席課數"
    },
    dag: {
      nodes: [
        {id:"A", x:80,  y:60,  icon:"📸", label:"IG 看跑步內容↑", type:"evidence"},
        {id:"B", x:80,  y:160, icon:"💪", label:"FB 加入「跑步社團」", type:"evidence"},
        {id:"C", x:80,  y:260, icon:"📅", label:"出席頻率 -67%", type:"cause"},
        {id:"D", x:230, y:110, icon:"🏃", label:"運動偏好遷移", type:"effect"},
        {id:"E", x:230, y:210, icon:"😞", label:"課程相關性下降", type:"effect"},
        {id:"F", x:360, y:160, icon:"🚪", label:"續會率 21%", type:"alert"},
      ],
      edges: [
        ["A","D",0.74],["B","D",0.81],["C","E",0.62],
        ["D","F",0.69],["E","F",0.55]
      ]
    },
    trace: [
      ["data",  "→ 接入會員 Apple Health + IG/FB 公開興趣 + 上課記錄", null],
      ["step",  "[1/5] 張良雷達偵測出席斜率 -0.78σ (異常)", 28],
      ["step",  "[2/5] 排除身體因素 (Apple Health 步數正常)", 52],
      ["step",  "[3/5] 排除天氣 (對照組同期 +5%)", 64],
      ["cause", "✓ 真因: 會員運動偏好從健身轉跑步", 79],
      ["cause", "✓ 證據: IG 跑步內容停留時間 +340%", 86],
      ["alert", "⚠ 續會率預測 21% (信賴 89%)", 89],
      ["step",  "[5/5] 生成「混合課程」挽留方案", 89],
    ],
    chat: [
      {kind:"alert", html:`<span class="tag">🏃 會員流失預警</span>
        <strong>Kenny,</strong> 你的會員 <strong>Sandra</strong> 即將不續會 (預測續會率僅 <strong>21%</strong>, 提前 4 週預判)。
        <br/><br/>
        但問題<strong>不是健身效果不好</strong>, 也<strong>不是太忙</strong> (我用 Apple Health 對照組驗證過)。<br/>
        真因: 她近 14 天在 IG 看了大量馬拉松訓練內容, 還加入了 FB 跑步社團 — 她的運動偏好正在<strong>從健身轉跑步</strong>。`},
      {kind:"bot", html:`💡 <strong>反向挽留方案</strong><br/>
        不要勸她繼續傳統重訓! 改打<br/>
        ① 「跑者專屬肌力訓練」混合課程 (痛點對中)<br/>
        ② 私訊 Sandra: 「下個月渣馬訓練營, 私教 + 跑步小組」<br/>
        ③ 預估續會率回升至 <strong>74%</strong>, 客單價 +35%`,
        actions: [
          {label:"⚡ 一鍵發送私訊", primary:true, exec:"已用 Sandra 稱呼發送個性化 WhatsApp"},
          {label:"📈 看 ROI 對比", view:"roi", viewData:{
            title:"傳統挽留 vs 偏好對齊 · 續會率",
            options:[
              {name:"❌ 傳統挽留:打折/送私教", roi:21, color:"#ff5a5f", note:"通用方案, 90% 沒效"},
              {name:"✅ 偏好對齊:跑者肌訓課程", roi:74, color:"#28d49a", note:"客單價 +35%"},
            ],
            recommend:"以偏好對齊重建客戶連結"}}
        ]}
    ]
  },

  // ============================================================
  //  🆕 地產代理 · 帶看轉化序列
  // ============================================================
  real_estate: {
    name: "地產代理 · 帶看轉化序列",
    persona: "David (地產經紀)",
    confidence: 87,
    counterfactuals: [
      "通用「24 小時內 follow-up 」公式",
      "客戶看樓多 = 興趣高 (反相關: 看 7 套以上反而是觀望型)",
      "週末聯絡更佳 (此客戶週日反而最不易簽)",
    ],
    forecast: {
      history: [25, 28, 32, 35, 38, 42, 45, 50, 55, 58, 60, 62],
      forecast: [65, 70, 76, 82, 87, 91, 88, 82, 75],
      turnIndex: 16, yLabel: "簽約意願 %"
    },
    dag: {
      nodes: [
        {id:"A", x:80,  y:60,  icon:"🏘️", label:"已看 7 套樓", type:"evidence"},
        {id:"B", x:80,  y:160, icon:"📸", label:"IG 收藏裝修圖", type:"evidence"},
        {id:"C", x:80,  y:260, icon:"💵", label:"按揭計算器訪問×3", type:"evidence"},
        {id:"D", x:230, y:110, icon:"🤔", label:"已過比較期", type:"effect"},
        {id:"E", x:230, y:210, icon:"💭", label:"已進入「擁有想像」", type:"effect"},
        {id:"F", x:360, y:160, icon:"🎯", label:"T+5 週四 18:00 簽約峰值 91%", type:"alert"},
      ],
      edges: [
        ["A","D",0.68],["B","E",0.83],["C","E",0.79],
        ["D","F",0.62],["E","F",0.91]
      ]
    },
    trace: [
      ["data",  "→ 接入帶看記錄 / IG 收藏 / 按揭計算器追蹤", null],
      ["step",  "[1/5] 張良雷達預測簽約意願曲線", 31],
      ["step",  "[2/5] 偵測「擁有想像」信號 (IG 收藏 +210%)", 58],
      ["step",  "[3/5] 排除假信號: 看樓量多 ≠ 興趣高", 71],
      ["cause", "✓ 個人模型: 按揭計算器訪問 3 次 = 強信號", 82],
      ["cause", "✓ 預測峰值: T+5 週四 18:00 (91% 簽約)", 87],
      ["alert", "⚠ 千萬不要 24h 內推銷 (客戶 block 率 68%)", 87],
      ["step",  "[5/5] 生成精準 follow-up sequence", 87],
    ],
    chat: [
      {kind:"alert", html:`<span class="tag">🏠 帶看轉化雷達</span>
        <strong>David,</strong> 你的客 <strong>Mr. Wong</strong> 看完上週六的樓盤後, 表面平淡, 但......
        <br/><br/>
        張良引擎偵測到三個強信號:<br/>
        ① IG 收藏「裝修風格」內容 +210% (進入擁有想像)<br/>
        ② 上週訪問按揭計算器 <strong>3 次</strong> (強烈意向)<br/>
        ③ 但已看 7 套樓 → 已過比較期, 不是觀望型<br/>
        <br/>
        <strong>絕對不要明天聯絡!</strong> 通用 24h follow-up 公式對他無效, 反而會把他推走。`},
      {kind:"bot", html:`🎯 <strong>個人化 5 日 sequence</strong><br/>
        張良雷達預測簽約峰值在 <strong>T+5 週四 18:00</strong> (預測簽約率 91%)<br/>
        <br/>
        ① <strong>T+0~T+3</strong>: 不打擾, 只發 1 條「同區成交價走勢圖」<br/>
        ② <strong>T+4</strong>: 分享一個「裝修案例」(對應他 IG 偏好)<br/>
        ③ <strong>T+5 週四 18:00</strong>: 約看樓書 + 即場限期優惠<br/>
        <br/>
        我已為你準備好 5 條素材 (含 Mr. Wong 收藏過的裝修風格)。`,
        actions: [
          {label:"⚡ 一鍵排程 5 日 sequence", primary:true, exec:"已排程 3 個觸點 (T+0/T+4/T+5)"},
          {label:"📊 看完整 DAG 推理", view:"dag"}
        ]}
    ]
  },

  // ============================================================
  //  🆕 餐廳 · 下午茶空台優化
  // ============================================================
  restaurant: {
    name: "餐廳 · 下午茶空台優化",
    persona: "Ivy (港式茶餐廳老闆)",
    confidence: 84,
    counterfactuals: [
      "下午茶就是冷時段 (對照組: 同區 3 家做動態定價的店翻台率 +47%)",
      "全面降價 (淨利率反而下降 -12%)",
      "盲目投廣告 (CAC 是利潤 2.3 倍)",
    ],
    forecast: {
      history: [85, 88, 90, 32, 28, 25, 30, 65, 80, 88, 92, 90],
      forecast: [33, 30, 28, 26, 24, 25, 28],
      turnIndex: 3, yLabel: "翻台率 %"
    },
    dag: {
      nodes: [
        {id:"A", x:80,  y:60,  icon:"⏰", label:"15:00-17:00 空檔", type:"cause"},
        {id:"B", x:80,  y:160, icon:"📍", label:"FB 同區附近 OL 群", type:"evidence"},
        {id:"C", x:80,  y:260, icon:"☕", label:"IG 下午茶 hashtag", type:"evidence"},
        {id:"D", x:230, y:110, icon:"💡", label:"未開發 OL 客群", type:"effect"},
        {id:"E", x:230, y:210, icon:"💸", label:"動態定價空間", type:"effect"},
        {id:"F", x:360, y:160, icon:"🚀", label:"翻台率 +47%", type:"alert"},
      ],
      edges: [
        ["A","D",0.55],["B","D",0.78],["C","E",0.71],
        ["D","F",0.62],["E","F",0.79]
      ]
    },
    trace: [
      ["data",  "→ 接入 POS 翻台 / IG hashtag / FB 附近用戶定位", null],
      ["step",  "[1/5] 張良雷達偵測下午茶空檔翻台 -68%", 27],
      ["step",  "[2/5] 排除「下午茶就是冷」(對照組 +47%)", 52],
      ["step",  "[3/5] 私域偵測: 你 PT 1.5km 有 4,300 OL", 68],
      ["cause", "✓ 機會: OL 在 IG 看「下午茶 cafe」+180%", 78],
      ["cause", "✓ 動態定價: 15-17 點蛋撻 8 折 + WiFi 升級", 83],
      ["alert", "⚠ 全面降價反而虧損, 必須精準分時", 84],
      ["step",  "[5/5] 生成 IG Story + Geo-targeted 廣告", 84],
    ],
    chat: [
      {kind:"alert", html:`<span class="tag">⏰ 空台優化</span>
        <strong>Ivy 老闆,</strong> 你下午茶時段 (15:00-17:00) 翻台率只有 <strong>28%</strong>, 浪費了 <strong>HK$3,200/天</strong> 機會成本。
        <br/><br/>
        但<strong>不要全面降價</strong>! 對照同區 3 家做動態定價的茶餐廳, 翻台率反升 +47% 而<strong>淨利沒下降</strong>。
        <br/><br/>
        張良引擎發現: 你 1.5km 內有 <strong>4,300 名 OL</strong>, 過去 14 天她們在 IG 搜尋「下午茶 hashtag」+180%。`},
      {kind:"bot", html:`💡 <strong>3 步動態方案</strong><br/>
        ① <strong>分時定價</strong>: 15-17 點蛋撻買一送半 + 免費 WiFi 升速<br/>
        ② <strong>IG Story 投放</strong>: 半徑 1.5km, OL 興趣標籤<br/>
        ③ <strong>Loyalty 鎖定</strong>: 來訪 OL 自動加 WhatsApp 提醒下週優惠<br/>
        <br/>
        預估 21 天翻台率 <strong>28% → 75%</strong>, 月增收 HK$28,000`,
        actions: [
          {label:"⚡ 一鍵啟動分時方案", primary:true, exec:"動態定價已啟動 + IG Story 廣告 (1.5km Geo-fence)"},
          {label:"📊 看翻台率預測", view:"forecast", viewData:{
            title:"張良雷達 · 翻台率預測",
            current:"28%",
            target:"75%",
            timeframe:"T+21 天",
            confidence:"82-92%",
            note:"動態定價 + Geo 廣告生效後曲線"}}
        ]}
    ]
  },
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

  // status: scanning
  setDagStatus("掃描中...", "scanning");

  // 1) Animate engine trace
  for (let i = 0; i < s.trace.length; i++) {
    await sleep(420);
    const [type, text, conf] = s.trace[i];
    const line = document.createElement("div");
    line.className = `trace-line ${type}`;

    if (conf !== null && conf !== undefined) {
      line.innerHTML = `<span class="trace-text">${text}</span><span class="trace-conf">${conf}%</span>`;
      animateConfidenceTo(conf);
    } else {
      line.textContent = text;
    }
    trace.appendChild(line);
    trace.scrollTop = trace.scrollHeight;

    if (type === "cause" || type === "alert") {
      highlightNextDagNode();
    }
  }

  // status: locked
  setDagStatus("🔒 真因已鎖定", "locked");

  // show counterfactual list
  showCounterfactuals(s.counterfactuals || []);

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

// ----- DAG status -----
function setDagStatus(text, cls) {
  const el = $("#dagStatus");
  if (!el) return;
  el.textContent = text;
  el.className = "dag-status " + (cls || "");
}

// ----- Confidence gauge -----
function animateConfidenceTo(percent) {
  const arc = $("#confArc");
  const val = $("#confValue");
  if (!arc || !val) return;
  const total = 173;
  const offset = total * (1 - percent / 100);
  arc.style.strokeDashoffset = offset;
  // animate number
  const start = parseInt(val.textContent) || 0;
  const t0 = performance.now();
  const dur = 800;
  function tick(t) {
    const k = Math.min(1, (t - t0) / dur);
    const v = Math.round(start + (percent - start) * easeOut(k));
    val.textContent = v + "%";
    if (k < 1) requestAnimationFrame(tick);
  }
  requestAnimationFrame(tick);
}
const easeOut = (t) => 1 - Math.pow(1 - t, 3);

// ----- Counterfactual list -----
function showCounterfactuals(items) {
  const block = $("#counterfactual");
  const list = $("#cfList");
  if (!block || !list) return;
  if (!items.length) { block.classList.remove("show"); return; }
  list.innerHTML = "";
  items.forEach(text => {
    const li = document.createElement("li");
    li.textContent = text;
    list.appendChild(li);
  });
  block.classList.add("show");
}

// ----- Chat bubbles -----
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
  const userBubble = document.createElement("div");
  userBubble.className = "bubble user";
  userBubble.innerHTML = a.label + `<div class="meta">${nowTime()}  ✓✓</div>`;
  chat.appendChild(userBubble);
  chat.scrollTop = chat.scrollHeight;

  // ---- 微調話術: open tone editor ----
  if (a.tweak) {
    return openTweakEditor(a.tweak);
  }

  // ---- 查看詳細視圖: DAG / ROI / forecast / explain ----
  if (a.view) {
    return openViewBubble(a);
  }

  if (a.exec) {
    addExecLog(a.exec);
    setTimeout(() => {
      const ack = document.createElement("div");
      ack.className = "bubble bot";
      ack.innerHTML = `✅ <strong>已執行</strong><br/>${a.exec}<br/><br/>📡 已透過 Meta API / WhatsApp Business API 跨平台閉環。<div class="meta">${nowTime()}  ✓✓</div>`;
      chat.appendChild(ack);
      chat.scrollTop = chat.scrollHeight;
    }, 600);
  }
}

// ============================================================
//  查看詳細視圖 · DAG / ROI / Forecast / Explain
// ============================================================
function openViewBubble(a) {
  const typing = addTyping();
  setTimeout(() => {
    typing.remove();
    const bubble = document.createElement("div");
    bubble.className = "bubble bot";
    let html = "";

    // ---- DAG view: scroll right console + show node breakdown + replay animation ----
    if (a.view === "dag") {
      const dag = SCENARIOS[currentScenario].dag;
      const dagBlock = document.querySelector(".dag-block");
      const consoleEl = document.querySelector(".console");

      // smooth scroll the dag block into view (pull right console upward)
      if (dagBlock && consoleEl) {
        consoleEl.scrollTo({ top: dagBlock.offsetTop - 16, behavior: "smooth" });
        // pulse highlight
        dagBlock.classList.add("dag-spotlight");
        setTimeout(() => dagBlock.classList.remove("dag-spotlight"), 2400);
      }

      // re-trigger DAG animation: re-activate all nodes/edges sequentially
      document.querySelectorAll(".dag-sexy .node-circle").forEach(n => n.classList.remove("active"));
      document.querySelectorAll(".dag-sexy .edge").forEach(e => e.classList.remove("active"));
      document.querySelectorAll(".dag-sexy .edge-flow").forEach(e => e.classList.remove("flowing"));
      document.querySelectorAll(".dag-sexy .edge-weight").forEach(w => w.classList.remove("active"));
      dagHighlightIdx = 0;
      // light up all nodes one by one
      let i = 0;
      const reHighlight = setInterval(() => {
        if (i >= dag.nodes.length) { clearInterval(reHighlight); return; }
        highlightNextDagNode();
        i++;
      }, 220);

      const breakdown = dag.nodes.map(n => {
        const typeName = ({cause:"原因因子", evidence:"證據節點", effect:"影響路徑", alert:"告警節點"})[n.type] || n.type;
        return `<li><span class="bk-icon">${n.icon}</span><strong>${n.label}</strong><span class="bk-type">${typeName}</span></li>`;
      }).join("");
      const edgeList = dag.edges.map(([f, t, w]) => `<code>${f}→${t}</code> <span class="ew">${w.toFixed(2)}</span>`).join(" · ");

      html = `🔬 <strong>後廠 DAG 詳細推理</strong><br/>
        已將右側因果圖譜<strong>捲動到視野中</strong>並重新播放動畫:<br/>
        <ul class="dag-breakdown">${breakdown}</ul>
        <div class="bk-edges"><strong>邊權重:</strong> ${edgeList}</div>
        <em class="bk-hint">💡 每條邊上的數字 = 因果強度 (0-1) · 橙色流動線 = 即時能量傳導</em>`;
    }

    // ---- ROI bar chart view ----
    else if (a.view === "roi") {
      const d = a.viewData;
      const maxAbs = Math.max(...d.options.map(o => Math.abs(o.roi))) || 100;
      const bars = d.options.map(o => {
        const w = (Math.abs(o.roi) / maxAbs) * 100;
        const sign = o.roi >= 0 ? "+" : "";
        return `<div class="roi-row">
          <div class="roi-name">${o.name}</div>
          <div class="roi-track">
            <div class="roi-bar" style="width:${w}%; background:${o.color}">
              <span class="roi-num">${sign}${o.roi}% ROI</span>
            </div>
          </div>
          <div class="roi-note">${o.note}</div>
        </div>`;
      }).join("");
      html = `📊 <strong>${d.title}</strong>
        <div class="roi-chart">${bars}</div>
        <div class="roi-recommend">🎯 <strong>建議:</strong> ${d.recommend}</div>`;
    }

    // ---- Forecast mini chart view ----
    else if (a.view === "forecast") {
      const d = a.viewData;
      html = `📡 <strong>${d.title}</strong>
        <div class="fc-mini">
          <div class="fc-row">
            <div class="fc-label">當前</div>
            <div class="fc-value fc-current">${d.current}</div>
          </div>
          <div class="fc-arrow">→</div>
          <div class="fc-row">
            <div class="fc-label">${d.timeframe}</div>
            <div class="fc-value fc-target">${d.target}</div>
          </div>
        </div>
        <div class="fc-confidence">📊 信賴區間: <strong>${d.confidence}</strong></div>
        <em>${d.note}</em>`;
    }

    // ---- Explain view: bullet points with reasoning ----
    else if (a.view === "explain") {
      const d = a.viewData;
      const items = d.points.map(p =>
        `<li><span class="ex-icon">${p.icon}</span><strong>${p.label}:</strong> ${p.value}</li>`
      ).join("");
      html = `💡 <strong>${d.title}</strong>
        <ul class="explain-list">${items}</ul>`;
    }

    bubble.innerHTML = html + `<div class="meta">${nowTime()}  ✓✓</div>`;
    chat.appendChild(bubble);
    chat.scrollTop = chat.scrollHeight;
  }, 700);
}

// ============================================================
//  微調話術 · 3 種語氣版本 編輯器
// ============================================================
const TWEAK_PRESETS = {
  insurance: {
    intro: "🎨 已用 Claude 為你生成 <strong>3 種語氣版本</strong>, 請選擇:",
    options: [
      {tone:"💼 專業正式", text:"陳先生您好,根據近期加息週期, 高息保證利率產品配置正進入最佳區間。本週四下午方便電聯 15 分鐘討論您現有保單的優化方案嗎?"},
      {tone:"😊 親切閒談", text:"陳Sir, 最近加息消息好多, 週末出來飲茶傾下? 順便睇下你嗰份保單可以點優化, 唔阻你太多時間 ☕"},
      {tone:"🔥 緊迫稀缺", text:"陳生, 加息環境下, 高保證利率儲蓄方案配額本月只剩 2 個。今晚 9pm 5 分鐘通話可以幫你 lock-in, 過咗就 reset 到下個月。"},
    ]
  },
  default: {
    intro: "🎨 已生成 3 種語氣版本:",
    options: [
      {tone:"💼 專業正式", text:"(專業版本草稿)"},
      {tone:"😊 親切閒談", text:"(親切版本草稿)"},
      {tone:"🔥 緊迫稀缺", text:"(緊迫版本草稿)"},
    ]
  }
};

function openTweakEditor(presetKey) {
  const preset = TWEAK_PRESETS[presetKey] || TWEAK_PRESETS.default;
  const typing = addTyping();
  setTimeout(() => {
    typing.remove();
    const bubble = document.createElement("div");
    bubble.className = "bubble bot";
    let html = `${preset.intro}<div class="tweak-options">`;
    preset.options.forEach((opt, i) => {
      html += `<button class="tweak-opt" data-idx="${i}">
        <div class="t-tone">${opt.tone}</div>
        <div class="t-preview">${opt.text}</div>
      </button>`;
    });
    html += `</div><div class="meta">${nowTime()}  ✓✓</div>`;
    bubble.innerHTML = html;
    chat.appendChild(bubble);
    chat.scrollTop = chat.scrollHeight;

    bubble.querySelectorAll(".tweak-opt").forEach(btn => {
      btn.addEventListener("click", () => {
        const idx = parseInt(btn.dataset.idx);
        const chosen = preset.options[idx];

        // user picks
        const userPick = document.createElement("div");
        userPick.className = "bubble user";
        userPick.innerHTML = `已選: ${chosen.tone}<div class="meta">${nowTime()}  ✓✓</div>`;
        chat.appendChild(userPick);

        // bot confirms with full text + send button
        const typing2 = addTyping();
        setTimeout(() => {
          typing2.remove();
          const final = document.createElement("div");
          final.className = "bubble bot";
          final.innerHTML = `<strong>${chosen.tone}版話術預覽:</strong><br/><br/>
            <div class="tweak-final">「${chosen.text}」</div>
            <div class="actions-row">
              <button class="a-btn primary tweak-send">⚡ 發送此版本</button>
              <button class="a-btn tweak-redo">↺ 重新調整</button>
            </div>
            <div class="meta">${nowTime()}  ✓✓</div>`;
          chat.appendChild(final);
          chat.scrollTop = chat.scrollHeight;

          final.querySelector(".tweak-send").addEventListener("click", () => {
            const sent = document.createElement("div");
            sent.className = "bubble user";
            sent.innerHTML = `⚡ 發送此版本<div class="meta">${nowTime()}  ✓✓</div>`;
            chat.appendChild(sent);
            addExecLog(`已發送「${chosen.tone}」話術 → 陳Sir (WhatsApp)`);
            setTimeout(() => {
              const ack = document.createElement("div");
              ack.className = "bubble bot";
              ack.innerHTML = `✅ <strong>已發送</strong><br/>「${chosen.tone}」版本已透過 WhatsApp Business API 送達陳Sir。<br/><br/>📡 我會持續追蹤回覆狀態, 並在最佳時點提醒你 follow-up。<div class="meta">${nowTime()}  ✓✓</div>`;
              chat.appendChild(ack);
              chat.scrollTop = chat.scrollHeight;
            }, 600);
          });
          final.querySelector(".tweak-redo").addEventListener("click", () => {
            openTweakEditor(presetKey);
          });
        }, 700);
      });
    });
  }, 700);
}

function addExecLog(text) {
  const muted = execLog.querySelector(".muted");
  if (muted) muted.remove();
  const item = document.createElement("div");
  item.className = "log-item exec";
  const ts = new Date().toLocaleTimeString("zh-HK", {hour12: false});
  item.textContent = `[${ts}] ${text}`;
  execLog.prepend(item);
  const sig = $("#kpiSignals");
  sig.textContent = parseInt(sig.textContent) + 1;
}

// ----- Reset -----
function resetAll() {
  chat.innerHTML = "";
  trace.innerHTML = `<div class="trace-empty">撳「啟動主動提示」開始推理...</div>`;
  setDagStatus("等候中", "");
  // reset confidence gauge
  const arc = $("#confArc"); const val = $("#confValue");
  if (arc) arc.style.strokeDashoffset = 173;
  if (val) val.textContent = "0%";
  // reset counterfactual
  $("#counterfactual")?.classList.remove("show");

  // welcome bubble
  const welcome = document.createElement("div");
  welcome.className = "bubble bot";
  welcome.innerHTML = `👋 你好, 我係 <strong>東風 · 張良軍師</strong>。<br/>我幫你 24/7 監察緊客路同市場數據。<br/><br/>而家睇緊: <strong>${SCENARIOS[currentScenario].name}</strong><div class="meta">${nowTime()}</div>`;
  chat.appendChild(welcome);

  // reset DAG highlight
  document.querySelectorAll(".dag-sexy .node-circle").forEach(n => n.classList.remove("active"));
  document.querySelectorAll(".dag-sexy .edge").forEach(e => e.classList.remove("active"));
  document.querySelectorAll(".dag-sexy .edge-flow").forEach(e => e.classList.remove("flowing"));
  document.querySelectorAll(".dag-sexy .edge-weight").forEach(w => w.classList.remove("active"));
  dagHighlightIdx = 0;
}

// ============================================================
//  張良預測雷達 · ANIMATED forecast chart
//   - L→R 漸進繪製歷史線
//   - 預測虛線 marching-ants 流動
//   - 連續垂直 sweep scan line
//   - 轉折點 radar-ping 雙環脈動
//   - "now" 點 glow + breathe
// ============================================================
let _radarRAF = null;
let _radarT0 = 0;
let _radarFc = null;

function drawForecast(fc) {
  if (_radarRAF) cancelAnimationFrame(_radarRAF);
  _radarFc = fc;
  _radarT0 = performance.now();
  _radarTick();
}

function _radarTick() {
  const cv = $("#forecastChart");
  if (!cv || !_radarFc) return;
  const ctx = cv.getContext("2d");
  const dpr = window.devicePixelRatio || 1;
  const W = cv.clientWidth, H = cv.clientHeight;
  if (cv.width !== W * dpr) { cv.width = W * dpr; cv.height = H * dpr; }
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  ctx.clearRect(0, 0, W, H);

  const fc = _radarFc;
  const all = [...fc.history, ...fc.forecast];
  const max = Math.max(...all) * 1.1;
  const min = Math.min(...all) * 0.9;
  const padL = 30, padR = 10, padT = 22, padB = 26;
  const innerW = W - padL - padR;
  const innerH = H - padT - padB;
  const stepX = innerW / (all.length - 1);
  const yAt = v => padT + innerH - ((v - min) / (max - min)) * innerH;
  const xAt = i => padL + i * stepX;

  const t = (performance.now() - _radarT0) / 1000;
  const revealDur = 1.4;
  const reveal = Math.min(1, t / revealDur);
  const easeR = 1 - Math.pow(1 - reveal, 3);
  const fcReveal = Math.max(0, Math.min(1, (t - revealDur) / 0.9));

  // moving sweep band
  const sweepX = padL + ((t * 90) % (innerW + 60)) - 30;
  const grad = ctx.createLinearGradient(sweepX - 60, 0, sweepX + 60, 0);
  grad.addColorStop(0,   "rgba(78,161,255,0)");
  grad.addColorStop(0.5, "rgba(78,161,255,0.10)");
  grad.addColorStop(1,   "rgba(78,161,255,0)");
  ctx.fillStyle = grad;
  ctx.fillRect(padL, padT, innerW, innerH);

  // grid
  ctx.strokeStyle = "rgba(255,255,255,0.045)";
  ctx.lineWidth = 1;
  for (let i = 0; i <= 4; i++) {
    const y = padT + (innerH / 4) * i;
    ctx.beginPath(); ctx.moveTo(padL, y); ctx.lineTo(W - padR, y); ctx.stroke();
  }

  // history line (progressive reveal)
  const histPts = fc.history.map((v, i) => [xAt(i), yAt(v)]);
  const revealPts = Math.max(2, Math.floor(histPts.length * easeR));
  ctx.strokeStyle = "#4ea1ff";
  ctx.lineWidth = 2;
  ctx.shadowColor = "rgba(78,161,255,0.5)";
  ctx.shadowBlur = 6;
  ctx.beginPath();
  for (let i = 0; i < revealPts; i++) {
    const [x, y] = histPts[i];
    if (i === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
  }
  ctx.stroke();
  ctx.shadowBlur = 0;

  // history dots
  ctx.fillStyle = "rgba(78,161,255,0.7)";
  for (let i = 0; i < revealPts; i++) {
    const [x, y] = histPts[i];
    ctx.beginPath(); ctx.arc(x, y, 1.6, 0, Math.PI*2); ctx.fill();
  }

  if (reveal >= 1) {
    const fStart = fc.history.length - 1;
    const breathe = 1 + Math.sin(t * 2) * 0.04;
    const bandAlpha = 0.10 + Math.sin(t * 2) * 0.04;
    const fcVisible = Math.max(2, Math.floor(fc.forecast.length * fcReveal) + 1);

    // forecast uncertainty band (breathing)
    ctx.fillStyle = `rgba(255,122,46,${bandAlpha})`;
    ctx.beginPath();
    ctx.moveTo(xAt(fStart), yAt(fc.history[fc.history.length - 1]));
    for (let i = 0; i < fcVisible; i++) {
      ctx.lineTo(xAt(fStart + 1 + i), yAt(fc.forecast[i] * 1.12 * breathe));
    }
    for (let i = fcVisible - 1; i >= 0; i--) {
      ctx.lineTo(xAt(fStart + 1 + i), yAt(fc.forecast[i] * (0.88 / breathe)));
    }
    ctx.closePath();
    ctx.fill();

    // forecast line — marching ants
    ctx.strokeStyle = "#ff7a2e";
    ctx.lineWidth = 2.2;
    ctx.shadowColor = "rgba(255,122,46,0.6)";
    ctx.shadowBlur = 8;
    ctx.setLineDash([6, 4]);
    ctx.lineDashOffset = -t * 32;
    ctx.beginPath();
    ctx.moveTo(xAt(fStart), yAt(fc.history[fc.history.length - 1]));
    for (let i = 0; i < fcVisible; i++) {
      ctx.lineTo(xAt(fStart + 1 + i), yAt(fc.forecast[i]));
    }
    ctx.stroke();
    ctx.setLineDash([]);
    ctx.shadowBlur = 0;

    // "now" vertical guide + pulsing dot
    const nx = xAt(fStart);
    const ny = yAt(fc.history[fStart]);
    ctx.strokeStyle = "rgba(78,161,255,0.25)";
    ctx.setLineDash([2, 3]);
    ctx.beginPath();
    ctx.moveTo(nx, padT); ctx.lineTo(nx, padT + innerH);
    ctx.stroke();
    ctx.setLineDash([]);

    const pulseR = 4 + Math.sin(t * 4) * 1.5;
    ctx.fillStyle = "#4ea1ff";
    ctx.shadowColor = "#4ea1ff"; ctx.shadowBlur = 8 + Math.sin(t * 4) * 4;
    ctx.beginPath(); ctx.arc(nx, ny, pulseR, 0, Math.PI*2); ctx.fill();
    ctx.shadowBlur = 0;

    // turn point — radar ping
    if (fc.turnIndex !== undefined && fc.turnIndex < all.length) {
      const tx = xAt(fc.turnIndex), ty = yAt(all[fc.turnIndex]);
      for (let k = 0; k < 2; k++) {
        const phase = ((t + k * 0.6) % 1.2) / 1.2;
        const ringR = 8 + phase * 22;
        const ringAlpha = (1 - phase) * 0.6;
        ctx.strokeStyle = `rgba(255,90,95,${ringAlpha})`;
        ctx.lineWidth = 2;
        ctx.beginPath(); ctx.arc(tx, ty, ringR, 0, Math.PI*2); ctx.stroke();
      }
      ctx.fillStyle = "#ff5a5f";
      ctx.shadowColor = "#ff5a5f"; ctx.shadowBlur = 10;
      ctx.beginPath(); ctx.arc(tx, ty, 5, 0, Math.PI*2); ctx.fill();
      ctx.shadowBlur = 0;

      ctx.fillStyle = "#ff8a8e";
      ctx.font = "bold 10px -apple-system, monospace";
      ctx.fillText("⚠ 轉折點", tx - 22, ty - 16);
    }
  }

  // labels
  ctx.fillStyle = "#8aa0c4";
  ctx.font = "10px sans-serif";
  ctx.fillText(fc.yLabel, padL, 13);
  if (reveal >= 1) {
    const fStart = fc.history.length - 1;
    ctx.fillText("now", xAt(fStart) - 8, H - 8);
  }

  // sweep scan line
  ctx.strokeStyle = "rgba(78,161,255,0.55)";
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.moveTo(sweepX, padT); ctx.lineTo(sweepX, padT + innerH);
  ctx.stroke();

  _radarRAF = requestAnimationFrame(_radarTick);
}

// ============================================================
//  SEXY DAG drawing
// ============================================================
function drawDAG(dag) {
  const svg = $("#dagSvg");
  const NS = "http://www.w3.org/2000/svg";

  // clear
  svg.innerHTML = `
    <defs>
      <marker id="arrowMuted" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto">
        <path d="M0,0 L10,5 L0,10 z" fill="rgba(138,160,196,0.5)" />
      </marker>
      <marker id="arrowAccent" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto">
        <path d="M0,0 L10,5 L0,10 z" fill="#ff7a2e" />
      </marker>
      <radialGradient id="bgGlow" cx="50%" cy="50%">
        <stop offset="0%" stop-color="rgba(78,161,255,0.06)"/>
        <stop offset="100%" stop-color="transparent"/>
      </radialGradient>
    </defs>
    <rect x="0" y="0" width="420" height="320" fill="url(#bgGlow)"/>
  `;

  // ----- edges -----
  dag.edges.forEach(([from, to, weight]) => {
    const a = dag.nodes.find(n => n.id === from);
    const b = dag.nodes.find(n => n.id === to);
    const cx = (a.x + b.x) / 2;
    const cy = (a.y + b.y) / 2;
    // curve to avoid straight overlap
    const dx = b.x - a.x, dy = b.y - a.y;
    const dist = Math.hypot(dx, dy);
    const offset = Math.min(20, dist * 0.1);
    const mx = cx + (-dy / dist) * offset;
    const my = cy + (dx / dist) * offset;

    // base edge (muted)
    const path = document.createElementNS(NS, "path");
    const r = 26; // node radius
    const ax = a.x + (dx / dist) * r;
    const ay = a.y + (dy / dist) * r;
    const bx = b.x - (dx / dist) * r;
    const by = b.y - (dy / dist) * r;
    const d = `M${ax},${ay} Q${mx},${my} ${bx},${by}`;
    path.setAttribute("d", d);
    path.setAttribute("class", "edge");
    path.dataset.from = from; path.dataset.to = to;
    svg.appendChild(path);

    // flow particle (animated overlay)
    const flow = document.createElementNS(NS, "path");
    flow.setAttribute("d", d);
    flow.setAttribute("class", "edge-flow");
    flow.dataset.from = from; flow.dataset.to = to;
    svg.appendChild(flow);

    // weight label
    const w = document.createElementNS(NS, "text");
    w.setAttribute("x", mx);
    w.setAttribute("y", my - 4);
    w.setAttribute("class", "edge-weight");
    w.textContent = weight.toFixed(2);
    w.dataset.from = from; w.dataset.to = to;
    svg.appendChild(w);
  });

  // ----- nodes -----
  dag.nodes.forEach(n => {
    const g = document.createElementNS(NS, "g");
    g.setAttribute("transform", `translate(${n.x}, ${n.y})`);

    // outer halo (always visible faint)
    const halo = document.createElementNS(NS, "circle");
    halo.setAttribute("r", 32);
    halo.setAttribute("fill", "transparent");
    halo.setAttribute("stroke", "rgba(255,255,255,0.04)");
    halo.setAttribute("stroke-width", 1);
    g.appendChild(halo);

    // main circle
    const c = document.createElementNS(NS, "circle");
    c.setAttribute("r", 24);
    c.setAttribute("class", `node-circle ${n.type}`);
    c.dataset.id = n.id;
    g.appendChild(c);

    // icon
    const icon = document.createElementNS(NS, "text");
    icon.setAttribute("class", "node-icon");
    icon.setAttribute("y", 1);
    icon.textContent = n.icon || "•";
    g.appendChild(icon);

    // label background pill (below circle)
    const labelText = n.label;
    const labelY = 42;
    const padX = 6;
    // approximate width (chinese chars ~9px wide)
    const approxW = labelText.length * 7 + padX * 2;
    const bg = document.createElementNS(NS, "rect");
    bg.setAttribute("x", -approxW / 2);
    bg.setAttribute("y", labelY - 9);
    bg.setAttribute("width", approxW);
    bg.setAttribute("height", 14);
    bg.setAttribute("rx", 4);
    bg.setAttribute("class", "node-label-bg");
    g.appendChild(bg);

    const label = document.createElementNS(NS, "text");
    label.setAttribute("class", "node-label");
    label.setAttribute("y", labelY + 1);
    label.textContent = labelText;
    g.appendChild(label);

    svg.appendChild(g);
  });
}

let dagHighlightIdx = 0;
function highlightNextDagNode() {
  const dag = SCENARIOS[currentScenario].dag;
  if (dagHighlightIdx >= dag.nodes.length) return;
  const node = dag.nodes[dagHighlightIdx];
  const c = document.querySelector(`.dag-sexy circle[data-id="${node.id}"]`);
  if (c) c.classList.add("active");

  // light up edges leaving this node + start flow
  document.querySelectorAll(`.dag-sexy .edge[data-from="${node.id}"]`).forEach(e => e.classList.add("active"));
  document.querySelectorAll(`.dag-sexy .edge-flow[data-from="${node.id}"]`).forEach(e => e.classList.add("flowing"));
  document.querySelectorAll(`.dag-sexy .edge-weight[data-from="${node.id}"]`).forEach(w => w.classList.add("active"));
  dagHighlightIdx++;
}

// ----- Utils -----
const sleep = (ms) => new Promise(r => setTimeout(r, ms));
const nowTime = () => new Date().toLocaleTimeString("zh-HK", {hour: "2-digit", minute: "2-digit", hour12: false});

// ----- Init -----
resetAll();
drawForecast(SCENARIOS.insurance.forecast);
drawDAG(SCENARIOS.insurance.dag);
