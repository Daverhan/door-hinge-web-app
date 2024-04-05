import { useRef, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

function ResetPassword() {
    const formRef = useRef<HTMLFormElement>(null);

    const navigate = useNavigate();

    const navigateTo = (path: string) => () => {
        navigate(path);
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        if (!formRef.current) {
            return;
        }
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
                            <h1 className="text-4xl font-semibold">Reset Password</h1>
                        </div>
                        <div className="flex flex-wrap -mx-3">
                            <div className="w-full px-3">
                                <label
                                    htmlFor="first-name"
                                    className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
                                >
                                    Password
                                </label>
                                <input
                                    className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                                    type="password"
                                ></input>
                            </div>
                            <div className="w-full px-3">
                                <label
                                    htmlFor="last-name"
                                    className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
                                >
                                    Confirm Password
                                </label>
                                <input
                                    className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                                    type="password"
                                ></input>
                            </div>
                        </div>
                        <button className="flex justify-center bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded w-full"
                            onClick={navigateTo("/Profile")}>
                            Save Changes
                        </button>
                        <div className="py-1"></div>
                    </form>
                </div>
            </div >
        </section >
    );
}

export default ResetPassword;
