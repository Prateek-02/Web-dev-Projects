// /client/src/services/socket.js
import { io } from "socket.io-client";

// Replace with your actual backend URL
const SERVER_URL = import.meta.env.VITE_SERVER_URL || "http://localhost:5000";

const socket = io(SERVER_URL, {
  withCredentials: true,
  autoConnect: false, // We'll manually connect after auth
});

export default socket;
