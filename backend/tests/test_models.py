import pytest
from pydantic import ValidationError

from app.models import client_message_adapter


@pytest.mark.parametrize("payload", [
    {"type": "unknown"},
    {"type": "signal", "signal_type": "hack", "payload": {}},
    {"type": "leave", "reason": "anything"},
    {"type": "chat", "text": ""},
    {"type": "chat", "text": "x" * 501},
    {"type": "report", "reason": "made_up", "end_match": True},
    {"type": "client_failure", "category": "secret_dump"},
])
def test_invalid_signaling_messages(payload):
    with pytest.raises(ValidationError):
        client_message_adapter.validate_python(payload)
