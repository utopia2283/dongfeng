"""
TimesFM 高維動態時序感知 Wrapper
==================================
Google TimesFM (https://github.com/google-research/timesfm) 是 200M~500M
參數的 Foundation Model for Time Series, 對未見過的序列即可 zero-shot 預測.

我們用它做兩件事:
  1) 對單變量私域指標 (訂單/活躍度/CPM) 做 zero-shot 多步預測
  2) 與 ZhangLiang DAG 結合, 找出「轉折點」(turning point)

Production 安裝:
    pip install timesfm[torch]
    # 首次調用會自動下載 weights 約 1GB

如果環境沒有 timesfm 或 GPU, 自動退回 _heuristic_fallback (用於 demo).
"""
from __future__ import annotations
from dataclasses import dataclass
from typing import List, Optional, Dict, Any
import logging, math

log = logging.getLogger("dongfeng.timesfm")

@dataclass
class ForecastResult:
    point: List[float]          # 點預測
    lower: List[float]          # 10% quantile
    upper: List[float]          # 90% quantile
    turn_index: Optional[int]   # 偵測到的轉折點 index (None = 無)
    turn_type: Optional[str]    # "up" / "down" / "inflection"
    confidence: float           # 0.0 ~ 1.0


class TimesFMForecaster:
    """
    Wrapper for Google TimesFM. Lazy loading — 第一次 predict() 才載入 weights.
    """
    def __init__(self, model_repo: str = "google/timesfm-2.0-500m-pytorch"):
        self.model_repo = model_repo
        self._model = None        # 真實 timesfm 實例
        self._available = None    # None = 未測試, True/False = 可用性

    def _try_load(self):
        if self._available is not None:
            return
        try:
            import timesfm
            self._model = timesfm.TimesFm(
                hparams=timesfm.TimesFmHparams(
                    backend="cpu",            # demo: cpu; prod: "gpu"
                    per_core_batch_size=32,
                    horizon_len=128,
                    context_len=512,
                ),
                checkpoint=timesfm.TimesFmCheckpoint(huggingface_repo_id=self.model_repo),
            )
            self._available = True
            log.info(f"✓ TimesFM loaded: {self.model_repo}")
        except Exception as e:
            log.warning(f"TimesFM unavailable ({e}). Using heuristic fallback.")
            self._available = False

    # ---------- 主入口 ----------
    def predict(
        self,
        history: List[float],
        horizon: int = 14,
        freq: int = 0,        # 0=high freq (daily), 1=mid (weekly), 2=low (monthly)
    ) -> ForecastResult:
        self._try_load()
        if self._available:
            return self._predict_real(history, horizon, freq)
        return self._heuristic_fallback(history, horizon)

    def _predict_real(self, history, horizon, freq) -> ForecastResult:
        import numpy as np
        forecasts, quantile = self._model.forecast(
            inputs=[history],
            freq=[freq],
        )
        point = forecasts[0][:horizon].tolist()
        # quantiles: [batch, horizon, num_quantiles]; idx 1=10%, 9=90%
        lower = quantile[0][:horizon, 1].tolist()
        upper = quantile[0][:horizon, 9].tolist()
        turn_idx, turn_type, conf = self._detect_turning_point(history, point)
        return ForecastResult(point, lower, upper, turn_idx, turn_type, conf)

    def _heuristic_fallback(self, history, horizon) -> ForecastResult:
        """簡單外推 — 真實環境會被 timesfm 取代."""
        if len(history) < 4:
            avg = sum(history) / max(len(history), 1)
            return ForecastResult([avg]*horizon, [avg*0.9]*horizon, [avg*1.1]*horizon, None, None, 0.3)
        recent_slope = (history[-1] - history[-4]) / 3
        last = history[-1]
        point = [last + recent_slope * (i+1) * 0.85 for i in range(horizon)]    # 衰減
        lower = [p * 0.85 for p in point]
        upper = [p * 1.15 for p in point]
        turn_idx, turn_type, conf = self._detect_turning_point(history, point)
        return ForecastResult(point, lower, upper, turn_idx, turn_type, conf)

    # ---------- 轉折點偵測 ----------
    def _detect_turning_point(self, history, forecast):
        """
        合併 history+forecast, 用二階差分找拐點.
        返回 (index_in_combined, "up"|"down"|None, confidence)
        """
        series = list(history) + list(forecast)
        if len(series) < 6:
            return None, None, 0.0
        # 二階差分
        d1 = [series[i+1] - series[i] for i in range(len(series)-1)]
        d2 = [d1[i+1] - d1[i] for i in range(len(d1)-1)]
        # 找最大絕對拐點
        max_i = max(range(len(d2)), key=lambda i: abs(d2[i]))
        if abs(d2[max_i]) < 1e-3:
            return None, None, 0.0
        turn_type = "up" if d2[max_i] > 0 else "down"
        # 信心度: 拐點強度 / 系列標準差
        mu = sum(series) / len(series)
        sd = math.sqrt(sum((x-mu)**2 for x in series) / len(series)) or 1.0
        conf = min(abs(d2[max_i]) / sd, 1.0)
        return max_i + 1, turn_type, round(conf, 3)


# ---------- 快速本地測試 ----------
if __name__ == "__main__":
    f = TimesFMForecaster()
    res = f.predict([100, 102, 105, 108, 106, 104, 99, 92, 85, 78], horizon=7)
    print("Forecast:", res.point)
    print("Turn:", res.turn_index, res.turn_type, "conf:", res.confidence)
