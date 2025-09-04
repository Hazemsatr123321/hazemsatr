import requests
import sys

def get_weather(city):
    """
    Fetches weather data for a given city from wttr.in.

    This function will crash if the city is not found because wttr.in
    returns an HTML error page instead of JSON, leading to a
    requests.exceptions.JSONDecodeError or HTTPError.
    """
    url = f"http://wttr.in/{city}?format=j1"
    response = requests.get(url)
    response.raise_for_status()  # This will raise an exception for 404 Not Found
    weather_data = response.json()

    # In a real app, you'd extract and display info. Here, we just print the raw data.
    print(f"Successfully fetched weather data for {city}.")
    # print(weather_data) # Commenting out to keep output clean for this example

if __name__ == "__main__":
    if len(sys.argv) > 1:
        city = sys.argv[1]
        get_weather(city)
    else:
        print("Usage: python weather_app/weather.py <city>")
