from fastapi import FastAPI, Query
from fastapi.middleware.cors import CORSMiddleware
import pandas as pd
import os

app = FastAPI(title="BIN Intelligence API", version="1.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
    allow_credentials=True,
)

DATA_PATH = "data/bin_data.csv"

def load_data():
    try:
        return pd.read_csv(DATA_PATH)
    except:
        return pd.DataFrame()

@app.get("/api/health")
def health():
    df = load_data()
    return {"status": "healthy", "bins_loaded": len(df)}

@app.get("/api/bin/lookup")
def lookup_bin(bin: str = Query(..., min_length=6, max_length=6)):
    df = load_data()
    if df.empty:
        return {"error": "No data loaded"}
    
    result = df[df["bin"] == bin]
    if result.empty:
        return {"message": "BIN not found", "bin": bin}
    
    return result.iloc[0].to_dict()

@app.get("/api/bin/stats")
def get_stats():
    df = load_data()
    if df.empty:
        return {"total": 0, "issuers": 0, "countries": 0}
    
    return {
        "total": len(df),
        "issuers": df["issuer"].nunique(),
        "countries": df["country"].nunique(),
        "avg_decline_rate": round(df["decline_rate"].mean(), 3)
    }

@app.get("/api/bin/issuers")
def get_issuers():
    df = load_data()
    if df.empty:
        return []
    return df.groupby("issuer").size().reset_index(name="count").to_dict("records")