import React, { useState } from "react";

const App = () => {
  const [message, setMessage] = useState("");
  const [reply, setReply] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSend = async () => {
    if (!message) return;
    setLoading(true);
    setReply("");

    try {
      const res = await fetch("http://localhost:3001/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message }),
      });
      const data = await res.json();
      setReply(data.reply || "No response");
    } catch (err) {
      console.error("Error:", err);
      setReply("Error contacting server");
    } finally {
      setLoading(false);
    }
  };

  const handleVoiceInput = () => {
    const recognition = new (window as any).webkitSpeechRecognition();
    recognition.lang = "en-US";
    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      setMessage(transcript);
    };
    recognition.start();
  };

  return (
    <div className="max-w-xl mx-auto mt-20 p-6 bg-white rounded-xl shadow-md space-y-4">
      <h1 className="text-xl font-bold text-center">ChatGPT Voice Assistant</h1>
      <div className="flex gap-2">
        <input
          className="border p-2 flex-1 rounded"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Type your message or use the mic..."
        />
        <button
          onClick={handleSend}
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          Send
        </button>
        <button
          onClick={handleVoiceInput}
          className="bg-gray-300 px-3 rounded"
        >
          🎤
        </button>
      </div>
      {loading ? (
        <p className="text-gray-500">Loading...</p>
      ) : (
        reply && <p className="p-4 bg-gray-100 rounded">{reply}</p>
      )}
    </div>
  );
};

export default App;
