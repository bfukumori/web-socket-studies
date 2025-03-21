import express from "express";
import { createServer } from "node:http";
import { Server } from "socket.io";
import cors from "cors";

const app = express();
const server = createServer(app);
// app.use(cors);

let featureFlags = {
  showInput: false,
  darkTheme: false,
};

const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.use(express.json());

app.post("/toggle-feature", (req, res) => {
  console.log(req.body);
  const { feature, value } = req.body;

  if (feature in featureFlags) {
    featureFlags[feature] = value;
    io.emit("feature_flags", featureFlags);
    return res.json({ success: true, featureFlags });
  }

  return res.status(400).json({ error: "Feature inválida" });
});

app.use(express.json());

io.on("connection", (socket) => {
  // console.log("A user connected", socket.id);

  socket.on("chat", (msg) => {
    console.log("message: ", msg);
    io.emit("chat", msg);
  });

  socket.emit("feature_flags", featureFlags);

  // socket.on("disconnect", () => {
  //   console.log("A user disconnected", socket.id);
  // });
});

server.listen(3001, () => console.log("Server is running on port 3001"));
