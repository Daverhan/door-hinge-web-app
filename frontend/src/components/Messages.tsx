import { io, Socket } from "socket.io-client";
import { useEffect, useState, useRef } from "react";
import { Chat, Message } from "../interfaces.ts";
import { RxHamburgerMenu } from "react-icons/rx";
import { IoClose } from "react-icons/io5";

function Messaging() {
  const [messageText, setMessageText] = useState<string>("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [chatId, setChatId] = useState<number | null>(null);
  const [chats, setChats] = useState<Chat[]>([]);
  const [currentChatUser, setCurrentChatUser] = useState<string | null>(null);
  const [username, setUsername] = useState<string | null>(null);
  const socket = useRef<Socket | null>(null);
  const messageEndRef = useRef<HTMLDivElement | null>(null);

  const [isOpen, setIsOpen] = useState(false);
  const [isSmall, setSmall] = useState(false);
  const [isMid, setMid] = useState(false);
  const [isLarge, setLarge] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setIsOpen(false);
      }
      setLarge(window.innerWidth >= 960);
      setMid(window.innerWidth >= 720 && window.innerWidth <= 960 );
      setSmall(window.innerWidth < 720 );
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);



  useEffect(() => {
    if (messageEndRef.current) {
      messageEndRef.current.scrollTo(0, messageEndRef.current.scrollHeight);
    }
  }, [messages]);

  useEffect(() => {
    const storedUsername = sessionStorage.getItem("username");
    setUsername(storedUsername);
    fetch(
      import.meta.env.VITE_SOCKET_API_TARGET + "/api/users/favorited_chats",
      {
        credentials: "include",
      }
    )
      .then((response) => response.json())
      .then((data) => {
        setChats(data);
      })
      .catch((error) => console.error("Error fetching data: ", error));
  }, []);

  const connectToChat = (chat: Chat) => {
    setChatId(chat.chat_id);
    setCurrentChatUser(chat.other_user);
    if (socket.current) {
      socket.current.disconnect();
    }

    socket.current = io(import.meta.env.VITE_SOCKET_API_TARGET, {
      query: { username },
      withCredentials: true,
    });

    socket.current.emit("join_room", { room: chat.chat_id });

    socket.current.on("receive message", (message) => {
      setMessages((prevMessages) => [
        ...prevMessages,
        {
          ...message,
          sender_name: message.sender_name,
          content: message.content,
          timestamp: message.timestamp,
        },
      ]);
    });
  };

  const handleChatBoxClick = (chat: Chat) => {
    setChatId(chat.chat_id);
    setCurrentChatUser(chat.other_user);
    connectToChat(chat);
    fetchMessages(chat.chat_id);
  };

  const fetchMessages = (chatId: number) => {
    fetch(
      import.meta.env.VITE_SOCKET_API_TARGET + `/api/users/messages/${chatId}`,
      {
        credentials: "include",
      }
    )
      .then((response) => response.json())
      .then((data) => {
        setMessages(data);
      })
      .catch((error) => console.error("Error fetching messages: ", error));
  };

  const handleMessageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setMessageText(event.target.value);
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (messageText.trim() && chatId && username && socket.current) {
      socket.current.emit("send_message", {
        chat_id: chatId,
        content: messageText.trim(),
        sender_name: username,
      });
      setMessageText("");
    }
  };

  return (
    <section className="bg-blue-100 h-screen pt-16">
    <div
      className={`lg:hidden text-3xl fixed top-16 bottom-0 left-0 bg-blue-100 w-64 z-10 transition-transform transform ${
        isOpen ? "translate-x-0" : "-translate-x-full"
      }`}
    >
      <div className="flex flex-col justify-items-center justify-center text-center items-center p-3 w-full">
        {chats.map((chat, index) => (
          <div
            key={index}
            className="p-3 m-2 bg-gray-200 rounded shadow cursor-pointer"
            onClick={() => handleChatBoxClick(chat)}
          >
            Chat with: {chat.other_user}
          </div>
        ))}
      </div>
    </div>
      <div className="grid grid-cols-6 h-screen-adjusted">
        <div className="hidden lg:block grid-cols-1 col-start-1 col-end-3 h-screen-adjusted w-100">
          <div className="flex flex-col row-start-1 row-end-2 col-start-1 col-end-2 justify-items-center justify-center text-center items-center">
            {chats.map((chat, index) => (
              <div
                key={index}
                className="p-3 m-2 bg-gray-200 rounded shadow cursor-pointer"
                onClick={() => handleChatBoxClick(chat)}
              >
                Chat with: {chat.other_user}
              </div>
            ))}
          </div>
        </div>
        <div className="flex justify-evenly items-center bg-white row-span-2 col-start-1 lg:col-start-3 col-end-7">
          <div className="grid items grid-cols-2 grid-rows-[7%_4fr_10%] w-full h-full space-x-0 space-y-0">
            <header className="flex bg-blue-gray-50 col-start-1 col-end-3 justify-items-center justify-center items-center mt-0">
              <p className="pl-2">Messaging {currentChatUser ? `${currentChatUser}` : ""}</p>
              <div className="lg:hidden flex items-center justify-end w-full h-full pr-5">
                {isOpen ? (
                  <IoClose onClick={toggleMenu}></IoClose>
                ) : (
                  <RxHamburgerMenu onClick={toggleMenu}></RxHamburgerMenu>
                )}
              </div>

            </header>
            <div
              style={isSmall ? { height : '430px'} : isMid ? {height : '600px'} : isLarge ? {height : '700px'}: { height : '500px' }}
              className="flex flex-col overflow-auto row-start-2 row-end-5 col-start-1 col-end-3"
              ref={messageEndRef}
            >
              {messages.map((msg, index) =>
                msg.sender_name === username ? (
                  <div className="grid grid-cols-2">
                    <div></div>
                    <div
                      key={index}
                      className="message border-solid border-2 border-gray-200 overflow-hidden break-words rounded-lg p-2 m-2 bg-white"
                    >
                      <b> {msg.sender_name}</b>: {msg.content} <br></br> <p className="text-gray-600 text-right">Sent on {msg.timestamp}</p>
                    </div>
                  </div>
                ) : (
                  <div className="grid grid-cols-2">
                    <div
                      key={index}
                      className="message border-solid border-2 border-blue-200 overflow-hidden break-words rounded-lg p-2 m-2 bg-white"
                    >
                     <b> {msg.sender_name}</b>: {msg.content} <br></br> <span className="text-gray-600">Sent on {msg.timestamp}</span>
                    </div>
                    <div></div>
                  </div>
                )
              )}
            </div>
            <footer className="flex mt-auto col-start-1 col-end-3 row-start-6 justify-items-center text-center items-center">
              {}
              <form onSubmit={handleSubmit} className="w-full flex">
                <input
                  type="text"
                  id="message_tag"
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-3/4 p-2.5 ml-2 mb-2 mr-2"
                  placeholder="Message"
                  required
                  value={messageText}
                  onChange={handleMessageChange}

                />
                <button
                  type="submit"
                  className="text-white bg-blue-200 hover:bg-blue-500 font-medium rounded text-sm w-1/4 px-5 py-2.5 mr-2 mb-2 text-center"
                >
                  Send
                </button>
              </form>
            </footer>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Messaging;
