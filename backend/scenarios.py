"""
灣區實戰案例庫 (RAG seed)
==========================
四個 MVP 場景 + demo 用戶數據. 真實環境會儲存於 vector DB (pgvector / weaviate)
並接入 Claude API 做 retrieval-augmented generation.
"""

SCENARIO_LIBRARY = {

    # ------------------------------------------------------------
    "insurance_churn": {
        "name": "保險經紀 · 客戶流失預警",
        "headline": "⚠ Match, 你的大客陳Sir 流失風險 68% (提前預判 18 天)",
        "root_cause": "A",
        "final_effect": "F",
        "baseline_confidence": 0.91,
        "dag": {
            "nodes": [
                {"id":"A", "label":"銀行加息週期", "kind":"cause"},
                {"id":"B", "label":"陳生IG瀏覽股票內容上升", "kind":"cause"},
                {"id":"C", "label":"WhatsApp 回覆延遲", "kind":"evidence"},
                {"id":"D", "label":"客戶投資意願轉移", "kind":"effect"},
                {"id":"E", "label":"陳生對保單猶豫期延長", "kind":"effect"},
                {"id":"F", "label":"續保流失風險 +68%", "kind":"alert"},
            ],
            "edges": [
                {"src":"A","dst":"D","weight":0.78,"mechanism":"加息週期 → 高淨值客戶資產轉向定存/股票"},
                {"src":"B","dst":"D","weight":0.65,"mechanism":"IG行為信號驗證投資注意力轉移"},
                {"src":"C","dst":"E","weight":0.55,"mechanism":"回覆延遲 = 觀望期延長"},
                {"src":"D","dst":"F","weight":0.72,"mechanism":""},
                {"src":"E","dst":"F","weight":0.41,"mechanism":""},
            ]
        },
        "known_confounders": [
            # 假性: 季節性 — 對照組同樣季節無此 effect
            {"label":"季節性下單習慣", "case_effect":0.05, "control_group_effect":0.04},
        ],
        "narrative":
            "張良引擎雷達剛剛偵測到你的大客陳Sir 出現「客戶轉移」前兆訊號 "
            "(流失風險 68%, 提前預判 18 天)。\n\n"
            "因果鏈: ① 加息週期啟動 → 高淨值客戶投資意願轉向定存/股票  "
            "② 陳Sir 近 14 日 IG 股票相關內容瀏覽 +210%  "
            "③ WhatsApp 回覆延遲從 2h → 13h\n\n"
            "千萬不要直接 Cold Call 逼單!",
        "actions": [
            {"id":"action_warmup_3step", "label":"⚡ 一鍵執行三步保溫方案",
             "detail":"T+0 加息對比表 / T+7 線下小聚 / T+14 follow-up"},
            {"id":"action_tweak", "label":"✏️ 微調話術"},
        ],
        "rag_cases": ["案例#127 (中環中介, ROI +218%)", "案例#091 (尖沙咀, 簽單率 73%)"],
    },

    # ------------------------------------------------------------
    "sme_cafe_dropoff": {
        "name": "SME · 連鎖咖啡店銷量異常",
        "headline": "⚠ Annie, 訂單暴跌 -38% 真因鎖定: FB 演算法改版 (非天氣/非競品)",
        "root_cause": "C",
        "final_effect": "E",
        "baseline_confidence": 0.88,
        "dag": {
            "nodes": [
                {"id":"A","label":"天氣突變 (降溫 8°C)","kind":"cause"},
                {"id":"B","label":"隔壁新開手搖店","kind":"cause"},
                {"id":"C","label":"FB演算法 4/18 改版","kind":"cause"},
                {"id":"D","label":"自然觸達下降 -47%","kind":"effect"},
                {"id":"E","label":"日訂單暴跌 -38%","kind":"alert"},
            ],
            "edges": [
                {"src":"C","dst":"D","weight":0.91,"mechanism":"FB Reels 權重提升,圖文觸達被壓制"},
                {"src":"D","dst":"E","weight":0.84},
            ]
        },
        "known_confounders": [
            {"label":"天氣突變", "case_effect":0.38, "control_group_effect":0.03},  # 對照組同區其他咖啡店僅 -3% → 排除
            {"label":"競品干擾", "case_effect":0.38, "control_group_effect":0.30},  # 對照差小, 排除
        ],
        "narrative":
            "你 7 日訂單跌了 -38%, 但問題不是天氣, 也不是隔壁新店 (我已用對照組排除)。\n"
            "真兇是: FB 在 4/18 演算法改版, 你貼文觸達掉了 47%。\n"
            "跟著打折是純血虧, 因為客戶根本沒看到你。",
        "actions": [
            {"id":"action_reels_fix", "label":"⚡ 一鍵啟動 Reels 修復",
             "detail":"3 條 Reels 文案 + WhatsApp Broadcast 213 人 + Lookalike HK$200"},
            {"id":"action_show_dag", "label":"📊 看詳細因果圖"},
        ],
        "rag_cases": ["案例#214 (旺角咖啡店, 21 天回升 +12%)"],
    },

    # ------------------------------------------------------------
    "insurance_close_timing": {
        "name": "保險經紀 · 完美狙擊逼單時點",
        "headline": "🎯 Match, 陳Sir 簽單最佳窗口: T+21 週四 15:00 (預測簽單意願 85%)",
        "root_cause": "D",
        "final_effect": "E",
        "baseline_confidence": 0.84,
        "dag": {
            "nodes": [
                {"id":"A","label":"近10年加息減息週期","kind":"cause"},
                {"id":"B","label":"陳生樓市新聞停留時間↑","kind":"cause"},
                {"id":"C","label":"同區租金回報率微幅上揚","kind":"cause"},
                {"id":"D","label":"租轉買情緒轉折點","kind":"effect"},
                {"id":"E","label":"T+21 週四下午 簽單峰值","kind":"alert"},
            ],
            "edges": [
                {"src":"A","dst":"D","weight":0.62},
                {"src":"B","dst":"D","weight":0.71},
                {"src":"C","dst":"D","weight":0.45},
                {"src":"D","dst":"E","weight":0.85,"mechanism":"TimesFM 預測情緒峰值在 T+21"},
            ]
        },
        "known_confounders": [],
        "narrative":
            "你的大客陳Sir 目前處於決策疲勞 + 觀望期, 現在逼單成功率 = 0%。\n"
            "TimesFM 預測 T+21 (週四 15:00) 將出現「租轉買」情緒轉折點, 簽單意願將達 85% 峰值。",
        "actions": [
            {"id":"action_21day_seq", "label":"⚡ 一鍵排程 21 日 sequence",
             "detail":"4 個觸點 T+0/T+7/T+14/T+21"},
            {"id":"action_explain", "label":"❓ 為何不能現在推?"},
        ],
        "rag_cases": ["案例#312 (中半山經紀, 簽單率 78%)"],
    },

    # ------------------------------------------------------------
    "sme_beauty_blue_ocean": {
        "name": "SME · 美容院避開紅海競爭",
        "headline": "🌊 Lily, 母女同行 CPM 飆升 +300% — 改打「新手媽媽自我犒賞」藍海",
        "root_cause": "B",
        "final_effect": "E",
        "baseline_confidence": 0.86,
        "dag": {
            "nodes": [
                {"id":"A","label":"母親節 T-21","kind":"cause"},
                {"id":"B","label":"全行同質打母女牌","kind":"cause"},
                {"id":"C","label":"廣告競價 +300%","kind":"effect"},
                {"id":"D","label":"15% VIP 客戶關注產後修復","kind":"evidence"},
                {"id":"E","label":"切藍海: 新手媽媽自我犒賞","kind":"alert"},
            ],
            "edges": [
                {"src":"A","dst":"C","weight":0.4},
                {"src":"B","dst":"C","weight":0.78,"mechanism":"AI 同質化文案推高競價"},
                {"src":"C","dst":"E","weight":0.55,"mechanism":"避開紅海"},
                {"src":"D","dst":"E","weight":0.72,"mechanism":"私域分群定位精準藍海"},
            ]
        },
        "known_confounders": [],
        "narrative":
            "距離母親節還有 21 天, 但「母女同行」廣告競價已飆升 +300%。\n"
            "全港 80% 美容院都用 AI 寫同樣文案 — 跟著打就是純血虧。\n"
            "你 213 名 VIP 中, 15% (32 人) 近期 IG 關注產後修復, 改打『新手媽媽自我犒賞』, "
            "預估 CAC 僅同行 1/5, 客單價 +40%。",
        "actions": [
            {"id":"action_broadcast_32", "label":"⚡ 發送 32 份個性化邀請",
             "detail":"WhatsApp Broadcast 個性化 (含客戶稱呼)"},
            {"id":"action_compare_roi", "label":"📈 對比兩種方案 ROI",
             "detail":"紅海 -32% / 藍海 +218%"},
        ],
        "rag_cases": ["案例#188 (銅鑼灣美容院, 母親節 ROI +218%)"],
    },

    # ------------------------------------------------------------
    #  Demo 用戶, 給 scan_user() 用
    # ------------------------------------------------------------
    "_demo_users": {
        "match_852_98xx": {
            "scenario_hint": "insurance_churn",
            "history": [82,80,78,81,79,76,74,72,70,68,65,63],
        },
        "annie_852_91xx": {
            "scenario_hint": "sme_cafe_dropoff",
            "history": [120,125,130,128,132,129,127,125,110,95,80,72],
        },
    },
}
