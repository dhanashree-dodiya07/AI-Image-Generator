from fastapi import APIRouter, Depends, HTTPException
from fastapi.security import OAuth2PasswordRequestForm

from app.models.user_model import User
from app.config.database import users_collection
from app.utils.password_hash import hash_password, verify_password
from app.utils.jwt_handler import create_token

router = APIRouter(prefix="/auth", tags=["Auth"])


# REGISTER
@router.post("/register")
def register(user: User):

    existing_user = users_collection.find_one({"email": user.email})

    if existing_user:
        raise HTTPException(status_code=400, detail="User already exists")

    user.password = hash_password(user.password)

    users_collection.insert_one(user.dict())

    return {"message": "User Registered Successfully"}


# LOGIN
@router.post("/login")
def login(form_data: OAuth2PasswordRequestForm = Depends()):

    db_user = users_collection.find_one({"email": form_data.username})

    if not db_user:
        raise HTTPException(status_code=404, detail="User not found")

    if not verify_password(form_data.password, db_user["password"]):
        raise HTTPException(status_code=401, detail="Wrong password")

    token = create_token({"user_id": str(db_user["_id"])})

    return {
        "access_token": token,
        "token_type": "bearer"
    }