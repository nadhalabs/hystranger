import json
import logging
import sys
import time


logger = logging.getLogger("nadha_relay")
if not logger.handlers:
    handler = logging.StreamHandler(sys.stdout)
    handler.setFormatter(logging.Formatter("%(message)s"))
    logger.addHandler(handler)
    logger.setLevel(logging.INFO)
    logger.propagate = False


def log_event(event: str, **fields: object) -> None:
    payload = {"timestamp": time.time(), "event": event, **fields}
    logger.info(json.dumps(payload, separators=(",", ":"), default=str))
