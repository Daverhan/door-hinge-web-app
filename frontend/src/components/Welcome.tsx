import { useNavigate } from "react-router-dom";

function Welcome() {
  const navigate = useNavigate();

  const navigateTo = (path: string) => () => {
    navigate(path);
  };

  return (
    <section className="relative flex flex-col h-screen items-center text-center bg-blue-100">
      <div>
        <h1 className="text-3xl mt-4">
          Welcome to <strong>DoorHinge</strong>.
        </h1>
        <p className="text-xl mt-2">
          The last application you need to find your dream home.
        </p>
      </div>

      <div className="absolute inset-0 flex items-center justify-center">
        <button
          onClick={navigateTo("/login")}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold text-xl py-2 px-4 rounded-full p-2 mx-2 w-36"
        >
          Log In
        </button>
        <button
          onClick={navigateTo("/makeaccount")}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold text-xl py-2 px-4 rounded-full p-2 mx-2 w-36">
          Sign Up
        </button>
      </div>
    </section>
  );
}

export default Welcome;
