import sys
import json

try:
    data = json.load(sys.stdin)
    reviews = data.get('reviews', [])
    print(f"Total reviews: {len(reviews)}")
    for r in reviews:
        author = r.get('author', {}).get('login', 'Unknown')
        state = r.get('state', 'Unknown')
        body = r.get('body', '')
        print(f"Reviewer: {author}")
        print(f"State: {state}")
        print("Body:")
        print(body)
        print("-" * 20)
except Exception as e:
    print(f"Error parsing JSON: {e}")
