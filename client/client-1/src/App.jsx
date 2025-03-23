import { useEffect, useState } from "react";
import "./App.css";
import io from "socket.io-client";

function App() {
  const [socket, setSocket] = useState(null);
  const [message, setMessage] = useState("");

  const sendMessage = () => {
    if (socket) {
      socket.emit("client-1", "Hello from client-1");
    }
  };

  const [chatMessages, setChatMessages] = useState([]);
  const [input, setInput] = useState("");

  const sendChatMessage = (event) => {
    event.preventDefault();
    if (input.trim() === "") return;

    socket.emit("chat", `Cliente 1: ${input}`);

    setInput("");
  };

  useEffect(() => {
    const socketConnection = io("http://localhost:3000");
    setSocket(socketConnection);

    socketConnection.on("client-1", (data) => {
      setMessage(data);
    });

    socketConnection.on("chat", (msg) => {
      setChatMessages([...chatMessages, msg]);
    });

    return () => {
      socketConnection.disconnect();
    };
  }, [chatMessages]);

  return (
    <>
      <div>
        <h1>Cliente 1 WebSocket com React</h1>
        <button onClick={sendMessage}>Enviar Mensagem</button>
        <p>Mensagem do servidor: {message}</p>
      </div>
      <h1>Chat</h1>
      <div className="chat-container">
        <div className="messages">
          {chatMessages?.map((msg, index) => {
            const [prefix, ...content] = msg.split(": ");
            const userName = prefix === "Cliente 1" ? "Você" : prefix;
            return (
              <div key={index} className="message">
                <strong>{userName}:</strong> {content.join(": ")}
              </div>
            );
          })}
        </div>
      </div>
      <form onSubmit={sendChatMessage} className="input-area">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Digite sua mensagem..."
        />
        <button onClick={sendChatMessage}>Enviar</button>
      </form>
    </>
  );
}

export default App;
