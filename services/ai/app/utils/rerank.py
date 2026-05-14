from sentence_transformers import CrossEncoder


model = CrossEncoder("cross-encoder/ms-marco-MiniLM-L6-v2")

def rerank(query, chunks):
    ranks = model.rank(query, chunks, return_documents=True)
    return [(rank['corpus_id'], rank['score']) for rank in ranks]