function Messaging() {
  /*
  TODO: FIX RESIZE OF MESSAGING FLEX
  */

  return (
    <section className="bg-blue-100 h-screen pt-16">
      <div className="grid grid-cols-6 divide-x w-screen-adjusted h-screen-adjusted">
        <div className="grid grid-cols-1 col-start-1 col-end-3 h-screen-adjusted w-100">
          <div
            id="contacts_list"
            className="flex overflow-auto row-start-1 row-end-2 col-start-1 col-end-2 justify-items-center justify-center text-center items-center"
          >
            Contacts will appear here.
          </div>
        </div>
        <div className="flex justify-evenly items-center bg-white row-span-2 col-start-3 col-end-7">
          <div className="grid items grid-cols-2 grid-rows-6 w-full h-full space-x-0 space-y-0">
            <header
              id="current_contact"
              className="flex bg-blue-gray-50 col-start-1 col-end-3 justify-items-center justify-center text-center items-center mt-0 h-1/2"
            >
              Messaging [Contact.Name]
            </header>
            <div
              id="dialogue_box"
              className="flex overflow-auto row-start-2 row-end-6 col-start-1 col-end-3 justify-items-center text-center items-center"
            >
              Messages will appear here.
            </div>
            <footer className="flex bg-green-50 mt-auto col-start-1 col-end-3 row-start-6 justify-items-center text-center items-center">
              <input
                type="text"
                id="message_text"
                className="bg-gray-50 border border-gray-200 text rounded w-3/4 p-2.5"
                placeholder="Message"
                required
              />
              <button
                type="submit"
                id="message_submit"
                className="text-white bg-blue-200 hover:bg-blue-500 font-medium rounded w-1/4 px-5 py-2.5 text-center"
              >
                Send
              </button>
            </footer>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Messaging;
