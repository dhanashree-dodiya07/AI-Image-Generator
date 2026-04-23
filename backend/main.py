from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles
from fastapi.middleware.cors import CORSMiddleware

from app.routes import auth_routes
from app.routes import image_routes

app = FastAPI(title="AI Image Generator API")

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://127.0.0.1:3000"],  # Next.js dev server
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Serve generated images
app.mount("/images", StaticFiles(directory="app/static/images"), name="images")

# Include routers
app.include_router(auth_routes.router)
app.include_router(image_routes.router)


@app.get("/")
def home():
    return {"message": "AI Image Generator API Running"}