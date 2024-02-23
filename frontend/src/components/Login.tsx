import { useNavigate } from "react-router-dom";

function Login() {
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
                >
                </div>
                {/*Desktop Login*/}
                <div className="hidden lg:flex justify-center items-center">
                    <h5 className="text-4xl font-semibold">
                        DoorHinge
                    </h5>
                </div>
                <div className="flex justify-center py-3">
                    <p>Find your dream match</p>
                </div>
                <div className="hidden lg:flex h-full w-full justify-center items-center">
                    <form className="w-full max-w-lg py-3 px-5 bg-gray-100 rounded ">
                        <div className="flex flex-wrap -mx-3 mb-6å">
                            <div className="w-full px-3">
                                <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2">
                                    Username
                                </label>
                                <input className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white focus:border-gray-500" id="grid-password" type="username"></input>
                            </div>
                            <div className="w-full px-3">
                                <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2">
                                    Password
                                </label>
                                <input className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white focus:border-gray-500" id="grid-password" type="password"></input>
                            </div>
                        </div>
                        <div className="flex justify-center bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
                            <button onClick={navigateTo("/home")}>Log In</button>
                        </div>
                        <div className="py-1"></div>
                        <div>
                            <div className="px-4"></div>
                            <div className="flex justify-center bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded">
                                <button onClick={navigateTo("/makeaccount")}>Create new account</button>
                            </div>
                            <div className="px-4"></div>
                        </div>
                        <div className="py-1"></div>
                        <div className="flex justify-center">
                            <button className="text-blue-500 hover:underline">Forgot Password?</button>
                        </div>
                    </form>
                </div>
            </div>
        </section>
    );
}

export default Login;