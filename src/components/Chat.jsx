import { useState, useEffect } from "react";
import ScrollToBottom from "react-scroll-to-bottom";
import chatIcon from "../assets/chat.svg";
const Chat = ({ socket, username, room }) => {
  const [currentMessage, setCurrnetMessage] = useState("");
  const [messageList, setMessageList] = useState([]);
  const [open, setOpen] = useState(true);
  const sendMessage = () => {
    if (currentMessage) {
      const messageData = {
        room: room,
        author: username,
        message: currentMessage,
        time:
          new Date(Date.now()).getHours() +
          ":" +
          new Date(Date.now()).getMinutes(),
      };
      socket.emit("send_message", messageData);
      setMessageList((list) => [...list, messageData]);
      setCurrnetMessage("");
    }
  };

  useEffect(() => {
    socket.on("receive_message", (data) => {
      setMessageList((list) => [...list, data]);
    });
  }, [socket]);

  return (
    <div>
      {open && (
        <>
          <div className="chat-window">
            <div className="chat-header">
              <p>
                <span
                  style={{
                    color: "green",
                    background: "green",
                    padding: "3px",
                    margin: "5px",
                    borderRadius: "20px",
                  }}
                >
                  0
                </span>
                Live Chat
              </p>
            </div>
            <div className="chat-body">
              <ScrollToBottom className="message-container">
                {messageList &&
                  messageList.map((messageContent, idx) => (
                    <div
                      key={idx}
                      className="message"
                      id={username === messageContent.author ? "you" : "other"}
                    >
                      <div>
                        <div className="message-content">
                          <p>{messageContent.message}</p>
                        </div>
                        <div className="message-meta">
                          <p id="time">{messageContent.time}</p>
                          <p id="author">{messageContent.author}</p>
                        </div>
                      </div>
                    </div>
                  ))}
              </ScrollToBottom>
            </div>
            <div className="chat-footer">
              <input
                value={currentMessage}
                type="text"
                placeholder="Hey!"
                onChange={(e) => {
                  setCurrnetMessage(e.target.value);
                }}
                onKeyPress={(e) => {
                  e.key === "Enter" && sendMessage();
                }}
              />
              <button onClick={() => sendMessage()}>&#9658;</button>
            </div>
          </div>
        </>
      )}
      <div id="icon">
        <img
          onClick={() => setOpen(!open)}
          src={chatIcon}
          style={{
            width: "100px",
          }}
          alt="Chat-icon"
        />
      </div>
    </div>
  );
};

export default Chat;
