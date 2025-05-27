from flask import Flask, request, jsonify
import numpy as np
from sklearn.metrics.pairwise import cosine_similarity

app = Flask(__name__)

@app.route('/recommend', methods=['POST'])
def recommend_movies():
    data = request.get_json()
    user_ratings = data.get('user_ratings', {})  # {movie_id: rating}
    all_user_ratings = data.get('all_user_ratings', {})  # {user_id: {movie_id: rating}}

    if not user_ratings or not all_user_ratings:
        return jsonify({'error': 'Missing user_ratings or all_user_ratings'}), 400

    best_match = None
    best_similarity = -1

    user_movies = set(user_ratings.keys())

    for other_user_id, other_ratings in all_user_ratings.items():
        # Skip comparing the user to themselves if present
        if data.get("user_id") and other_user_id == data["user_id"]:
            continue

        other_movies = set(other_ratings.keys())
        common_movies = user_movies & other_movies

        if not common_movies:
            continue

        # Create aligned vectors for the common movies
        u_vec = np.array([user_ratings[m] for m in common_movies])
        o_vec = np.array([other_ratings[m] for m in common_movies])

        # Compute cosine similarity
        sim = cosine_similarity([u_vec], [o_vec])[0][0]

        if sim > best_similarity:
            best_similarity = sim
            best_match = other_user_id

    if best_match is None:
        return jsonify({'recommendations': [], 'reason': 'No similar users found'}), 200

    similar_user_ratings = all_user_ratings[best_match]
    # Recommend movies the similar user has rated that the current user hasn't seen
    recommendations = [
        (movie, rating)
        for movie, rating in similar_user_ratings.items()
        if movie not in user_ratings
    ]
    # Sort by the similar user's rating, highest first
    recommendations.sort(key=lambda x: x[1], reverse=True)

    return jsonify({
        'recommendations': [movie for movie, _ in recommendations],
        'similar_user_id': best_match,
        'similarity': best_similarity
    })