import logging

import uvicorn
from fastapi import FastAPI

from api import auth_controller, user_controller
from database.database import init_db
from deps import auth
from fastapi.middleware.cors import CORSMiddleware

def create_application() -> FastAPI:
    logging.basicConfig(level=logging.DEBUG)
    init_db(False)
    application = FastAPI(
        title="F2F Bank API",
        docs_url="/api/docs",
        version="1.0.0",
        openapi_url="/api/openapi.json",
    )

    origins = [
        "http://localhost:5173",
        "http://localhost"
    ]

    application.add_middleware(
        CORSMiddleware,
        allow_origins=origins,
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )

    application.include_router(auth_controller.router)
    application.include_router(user_controller.router)

    return application

app = create_application()
auth.handle_errors(app)


if __name__ == "__main__":
    uvicorn.run(
        'main:app',
        host='0.0.0.0',
        port=8080,
        reload=True,
        log_level="info"
    )
