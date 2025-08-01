// /src/components/ChatWindow.jsx
import React, { useEffect, useRef, useState } from "react";
import MessageBubble from "./MessageBubble";
import socket from "../services/socket";
import { useAuth } from "../context/useAuth";

const ChatWindow = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const { user } = useAuth();
  const chatId = "global-room"; // For now, a static room. Replace with dynamic room/chat ID.
  const messagesEndRef = useRef(null);

  useEffect(() => {
    if (!user) return;

    // Join chat room
    socket.emit("joinRoom", chatId);

    // Listen for messages
    socket.on("receiveMessage", (message) => {
      setMessages((prev) => [...prev, message]);
    });

    return () => {
      socket.off("receiveMessage");
    };
  }, [user]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const messageData = {
      chatId,
      from: user.username || "You",
      text: input,
    };

    // Emit to server
    socket.emit("sendMessage", messageData);

    // Optimistically add to local state
    setMessages((prev) => [...prev, messageData]);
    setInput("");
  };

  // Scroll to latest message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="flex-1 p-4 flex flex-col justify-between h-full">
      <div className="overflow-y-auto space-y-2">
        {messages.map((msg, idx) => (
          <MessageBubble key={idx} message={msg} />
        ))}
        <div ref={messagesEndRef} />
      </div>

      <form onSubmit={handleSubmit} className="mt-4 flex gap-2">
        <input
          type="text"
          placeholder="Type a message..."
          className="flex-1 border rounded p-2"
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />
        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          Send
        </button>
      </form>
    </div>
  );
};

export default ChatWindow;
