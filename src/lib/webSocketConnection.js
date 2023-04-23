import { io } from "socket.io-client";
const ENDPOINT = 'ws://localhost:3001';

const socket = io(ENDPOINT, { transports: ["websocket"] });

export const ioClient = socket;