from pydantic import BaseModel

class Image(BaseModel):
    prompt: str
    image_path: str
    liked: bool = False