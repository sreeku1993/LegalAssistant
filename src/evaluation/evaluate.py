import json
import os

from dotenv import load_dotenv
from datasets import Dataset

from ragas import evaluate

from ragas.metrics import (
    Faithfulness,
    ResponseRelevancy,
    LLMContextPrecisionWithReference,
    LLMContextRecall
)

from langchain_groq import ChatGroq
from langchain_huggingface import HuggingFaceEmbeddings

load_dotenv()

# Judge LLM
judge_llm = ChatGroq(
    model="llama-3.3-70b-versatile",
    api_key=os.getenv("GROQ_API_KEY"),
    temperature=0
)

# Embeddings for RAGAS metrics
embeddings = HuggingFaceEmbeddings(
    model_name="sentence-transformers/all-MiniLM-L6-v2"
)

# Load evaluation results
with open(
    "src/evaluation/results.json",
    "r",
    encoding="utf8"
) as f:
    rows = json.load(f)

dataset = Dataset.from_list(rows)
metrics = [
    Faithfulness(),
    ResponseRelevancy(),
    LLMContextPrecisionWithReference(),
    LLMContextRecall()
]
result = evaluate(
    dataset,
    metrics=metrics,
    llm=judge_llm,
    embeddings=embeddings
)

print("\n========== RAGAS RESULTS ==========\n")
print(result)

try:
    print("\n========== DATAFRAME ==========\n")
    print(result.to_pandas())
except Exception:
    pass