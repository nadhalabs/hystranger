from typing import Annotated, Literal, Union

from pydantic import BaseModel, Field, TypeAdapter


class JoinMessage(BaseModel):
    type: Literal["join"]


class LeaveMessage(BaseModel):
    type: Literal["leave"]
    reason: Literal["next", "stop", "cancel"] = "stop"


class SignalMessage(BaseModel):
    type: Literal["signal"]
    signal_type: Literal["offer", "answer", "ice"]
    payload: dict = Field(max_length=12)


class ChatMessage(BaseModel):
    type: Literal["chat"]
    text: str = Field(min_length=1, max_length=500)


class PingMessage(BaseModel):
    type: Literal["ping"]


class ReportMessage(BaseModel):
    type: Literal["report"]
    reason: Literal["sexual_content", "harassment", "violence", "underage", "spam", "other"]
    end_match: bool = True


class BlockMessage(BaseModel):
    type: Literal["block"]


class ClientFailureMessage(BaseModel):
    type: Literal["client_failure"]
    category: Literal["ice_failed", "connection_timeout", "signaling_error", "websocket_error"]


ClientMessage = Annotated[
    Union[JoinMessage, LeaveMessage, SignalMessage, ChatMessage, PingMessage, ReportMessage, BlockMessage, ClientFailureMessage],
    Field(discriminator="type"),
]
client_message_adapter = TypeAdapter(ClientMessage)
