from pymongo import MongoClient

MONGO_URI = "mongodb+srv://Name:<password>@cluster0.c7ock.mongodb.net/?retryWrites=true&w=majority"

client = MongoClient(MONGO_URI)

db = client["Database Name"]

# collections
users_collection = db["users"]
images_collection = db["images"]
