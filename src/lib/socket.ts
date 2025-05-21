import { io } from "socket.io-client";

const APIURL = process.env.NEXT_PUBLIC_API_URL;

export const socket = io(`${APIURL}`, {
    transports: ["websocket"],
    autoConnect: false,
    query: { userId: crypto.randomUUID() },
});
