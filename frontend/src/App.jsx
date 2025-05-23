import React, { useState, useEffect } from 'react';

const foodImages = [
  "/img/food1.jpg",
  "/img/food2.jpg",
  "/img/food3.jpg"
];

const popularMenuItems = [
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
];

export default function App() {
  const [step, setStep] = useState(0);
  const [imageIndex, setImageIndex] = useState(0);
  const [chatInput, setChatInput] = useState("");
  const [chatLog, setChatLog] = useState([]);

  useEffect(() => {
    if (step === 0) {
      const interval = setInterval(() => {
        setImageIndex((prev) => (prev + 1) % foodImages.length);
      }, 1000);

      const timeout = setTimeout(() => setStep(1), foodImages.length * 1000);

      return () => {
        clearInterval(interval);
        clearTimeout(timeout);
      };
    }
  }, [step]);

  const sendToAI = async () => {
    const res = await fetch("/api/ask", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message: chatInput })
    });
    const data = await res.json();
    setChatLog([...chatLog, { user: chatInput, bot: data.response }]);
    setChatInput("");
  };

  if (step === 0) {
    return (
      <div className="h-screen w-full flex flex-col justify-center items-center bg-black text-white">
        <img
          src={foodImages[imageIndex]}
          alt="food"
          className="w-full h-[60vh] object-cover"
        />
      </div>
    );
  }

  if (step === 1) {
    return (
      <div className="h-screen w-full flex flex-col justify-center items-center bg-white text-center">
        <h1 className="text-2xl font-semibold mb-4">Explore Popular Snacks</h1>
        <div className="grid grid-cols-2 gap-2 w-full px-4 text-sm">
          {popularMenuItems.map((item, i) => (
            <div key={i} className="bg-yellow-100 text-black py-2 px-3 rounded">
              {item}
            </div>
          ))}
        </div>
        <button
          className="mt-6 px-6 py-3 bg-green-600 text-white rounded-full text-xl"
          onClick={() => setStep(2)}
        >
          Let’s Order Food Today 🍽️
        </button>
      </div>
    );
  }

  if (step === 2) {
    return (
      <div className="h-screen w-full flex flex-col p-4 text-black bg-gray-50">
        <h2 className="text-xl font-bold mb-2">Smart Café AI Chat</h2>
        <div className="flex-1 overflow-y-auto space-y-2 mb-4">
          {chatLog.map((msg, i) => (
            <div key={i}>
              <p><strong>You:</strong> {msg.user}</p>
              <p><strong>AI:</strong> {msg.bot}</p>
            </div>
          ))}
        </div>
        <div className="flex gap-2">
          <input
            value={chatInput}
            onChange={(e) => setChatInput(e.target.value)}
            placeholder="Type your food preference..."
            className="flex-1 border border-gray-300 px-3 py-2 rounded"
          />
          <button
            onClick={sendToAI}
            className="bg-blue-600 text-white px-4 py-2 rounded"
          >
            Send
          </button>
        </div>
      </div>
    );
  }

  return null;
}
