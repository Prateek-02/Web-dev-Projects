// /src/components/MessageBubble.jsx
import React from "react";

const MessageBubble = ({ message }) => {
  const isUser = message.from === "You";

  return (
    <div className={`flex ${isUser ? "justify-end" : "justify-start"}`}>
      <div
        className={`p-2 rounded-lg max-w-xs ${
          isUser ? "bg-blue-500 text-white" : "bg-gray-200 text-black"
        }`}
      >
        {message.text}
      </div>
    </div>
  );
};

export default MessageBubble;
