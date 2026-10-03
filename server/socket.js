import { Server } from "socket.io";

let io;

export const initSocket = (server, isAllowedOrigin) => {
  io = new Server(server, {
    cors: {
      origin: (origin, callback) => {
        if (isAllowedOrigin(origin)) {
          callback(null, true);
        } else {
          callback(new Error("Not allowed by CORS"));
        }
      },
      credentials: true,
    },
  });

  io.on("connection", (socket) => {
    console.log("🟢 User connected:", socket.id);

    socket.on("join", (userId) => {
      socket.join(userId);
      console.log(`👤 User ${userId} joined their room`);
    });

    socket.on("disconnect", () => {
      console.log("🔴 User disconnected:", socket.id);
    });
  });

  return io;
};

export const getIO = () => {
  if (!io) {
    throw new Error("Socket.IO has not been initialized");
  }

  return io;
};
