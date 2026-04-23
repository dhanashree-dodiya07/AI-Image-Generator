from fastapi import Depends, HTTPException
from fastapi.security import OAuth2PasswordBearer
from jose import jwt
from bson import ObjectId

from app.config.database import users_collection

SECRET_KEY = "secret123"
ALGORITHM = "HS256"

# Swagger login URL
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/auth/login")


def get_current_user(token: str = Depends(oauth2_scheme)):
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])

        user_id = payload.get("user_id")

        if user_id is None:
            raise HTTPException(status_code=401, detail="Invalid token")

        user = users_collection.find_one({"_id": ObjectId(user_id)})

        if user is None:
            raise HTTPException(status_code=404, detail="User not found")

        return user

    except Exception:
        raise HTTPException(status_code=401, detail="Invalid or expired token")