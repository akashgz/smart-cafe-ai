from flask import Flask, request, jsonify
import requests

app = Flask(__name__)

@app.route("/", methods=["GET"])
def home():
    return "✅ Smart Café backend is running."

@app.route("/api/ask", methods=["POST"])
def order_with_ai():
    user_input = request.json.get("message", "")

    # Static menu to pass as context
    menu = [
        "Vada Pav", "Samosa", "Dhokla", "Pav Bhaji", "Poha",
        "Misal Pav", "Upma", "Idli", "Dosa", "Uttapam",
        "Pakora", "Aloo Tikki", "Chole Bhature", "Aloo Paratha", "Paneer Tikka",
        "Spring Rolls", "French Fries", "Momos", "Chow Mein", "Manchurian",
        "Veg Sandwich", "Cheese Sandwich", "Grilled Sandwich", "Burger", "Pizza",
        "Pasta", "Maggi", "Bread Pakora", "Kachori", "Cutlet",
        "Tandoori Chicken", "Chicken Lollipop", "Paneer Chilli", "Chilli Chicken", "Noodles",
        "Garlic Bread", "Egg Roll", "Kathi Roll", "Chicken Roll", "Fish Fry",
        "Ice Cream", "Milkshake", "Cold Coffee", "Hot Chocolate", "Lassi",
        "Sweet Corn Soup", "Tomato Soup", "Lemon Soda", "Fruit Salad", "Boiled Chana"
    ]

    # Combine prompt
    prompt = (
        "You are a food assistant. Use the following menu to suggest or build an order.\n"
        f"Menu: {', '.join(menu)}\n"
        f"User input: {user_input}\n"
        "Respond with a friendly food suggestion or cart update based on available items."
    )

    try:
        response = requests.post(
            "http://host.docker.internal:11434/api/generate",
            json={"model": "qwen3:0.6b", "prompt": prompt, "stream": False}
        )

        data = response.json()
        raw_output = data.get("response", "")

        print("💬 Model raw:", raw_output)  # debug log

        # ✅ Clean unwanted tags/thinking
        import re
        cleaned = re.sub(r"<think>.*?</think>", "", raw_output, flags=re.DOTALL)  # remove reasoning
        cleaned = cleaned.replace("**", "")  # remove markdown bold
        cleaned = cleaned.strip()

        if cleaned.lower().startswith("here are the available items"):
            cleaned += "\n\n👉 You can type what you're craving or ask for a suggestion!"

        return jsonify({"response": cleaned})
    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000)
