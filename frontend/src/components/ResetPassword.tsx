import { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

function ResetPassword() {
    const formRef = useRef<HTMLFormElement>(null);
    const [error409Flag, setError409Flag] = useState(false);
    const [emptyInputFlag, setEmptyInputFlag] = useState(false);
    const [serverErrorFlag, setServerErrorFlag] = useState(false);
    const [dontMatchFlag, setDontMatchFlag] = useState(false);

    const MAX_PASSWORD_LENGTH = 100;


    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        if (!formRef.current) {
            return;
        }

        const formData = new FormData(formRef.current);

        const formValues = {
            password: formData.get("password"),
            duplicate: formData.get("duplicate")
        };

        let emptyInputFields = false;

        Object.values(formValues).forEach((value) => {
            if (!value) {
                setEmptyInputFlag(true);
                emptyInputFields = true;
            }
        });

        if (emptyInputFields) {
            return;
        } else {
            setEmptyInputFlag(false);
        }

        let dontMatch = false;

        if (formValues.password !== formValues.duplicate) {
            setDontMatchFlag(true);
            dontMatch = true;
        }

        if (dontMatch) {
            return;
        } else {
            setDontMatchFlag(false);
        }

        fetch("/api/users/resetpassword", {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(formValues),
        }).then((response) => {
            if (response.status === 409) {
                setError409Flag(true);
            }
            if (response.ok) {
                navigate("/profile");
            }
            else {
                setServerErrorFlag(true);
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
                                    id="password"
                                    name="password"
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
                                    id="duplicate"
                                    name="duplicate"
                                ></input>
                            </div>
                        </div>
                        {/* Flags here */}
                        {emptyInputFlag ? (
                            <p className="text-2xl text-center mb-2 text-red-500">
                                Error: Fields cannot empty
                            </p>
                        ) : null}
                        {dontMatchFlag ? (
                            <p className="text-2xl text-center mb-2 text-red-500">
                                Error: Passwords don't match
                            </p>
                        ) : null}
                        <button className="flex justify-center bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded w-full"
                        // onClick={navigateTo("/Profile")}
                        >
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
