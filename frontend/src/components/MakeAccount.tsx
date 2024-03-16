import { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

function MakeAccount() {
  const formRef = useRef();
  const [error409Flag, setError409Flag] = useState(false);
  const [emptyInputFlag, setEmptyInputFlag] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = async (e: any) => {
    let emptyInputFields = false;
    e.preventDefault();

    const formData = new FormData(formRef.current);

    const formValues = {
      first_name: formData.get("first-name"),
      last_name: formData.get("last-name"),
      email: formData.get("email"),
      username: formData.get("username"),
      password: formData.get("password"),
    };

    Object.values(formValues).forEach((value) => {
      if (!value) {
        setEmptyInputFlag(true);
        setError409Flag(false);
        emptyInputFields = true;
      }
    });

    if (emptyInputFields) {
      return;
    } else {
      setEmptyInputFlag(false);
    }

    fetch("/api/users", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formValues),
    }).then((response) => {
      if (response.status === 409) {
        setError409Flag(true);
      } else {
        navigate("/home");
      }
    });
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
          <form
            ref={formRef}
            onSubmit={handleSubmit}
            className="w-full max-w-lg py-3 px-5 bg-gray-100 rounded"
          >
            <div className="flex flex-col pb-2">
              <h1 className="text-4xl font-semibold">Sign Up</h1>
              <p className="text-gray-700 py-1">It's quick and easy</p>
            </div>
            <div className="flex flex-wrap -mx-3">
              <div className="w-full px-3">
                <label
                  htmlFor="first-name"
                  className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
                >
                  First Name
                </label>
                <input
                  className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                  id="first-name"
                  name="first-name"
                  autoComplete="first-name"
                ></input>
              </div>
              <div className="w-full px-3">
                <label
                  htmlFor="last-name"
                  className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
                >
                  Last Name
                </label>
                <input
                  className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                  id="last-name"
                  name="last-name"
                ></input>
              </div>
              <div className="w-full px-3">
                <label
                  htmlFor="email"
                  className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
                >
                  Email
                </label>
                <input
                  className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                  id="email"
                  type="email"
                  name="email"
                  autoComplete="email"
                ></input>
              </div>
              <div className="w-full px-3">
                <label
                  htmlFor="username"
                  className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
                >
                  Username
                </label>
                <input
                  className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                  id="username"
                  type="username"
                  name="username"
                  autoComplete="username"
                ></input>
              </div>
              <div className="w-full px-3">
                <label
                  htmlFor="password"
                  className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
                >
                  Password
                </label>
                <input
                  className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                  id="password"
                  name="password"
                  type="password"
                ></input>
              </div>
            </div>
            {error409Flag ? (
              <p className="text-2xl text-center mb-2 text-red-500">
                A user already exists with the provided username or email
              </p>
            ) : null}
            {emptyInputFlag ? (
              <p className="text-2xl text-center mb-2 text-red-500">
                Input fields cannot be empty
              </p>
            ) : null}
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
