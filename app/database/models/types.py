import uuid
from datetime import datetime

from sqlalchemy import String, text
from typing import Annotated
from sqlalchemy.testing.schema import mapped_column

uuid_pk = Annotated[uuid.UUID, mapped_column(primary_key=True, default=uuid.uuid4)]
str_50 = Annotated[str, mapped_column(String(50))]
str_256 = Annotated[str, mapped_column(String(256))]
str_3000 = Annotated[str, mapped_column(String(3000))]
created_dt = Annotated[datetime, mapped_column(server_default=text("TIMEZONE('utc', now())"))]
updated_dt = Annotated[datetime, mapped_column(server_default=text("TIMEZONE('utc', now())"),
                                               onupdate=datetime.now)]
