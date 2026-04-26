"""
WhatsApp Business Cloud API · Wrapper
======================================
封裝 Meta Graph API. MVP 階段只需:
  · parse_inbound(payload)  解析 webhook 訊息
  · send_text(to, text)     發送文字
  · send_template(to, ...)  發送 interactive button 模板 (一鍵閉環核心)

Production 須額外實作:
  - signature verification (X-Hub-Signature-256)
  - rate limiting & retry
  - media upload / download
"""
from dataclasses import dataclass
from typing import Optional, Dict, Any, List
import httpx, logging

log = logging.getLogger("dongfeng.whatsapp")
GRAPH = "https://graph.facebook.com/v19.0"


@dataclass
class InboundMessage:
    from_: str
    text: Optional[str]
    is_button: bool = False
    button_id: Optional[str] = None
    timestamp: Optional[int] = None


class WhatsAppClient:
    def __init__(self, phone_id: str, token: str):
        self.phone_id = phone_id
        self.token = token

    @property
    def headers(self):
        return {"Authorization": f"Bearer {self.token}", "Content-Type": "application/json"}

    # ---------- 解析入站 ----------
    def parse_inbound(self, payload: dict) -> Optional[InboundMessage]:
        try:
            entry = payload["entry"][0]["changes"][0]["value"]
            msg = entry["messages"][0]
            sender = msg["from"]
            ts = int(msg.get("timestamp", 0))
            if msg.get("type") == "interactive":
                btn = msg["interactive"].get("button_reply") or msg["interactive"].get("list_reply")
                return InboundMessage(from_=sender, text=btn.get("title"), is_button=True,
                                      button_id=btn["id"], timestamp=ts)
            text = msg.get("text", {}).get("body")
            return InboundMessage(from_=sender, text=text, timestamp=ts)
        except Exception as e:
            log.warning(f"parse_inbound failed: {e}")
            return None

    # ---------- 發送 ----------
    async def send_text(self, to: str, text: str):
        if not self.token:
            log.info(f"[WA->{to}][stub] {text}")
            return
        async with httpx.AsyncClient(timeout=10) as cli:
            r = await cli.post(
                f"{GRAPH}/{self.phone_id}/messages",
                headers=self.headers,
                json={
                    "messaging_product": "whatsapp",
                    "to": to,
                    "type": "text",
                    "text": {"body": text},
                },
            )
            r.raise_for_status()

    async def send_template(self, to: str, template: str, payload: Dict[str, Any]):
        """
        發送主動預警 — Interactive Buttons (一鍵閉環).
        payload = {
          "headline": "...",
          "narrative": "...",
          "buttons": ["⚡ 一鍵執行", "✏️ 微調"]
        }
        """
        body_text = f"{payload['headline']}\n\n{payload['narrative']}"
        buttons = [
            {"type": "reply", "reply": {"id": f"act_{i}", "title": b[:20]}}
            for i, b in enumerate(payload["buttons"][:3])
        ]
        msg = {
            "messaging_product": "whatsapp",
            "to": to,
            "type": "interactive",
            "interactive": {
                "type": "button",
                "body": {"text": body_text[:1024]},
                "action": {"buttons": buttons},
            },
        }
        if not self.token:
            log.info(f"[WA->{to}][stub-template] {body_text[:80]}...")
            return
        async with httpx.AsyncClient(timeout=10) as cli:
            r = await cli.post(f"{GRAPH}/{self.phone_id}/messages",
                               headers=self.headers, json=msg)
            r.raise_for_status()
