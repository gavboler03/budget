from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import os
from database import Base, engine

app = FastAPI()

Base.metadata.create_all(bind=engine)
API_URL = os.getenv('API_URL')

app.add_middleware(
    CORSMiddleware,
    allow_origins=['http://localhost:3000'],
    allow_credentials=True,
    allow_methods=['*'],
    allow_headers=['*'],
)

@app.get("/")
async def hello():
    return {"message":"Welcome to the Budget App!"}
