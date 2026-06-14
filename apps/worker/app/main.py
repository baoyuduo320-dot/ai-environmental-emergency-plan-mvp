from fastapi import FastAPI

app = FastAPI(title="Emergency Plan Worker")


@app.get("/health")
def health() -> dict[str, str]:
    return {"status": "ok"}
