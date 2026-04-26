"""
東風 DONG FENG · 主後端服務
============================
FastAPI 入口, 串接四個核心模組:
  · whatsapp_webhook  ← Meta WhatsApp Business Cloud API
  · timesfm_forecaster ← Google TimesFM 高維時序預測引擎
  · zhangliang_engine ← DAG 因果推理引擎 (核心護城河)
  · scenarios        ← 灣區實戰案例庫 (RAG 種子)

Run: uvicorn backend.main:app --reload --port 8000
"""
from fastapi import FastAPI, Request, BackgroundTasks
from fastapi.responses import JSONResponse
from pydantic import BaseModel
from typing import List, Optional
import os, asyncio, logging

from .zhangliang_engine import ZhangLiangEngine
from .timesfm_forecaster import TimesFMForecaster
from .whatsapp_webhook import WhatsAppClient
from .scenarios import SCENARIO_LIBRARY

logging.basicConfig(level=logging.INFO, format="%(asctime)s [%(levelname)s] %(message)s")
log = logging.getLogger("dongfeng")

app = FastAPI(title="東風 DONG FENG · API", version="0.1.0-mvp")

# ---- 全局單例 ----
forecaster = TimesFMForecaster(model_repo="google/timesfm-2.0-500m-pytorch")
engine     = ZhangLiangEngine(forecaster=forecaster, rag_library=SCENARIO_LIBRARY)
wa_client  = WhatsAppClient(
    phone_id=os.getenv("META_PHONE_ID", ""),
    token=os.getenv("META_TOKEN", ""),
)

# ============================================================
#  1. WhatsApp Webhook (Meta Cloud API)
# ============================================================
VERIFY_TOKEN = os.getenv("WA_VERIFY_TOKEN", "dongfeng-verify")

@app.get("/webhook")
async def webhook_verify(request: Request):
    """Meta webhook 握手驗證."""
    params = request.query_params
    if params.get("hub.mode") == "subscribe" and params.get("hub.verify_token") == VERIFY_TOKEN:
        return int(params.get("hub.challenge", 0))
    return JSONResponse({"error": "verify failed"}, status_code=403)

@app.post("/webhook")
async def webhook_receive(request: Request, bg: BackgroundTasks):
    """接收 WhatsApp 訊息 → 進入閉環處理."""
    payload = await request.json()
    bg.add_task(_handle_inbound, payload)
    return {"ok": True}

async def _handle_inbound(payload: dict):
    msg = wa_client.parse_inbound(payload)
    if not msg:
        return
    log.info(f"[WA<-] {msg.from_}: {msg.text}")
    # 用戶在 WhatsApp 點擊 button (一鍵閉環)
    if msg.is_button:
        await engine.execute_action(action_id=msg.button_id, user_id=msg.from_)
        await wa_client.send_text(msg.from_, "✅ 已執行, 跨平台同步完成。")
    else:
        # 自由文字 → 觸發即時諮詢 (探索版功能)
        reply = await engine.consult(msg.text, user_id=msg.from_)
        await wa_client.send_text(msg.from_, reply)


# ============================================================
#  2. 主動雷達: 定時掃描所有用戶, 觸發預警
# ============================================================
class ProactiveScanRequest(BaseModel):
    user_ids: Optional[List[str]] = None

@app.post("/internal/proactive_scan")
async def proactive_scan(req: ProactiveScanRequest):
    """
    後廠定時任務 (每 30 分鐘) 觸發.
    對每個用戶:
      ① 拉取私域數據 (CRM/Meta Ads/POS)
      ② TimesFM 預測未來 14 日
      ③ ZhangLiang 因果推理, 找轉折點
      ④ 若風險/機會 > 閾值 → WhatsApp 主動推送
    """
    user_ids = req.user_ids or await engine.list_active_users()
    triggered = []
    for uid in user_ids:
        signal = await engine.scan_user(uid)
        if signal and signal.priority >= 0.7:
            await wa_client.send_template(
                to=uid,
                template="proactive_alert",
                payload=signal.to_whatsapp_payload(),
            )
            triggered.append({"user": uid, "scenario": signal.scenario_key})
    return {"scanned": len(user_ids), "triggered": triggered}


# ============================================================
#  3. Demo / 測試端點
# ============================================================
@app.get("/demo/scenario/{key}")
async def demo_scenario(key: str):
    """前端 demo 拉取場景數據."""
    if key not in SCENARIO_LIBRARY:
        return JSONResponse({"error": "unknown"}, status_code=404)
    s = SCENARIO_LIBRARY[key]
    forecast = forecaster.predict(history=s["history"], horizon=9)
    causal   = engine.infer_causal_chain(scenario_key=key, forecast=forecast)
    return {
        "scenario": s["name"],
        "forecast": forecast,
        "causal_chain": causal,
        "recommendation": engine.compose_recommendation(causal, scenario_key=key),
    }

@app.get("/")
def root():
    return {
        "service": "東風 DONG FENG · API",
        "tagline": "風起之前，預判先機。",
        "modules": ["WhatsApp Webhook", "TimesFM Forecaster", "ZhangLiang Engine", "RAG Library"],
    }
