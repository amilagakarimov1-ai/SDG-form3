from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .routers import auth, bins, reports, tasks, coins, routes
from .database import engine, Base

# Create tables if they don't exist (useful for dev, normally use alembic)
Base.metadata.create_all(bind=engine)

app = FastAPI(title="FixiFy API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # Change in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.on_event("startup")
async def startup_event():
    print("FixiFy API is starting up...")

@app.get("/health")
def health_check():
    return {"status": "ok"}

app.include_router(auth.router, prefix="/auth", tags=["auth"])
app.include_router(bins.router, prefix="/bins", tags=["bins"])
app.include_router(reports.router, prefix="/reports", tags=["reports"])
app.include_router(tasks.router, prefix="/tasks", tags=["tasks"])
app.include_router(coins.router, prefix="/coins", tags=["coins"])
app.include_router(routes.router, prefix="/truck-routes", tags=["truck-routes"])
