import { useEffect } from "react";
import { useState } from "react";
import { useParams } from "react-router-dom";
import { createSocketConnection } from "../utils/socket";
import { useSelector } from "react-redux";
import axios from "axios";
import { BASE_URL } from "../utils/constants";
import { useRef } from "react";
const Chat = () => {
  const bottomRef = useRef(null);
  const user = useSelector((store) => store.user.user);
  console.log("user", user);
  const userId = user._id;
  const firstname = user.firstname;
  const lastname = user.lastname;
  const photoUrl = user.photoUrl;
  const about = user.about;
  const { id } = useParams();
  const targetUserId = id;
  const [text, setText] = useState("");
  const [socket, setSocket] = useState("");
  const [messages, setMessages] = useState([]);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [friend , setFriend] = useState();
  console.log("onlineuserid--------_>", onlineUsers);
  console.log("messages", messages);

  const handleSendMessage = () => {
    setText("");
    socket.emit("sendMessage", {
      from: userId,
      to: targetUserId,
      message: text,
      firstname: firstname,
      lastname: lastname,
      photoUrl: photoUrl,
      about: about,
    });
  };

  const fetchMessages = async () => {
    const response = await axios.get(
      `${BASE_URL}/api/v1/user/chat/view-all-chat/${targetUserId}`,
      { withCredentials: true }
    );
    console.log("chat response ", response.data.chat);
    // const chatMessages = response.data.chat.messages.map((msg)=>{
    //     return {firstname : msg?.senderId.firstname , lastname : msg?.senderId.lastname , text : msg.text}
    // })
    setMessages(response.data.chat.messages);
  };
 
  const fetchTargetUserId = async ()=>{
    const response = await axios.get(`${BASE_URL}/api/v1/profile/${targetUserId}`,{withCredentials:true});
    console.log("yoooooo",response.data.user);
    setFriend(response.data.user)
  }

  useEffect(() => {
    fetchMessages();
    fetchTargetUserId();
  }, []);

  useEffect(() => {
    if (bottomRef.current) {
      bottomRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]); // 👈 runs every time a new message is added

  useEffect(() => {
    //creating socket connection
    const socket = createSocketConnection();
    setSocket(socket);

    //emit events ;

    // as soon as the page loads , the socket connection is made and joichat event is emitted
    socket.emit("joinChat", { targetUserId, userId, firstname });

    socket.on("message-recieved", (data) => {
      const {
        from,
        to,
        message,
        timestamp,
        firstname,
        lastname,
        photoUrl,
        about,
      } = data;
      console.log("message-recieved", data);

      setMessages((prevMessages) => [
        ...prevMessages,
        {
          senderId: {
            _id: from,
            about: about,
            firstname: firstname,
            lastname: lastname,
            photoUrl: photoUrl,
          },
          text: message,
          timestamp: timestamp,
        },
      ]);
    });

    socket.on("error", (data) => {
      console.log("error emitted", data);
      alert(data?.message);
    });

    socket.on("online-users", (onlineUserIds) => {
      console.log("Online users: ", onlineUserIds);
      setOnlineUsers(onlineUserIds);
    });

    // Cleanup on component unmount
    return () => {
      socket.disconnect(); // properly closes the socket connection
      console.log("Socket disconnected");
    };
  }, []);

  return (
    <>
      <h2 className="flex justify-center py-1 font-semibold mt-2 z-50 bg-white">
        Your Conversations
      </h2>
      <div className="flex justify-center">
        <div className="border w-1/2 pt-1  mt-14">
          <div className="px-4 flex gap-2 border-b-2 border-zinc-900 py-1">
            <div className="w-16 h-16 shadow-md rounded-full overflow-hidden mb-2">
              <img
                className="w-full h-full object-cover"
                src={friend?.photoUrl}
              />
            </div>
            <div className="flex flex-col">
              <h1 className="text-xl font-semibold">
                {friend?.firstname + " " + friend?.lastname}
              </h1>
              <span
                className={
                  onlineUsers.includes(targetUserId)
                    ? "text-green-600"
                    : "text-gray-400"
                }
              >
                {onlineUsers.includes(targetUserId) ? "Online" : "Offline"}
              </span>
            </div>
          </div>

          <div className="h-96 overflow-scroll overflow-y-auto mt-2 px-2">
            {messages.map((msg) => {
              const isMe = msg.senderId?._id === userId;
              return (
                <div className={`chat ${isMe ? "chat-end" : "chat-start"}`}>
                  <div className="chat-image avatar">
                    <div className="w-10 rounded-full">
                      <img
                        alt="Tailwind CSS chat bubble component"
                        src={isMe ? user?.photoUrl : msg.senderId?.photoUrl}
                      />
                    </div>
                  </div>
                  <div className="chat-header">
                    {msg?.senderId?.firstname}
                    {/* <time className="text-xs opacity-50">{new Date(msg.timestamp).toLocaleTimeString()}</time> */}
                  </div>
                  <div className="chat-bubble">{msg?.text}</div>
                </div>
              );
            })}
            <div ref={bottomRef}></div>
          </div>
          <div className="border w-full h-12 flex rounded-md">
            <input
              value={text}
              onChange={(e) => setText(e.target.value)}
              className="border px-4 outline-none focus:ring-blue-500 focus:border-blue-500 shadow-sm flex-1 h-full w-2/3 "
              type="text"
              placeholder="type something..."
            />
            <button
              onClick={handleSendMessage}
              disabled={text.length <= 0}
              className={`w-20 border hover:bg-blue-100 duration-150 ${
                text.length > 0 && "border-blue-500"
              } disabled:bg-gray-200 disabled:cursor-not-allowed`}
            >
              send
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default Chat;
