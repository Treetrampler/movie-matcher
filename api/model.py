from flask import Flask, request, jsonify
from flask_cors import CORS  # <-- Add this import
import numpy as np
from sklearn.metrics.pairwise import cosine_similarity

app = Flask(__name__)
CORS(app)

@app.route('/api/recommend', methods=['POST'])
def recommend_movies():
    data = request.get_json() # get all the data
    user_ids = data.get("user_id", []) # This can be a single user_id or a list of user_ids
    user_ratings = data.get('user_ratings', {})  # {user_id: {movie_id: rating}} 
    all_user_ratings = data.get('all_user_ratings', {})  # {user_id: {movie_id: rating}}

    ratings_exist = False # Check if any user has ratings
    for user, ratings in user_ratings.items(): 
        if ratings:
            ratings_exist = True
            break

    if not ratings_exist: # If no user has ratings, return an empty recommendation
        return jsonify({'recommendations': []}), 200

    if isinstance(user_ids, str): # If user_ids is a single string, convert it to a list
        user_ids = [user_ids]
    else:
        user_ratings = combine_user_ratings(user_ratings) # Combine ratings from multiple users into a single user rating

    if not user_ratings or not all_user_ratings:
        return jsonify({'error': 'Missing user_ratings or all_user_ratings'}), 400
        

    best_match = None
    best_similarity = -1

    user_movies = set(user_ratings.keys()) 

    for other_user_id, other_ratings in all_user_ratings.items(): # Iterate through all users' ratings
        # Skip comparing the user to themselves if present
        if user_ids and other_user_id in user_ids: # dont compare to self
            continue

        other_movies = set(other_ratings.keys())  # Get the movies rated by the other user
        common_movies = user_movies & other_movies # Find common movies rated by both users

        if not common_movies:
            continue

        # Create aligned vectors for the common movies
        u_vec = np.array([user_ratings[m] for m in common_movies]) 
        o_vec = np.array([other_ratings[m] for m in common_movies])

        # Compute cosine similarity
        sim = cosine_similarity([u_vec], [o_vec])[0][0]

        if sim > best_similarity: # Update best match if this user is more similar
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
        'similar_user_id': best_match, #for extra info if needed
        'similarity': best_similarity
    })

def combine_user_ratings(user_ratings):
    """
    Combine ratings from multiple users into a single user rating.
    This is a simple average of the ratings for each movie.
    """
    combined_ratings = {}
    for user_id, ratings in user_ratings.items():
        for movie_id, rating in ratings.items():
            if movie_id not in combined_ratings:
                combined_ratings[movie_id] = []
            combined_ratings[movie_id].append(rating)

    # Average the ratings
    averaged_ratings = {movie: np.mean(ratings) for movie, ratings in combined_ratings.items()}
    return averaged_ratings
