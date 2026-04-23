from pydantic import BaseModel, EmailStr

class User(BaseModel):
    fullName: str
    email: EmailStr
    password: str