# 東風 DONG FENG · MVP

> 「風起之前，預判先機。」 — Sync Buddy Technology

基於 **DAG 因果推理 + 張良雷達 (高維時序引擎)** 的主動式 WhatsApp 智能商業決策引擎。

---

## 🚀 一分鐘啟動 Demo

直接用瀏覽器打開 **`index.html`** —— 無需安裝任何東西。
（建議使用 Chrome / Safari，畫面寬度 ≥ 1200px 體驗最佳）

```
open index.html        # macOS
xdg-open index.html    # Linux
start index.html       # Windows
```

### Demo 操作流程
1. **選擇場景**（左側）：4 個實戰場景，主推 *保險經紀客戶流失預警* 與 *SME 銷量異常診斷*
2. **點擊「⚡ 啟動主動預警」**（手機底部）
3. 觀察三件事同時發生：
   - 🧠 **左側**：張良引擎逐步推理（DAG 因果鏈、排除混淆變量）
   - 📱 **中間**：WhatsApp 收到主動推送 + 一鍵閉環按鈕
   - 🏭 **右側**：後廠 KPI 更新 + 因果圖譜 + 執行日誌
4. **點擊 WhatsApp 內的「⚡ 一鍵執行」按鈕** —— 看跨平台閉環

---

## 📂 文件結構

```
dongfeng/
├── index.html                   ← 🎯 主 Demo（可直接打開）
├── assets/
│   ├── styles.css
│   └── app.js                   ← 前端互動 + DAG 視覺化 + 張良預測雷達
│
├── backend/                     ← 真實後端 (FastAPI)
│   ├── main.py                  ← API 入口 / Webhook
│   ├── timesfm_forecaster.py    ← 張良雷達 (預測層)
│   ├── zhangliang_engine.py     ← 張良引擎（DAG 因果推理核心）
│   ├── whatsapp_webhook.py      ← Meta WhatsApp Cloud API
│   ├── scenarios.py             ← RAG 案例庫種子
│   └── requirements.txt
│
├── DEMO_SCRIPT.md               ← 投資人 demo 演講腳本（5 分鐘版）
└── README.md
```

---

## 🏗️ 架構概覽

```
        WhatsApp 用戶
             │
             ▼
┌──────────────────────────┐
│ 前店 · Zero-UI            │
│  Meta WhatsApp Cloud API │
└────────────┬─────────────┘
             │ webhook
             ▼
┌──────────────────────────────────────────────┐
│            FastAPI · main.py                 │
│  ┌────────────────────────────────────────┐  │
│  │   張良引擎 (ZhangLiang Engine)          │  │
│  │   ─────────────────────────             │  │
│  │   ① DAG 因果推理 (do-calculus)         │  │
│  │   ② 反事實混淆變量排除                  │  │
│  │   ③ RAG 灣區實戰案例佐證                │  │
│  └──────────────┬─────────────────────────┘  │
│                 │ evidence node              │
│  ┌──────────────▼─────────────────────────┐  │
│  │  張良 Forecaster                    │  │
│  │  Google Foundation Model 200M-500M     │  │
│  │  Zero-shot 14d 預測 + 轉折點偵測        │  │
│  └────────────────────────────────────────┘  │
└──────────────────────────────────────────────┘
             │
             ▼
   私域數據（CRM / Meta Ads / POS / WhatsApp History）
```

---

## 🧠 核心技術：張良引擎 vs 通用 AI

| 維度 | ChatGPT / Perplexity | **東風 · 張良引擎** |
|---|---|---|
| 觸發 | 被動「算盤」 | **24/7 主動「雷達」** |
| 推理 | 統計相關（字詞接龍） | **DAG 因果推斷 + 反事實排除** |
| 數據 | 全網通識 | **私域 + 灣區實戰 RAG** |
| 執行 | 給建議就斷裂 | **WhatsApp 一鍵閉環** |
| 時機 | 事後反應 | **提前 2-4 週預判轉折點** |

---

## 🔧 啟動真實後端（可選）

```bash
cd backend
pip install -r requirements.txt

# 設定 Meta API（不設則自動進入 stub mode）
export META_PHONE_ID="your_phone_id"
export META_TOKEN="your_token"
export WA_VERIFY_TOKEN="dongfeng-verify"

uvicorn backend.main:app --reload --port 8000
```

### 主要端點
| 路徑 | 說明 |
|---|---|
| `GET /` | 服務狀態 |
| `GET /webhook` | Meta 握手驗證 |
| `POST /webhook` | 接收 WhatsApp 訊息 |
| `POST /internal/proactive_scan` | 主動雷達掃描（cron 每 30min） |
| `GET /demo/scenario/{key}` | 取得單一場景 demo 數據 |

---

## ⚠️ MVP 限制與下一步

**現階段 (Seed)：**
- ✅ 4 個實戰場景 demo（保險 × 2 + SME × 2）
- ✅ 張良雷達 zero-shot 預測 + 轉折點偵測
- ✅ DAG 因果鏈視覺化 + 混淆變量排除
- ✅ WhatsApp 一鍵閉環 UI/UX
- ⚠️ 因果推理目前以「規則 + RAG 案例」近似；尚未接入 dowhy/causalnex 做 do-calculus
- ⚠️ 張良雷達在 demo 環境若無 GPU/權重 → 自動退回啟發式外推
- ⚠️ Meta API 真實串接需公司 Business Manager 認證

**Seed → Series A 路線圖：**
1. 接入 dowhy + causalnex 做完整 SCM (Structural Causal Model)
2. 張良雷達 fine-tune 灣區私域數據（行業專屬時序模式）
3. 從 4 個場景 → 50+ 場景案例庫，覆蓋 6 大垂直行業
4. 接入 Claude API 處理開放式諮詢，並持續灌入 RAG 學習
5. 後廠 Web 控制台 SaaS 化（多租戶、團隊協作、API 授權）

---

**Sync Buddy Technology · 2026 · 邀請您共同重塑小微商業決策的未來。**
