import json
import numpy as np
from sklearn.metrics.pairwise import cosine_similarity

def combine_user_ratings(user_ratings):
    combined_ratings = {}
    for user_id, ratings in user_ratings.items():
        for movie_id, rating in ratings.items():
            if movie_id not in combined_ratings:
                combined_ratings[movie_id] = []
            combined_ratings[movie_id].append(rating)
    return {movie: np.mean(ratings) for movie, ratings in combined_ratings.items()}

def handler(request):
    if request["method"] != "POST":
        return {
            "statusCode": 405,
            "body": json.dumps({"error": "Method not allowed"})
        }

    try:
        data = json.loads(request["body"])
    except Exception:
        return {
            "statusCode": 400,
            "body": json.dumps({"error": "Invalid JSON"})
        }

    user_ids = data.get("user_id", [])
    user_ratings = data.get("user_ratings", {})
    all_user_ratings = data.get("all_user_ratings", {})

    if isinstance(user_ids, str):
        user_ids = [user_ids]
    else:
        user_ratings = combine_user_ratings(user_ratings)

    if not user_ratings or not all_user_ratings:
        return {
            "statusCode": 400,
            "body": json.dumps({"error": "Missing user_ratings or all_user_ratings"})
        }

    best_match = None
    best_similarity = -1
    user_movies = set(user_ratings.keys())

    for other_user_id, other_ratings in all_user_ratings.items():
        if user_ids and other_user_id in user_ids:
            continue

        common_movies = user_movies & set(other_ratings.keys())
        if not common_movies:
            continue

        u_vec = np.array([user_ratings[m] for m in common_movies])
        o_vec = np.array([other_ratings[m] for m in common_movies])
        sim = cosine_similarity([u_vec], [o_vec])[0][0]

        if sim > best_similarity:
            best_similarity = sim
            best_match = other_user_id

    if best_match is None:
        return {
            "statusCode": 200,
            "body": json.dumps({
                "recommendations": [],
                "reason": "No similar users found"
            }),
            "headers": { "Content-Type": "application/json" }
        }

    similar_user_ratings = all_user_ratings[best_match]
    recommendations = [
        (movie, rating) for movie, rating in similar_user_ratings.items()
        if movie not in user_ratings
    ]
    recommendations.sort(key=lambda x: x[1], reverse=True)

    return {
        "statusCode": 200,
        "headers": { "Content-Type": "application/json" },
        "body": json.dumps({
            "recommendations": [movie for movie, _ in recommendations],
            "similar_user_id": best_match,
            "similarity": best_similarity
        })
    }
