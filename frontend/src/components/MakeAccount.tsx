import { useNavigate } from "react-router-dom";

function MakeAccount() {
  const navigate = useNavigate();

  const navigateTo = (path: string) => () => {
    navigate(path);
  };
  return (
    <section className="bg-blue-100 h-screen pt-16">
      <div>
        {/*Mobile Login*/}
        <div
        // classNameName={`lg:hidden text-3xl fixed top-16 bottom-0 left-0 bg-blue-100 w-64 z-10 transition-transform transform ${isOpen ? "translate-x-0" : "-translate-x-full"
        //     }`}
        ></div>
        {/*Desktop Login*/}
        <div className="hidden lg:flex h-full w-full justify-center items-center">
          <form className="w-full max-w-lg py-3 px-5 bg-gray-100 rounded ">
            <div>
              <h1 className="text-4xl font-semibold">Sign Up</h1>
            </div>
            <div>
              <h1 className="text-gray-700 py-1">It's quick and easy</h1>
            </div>
            <div className="py-1"></div>
            <div className="flex flex-wrap -mx-3 mb-6å">
              <div className="w-full px-3">
                <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2">
                  First Name
                </label>
                <input
                  className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                  id="grid-password"
                  type="username"
                ></input>
              </div>
              <div className="w-full px-3">
                <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2">
                  Last Name
                </label>
                <input
                  className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                  id="grid-password"
                  type="username"
                ></input>
              </div>
              <div className="w-full px-3">
                <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2">
                  Email
                </label>
                <input
                  className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                  id="grid-password"
                  type="username"
                ></input>
              </div>
              <div className="w-full px-3">
                <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2">
                  Username
                </label>
                <input
                  className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                  id="grid-password"
                  type="username"
                ></input>
              </div>
              <div className="w-full px-3">
                <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2">
                  Password
                </label>
                <input
                  className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                  id="grid-password"
                  type="password"
                ></input>
              </div>
              <div className="w-full px-3">
                <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2">
                  Select an option
                </label>
                <select
                  className="bg-gray-50 border border-gray-300 text-gray-700 text-sm rounded-lg focus:ring-blue-500
                                 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400
                                  dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                >
                  <option selected>What are you looking for</option>
                  <option>Seeking</option>
                  <option>Selling</option>
                </select>
              </div>
            </div>
            <div className="py-5"></div>
            <div className="px-4"></div>
            <button className="flex justify-center bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded w-full">
              Create new account
            </button>
            <div className="py-1"></div>
          </form>
        </div>
      </div>
    </section>
  );
}

export default MakeAccount;
