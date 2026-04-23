from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from datetime import datetime
import os
import re

from bson import ObjectId

from app.config.database import images_collection
from app.utils.auth import get_current_user

# ✅ IMPORT YOUR LOCAL GENERATOR
from app.services.image_generator import generate_image


router = APIRouter(prefix="/image", tags=["Image"])


# ---------- Correct Static Image Path ----------

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
IMAGE_DIR = os.path.join(BASE_DIR, "static", "images")

os.makedirs(IMAGE_DIR, exist_ok=True)


# ---------- Request Model ----------

class ImageRequest(BaseModel):
    prompt: str


# ---------- Generate Image (UPDATED) ----------

@router.post("/generate")
def generate_image_route(data: ImageRequest, user: dict = Depends(get_current_user)):

    try:
        # ✅ CALL LOCAL MODEL
        filename = generate_image(data.prompt)

    except Exception as e:
        print("Generation error:", str(e))
        raise HTTPException(status_code=500, detail="Image generation failed")

    # ---------- Save Record in MongoDB ----------

    image_doc = {
        "user_id": str(user["_id"]),
        "prompt": data.prompt,
        "image_url": f"/images/{filename}",
        "likes": 0,
        "created_at": datetime.utcnow()
    }

    result = images_collection.insert_one(image_doc)

    return {
        "message": "Image generated successfully",
        "image_id": str(result.inserted_id),
        "image_url": f"/images/{filename}"
    }


# ---------- Image History ----------

@router.get("/history")
def get_history(user: dict = Depends(get_current_user)):

    images = list(images_collection.find({"user_id": str(user["_id"])}))

    for img in images:
        img["_id"] = str(img["_id"])

    return images


# ---------- Like Image ----------

@router.post("/like/{image_id}")
def like_image(image_id: str):

    images_collection.update_one(
        {"_id": ObjectId(image_id)},
        {"$inc": {"likes": 1}}
    )

    return {"message": "Image liked successfully"}