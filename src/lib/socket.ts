import { io } from "socket.io-client";

export const socket = io("https://smartqr-back.onrender.com/", {
    transports: ["websocket"],
    autoConnect: false,
    query: { userId: crypto.randomUUID() },
});
