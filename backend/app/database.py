from pymongo import MongoClient
import os

MONGO_URI = "mongodb+srv://Dhanashree:d_dodiya629@cluster0.c7ock.mongodb.net/?retryWrites=true&w=majority"

client = MongoClient(MONGO_URI)

db = client["ai_image_generator"]