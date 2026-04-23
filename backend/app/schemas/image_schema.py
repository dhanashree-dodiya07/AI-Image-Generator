def image_serializer(img) -> dict:
    return {
        "id": str(img["_id"]),
        "prompt": img["prompt"],
        "image_path": img["image_path"],
        "liked": img["liked"]
    }