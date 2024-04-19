import { useEffect, useState } from "react";

function Messaging() {
  const [messageText, setMessageText] = useState('');
  const [messages, setMessages] = useState([]);
 // const socket = useRef(null);

  const handleMessageChange = (event) => {
    setMessageText(event.target.value);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    if (messageText.trim()) {
      setMessages([...messages, messageText.trim()]);
      setMessageText(''); 
    }
  };

  return (
    <section className="bg-blue-100 h-screen pt-16">
      <div className="grid grid-cols-6 divide-x h-screen-adjusted">
        <div className="grid grid-cols-1 col-start-1 col-end-3 h-screen-adjusted w-100">
          <div className="flex overflow-auto row-start-1 row-end-2 col-start-1 col-end-2 justify-items-center justify-center text-center items-center">
            contacts will appear here
          </div>
        </div>
        <div className="flex justify-evenly items-center bg-white row-span-2 col-start-3 col-end-7">
          <div className="grid items grid-cols-2 grid-rows-6 w-full h-full space-x-0 space-y-0">
            <header className="flex bg-blue-gray-50 col-start-1 col-end-3 justify-items-center justify-center text-center items-center mt-0 h-1/2">
              Messaging [Contact.Name]
            </header>
            <div className="max-h-96 flex flex-col overflow-auto row-start-2 row-end-6 col-start-1 col-end-3 border border-gray-500 shadow-lg">
              {messages.map((msg, index) => (
                <div key={index} className="message border-solid border-2 border-gray-200 h-24 w-52 p-2 m-2 bg-white">{msg}</div>
              ))}
            </div>
            <footer className="flex bg-green-50 mt-auto col-start-1 col-end-3 row-start-6 justify-items-center text-center items-center">
              {}
              <form onSubmit={handleSubmit} className="w-full flex">
                <input 
                  type="text" 
                  id="message_tag" 
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-3/4 p-2.5 mr-2" 
                  placeholder="Message" 
                  required 
                  value={messageText}
                  onChange={handleMessageChange}
                />
                <button 
                  type="submit" 
                  className="text-white bg-blue-200 hover:bg-blue-500 font-medium rounded text-sm w-1/4 px-5 py-2.5 text-center">
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

