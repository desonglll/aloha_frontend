from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

origins = [
    "http://localhost:5173",
    "http://127.0.0.1:5173",
]

# 使用 CORSMiddleware 的实例化方式
app.add_middleware(
    CORSMiddleware,  # 直接使用类
    allow_origins=origins,  # 允许的前端源
    allow_credentials=True,
    allow_methods=["*"],  # 允许所有方法 (GET, POST, PUT, DELETE等)
    allow_headers=["*"],  # 允许所有请求头
)


@app.get("/")
def main():
    return {"message": "Hello from mock!"}
