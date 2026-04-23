import requests

# Test backend connection
try:
    response = requests.get("http://127.0.0.1:8000/")
    print(f"Backend Status: {response.status_code}")
    print(f"Backend Response: {response.json()}")
    
    # Test register endpoint
    register_data = {
        "fullName": "Test User",
        "email": "test@example.com",
        "password": "test123"
    }
    register_response = requests.post("http://127.0.0.1:8000/auth/register", json=register_data)
    print(f"Register Status: {register_response.status_code}")
    print(f"Register Response: {register_response.json()}")
    
except Exception as e:
    print(f"Error: {e}")
