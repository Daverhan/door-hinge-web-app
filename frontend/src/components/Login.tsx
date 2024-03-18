import { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

function Login() {
  const formRef = useRef<HTMLFormElement>(null);
  const [error401Flag, setError401Flag] = useState(false);
  const [emptyInputFlag, setEmptyInputFlag] = useState(false);

  const navigate = useNavigate();

  const navigateTo = (path: string) => () => {
    navigate(path);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    if (!formRef.current) {
      return;
    }

    e.preventDefault();

    const formData = new FormData(formRef.current);

    const formValues = {
      username: formData.get("username") as string,
      password: formData.get("password") as string,
    };

    let emptyInputFields = Object.values(formValues).some((value) => !value);

    if (emptyInputFields) {
      setEmptyInputFlag(true);
      setError401Flag(false);
      return;
    }

    const loginUser = async () => {
      const response = await fetch("/api/users/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formValues),
      });

      if (response.status === 401) {
        setError401Flag(true);
        setEmptyInputFlag(false);
      } else if (!response.ok) {
        setEmptyInputFlag(false);
        return;
      } else {
        navigate("/home");
      }
    };

    loginUser();
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
        <div className="hidden lg:flex justify-center items-center">
          <h5 className="text-4xl font-semibold">DoorHinge</h5>
        </div>
        <div className="flex justify-center py-3">
          <p>Find your dream match</p>
        </div>
        <div className="hidden lg:flex h-full w-full justify-center items-center">
          <form
            ref={formRef}
            onSubmit={handleSubmit}
            className="w-full max-w-lg py-3 px-5 bg-gray-100 rounded "
          >
            <div className="flex flex-wrap -mx-3">
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
                  name="username"
                  type="username"
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
            {error401Flag ? (
              <p className="text-2xl text-center mb-2 text-red-500">
                Invalid username or password
              </p>
            ) : null}
            {emptyInputFlag ? (
              <p className="text-2xl text-center mb-2 text-red-500">
                Input fields cannot be empty
              </p>
            ) : null}
            <button className="flex justify-center bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded w-full">
              Log In
            </button>
            <div className="py-1"></div>
            <div>
              <div className="px-4"></div>
              <button
                type="button"
                onClick={navigateTo("/makeaccount")}
                className="flex justify-center bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded w-full"
              >
                Create new account
              </button>
              <div className="px-4"></div>
            </div>
            <div className="py-1"></div>
            <div className="flex justify-center">
              <button type="button" className="text-blue-500 hover:underline">
                Forgot Password?
              </button>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
}

export default Login;
