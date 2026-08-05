from sklearn.metrics.pairwise import cosine_similarity


def get_recommendations(current_object,objects,embedding_field="embedding",top_n=10):
    recommendations = []

    current_embedding = getattr(
        current_object,
        embedding_field,
        None
    )
    if not current_embedding:
        return []

    for obj in objects:
        obj_embedding = getattr(
            obj,
            embedding_field,
            None
        )
        if not obj_embedding:
            continue

        if obj.id == current_object.id:
            continue

        score = cosine_similarity(
            [current_embedding],
            [obj_embedding]
        )[0][0]
        
        recommendations.append(
            {
                "object": obj,
                "score": round(float(score), 4)
            }
        )
        
    recommendations.sort(key=lambda x: x["score"],reverse=True)

    return recommendations[:top_n]