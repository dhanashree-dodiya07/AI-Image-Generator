from diffusers import StableDiffusionPipeline
import torch
import uuid

pipe = StableDiffusionPipeline.from_pretrained(
    "runwayml/stable-diffusion-v1-5"
)

pipe = pipe.to("cuda" if torch.cuda.is_available() else "cpu")

def generate_image(prompt: str):

    image = pipe(prompt).images[0]

    filename = f"{uuid.uuid4()}.png"

    path = f"app/static/images/{filename}"

    image.save(path)

    return filename