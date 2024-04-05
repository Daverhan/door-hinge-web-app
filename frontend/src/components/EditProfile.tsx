import { useRef, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

function EditProfile() {
    const formRef = useRef<HTMLFormElement>(null);
    const [error409Flag, setError409Flag] = useState(false);
    const [emptyInputFlag, setEmptyInputFlag] = useState(false);

    const navigate = useNavigate();

    const navigateTo = (path: string) => () => {
        navigate(path);
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        if (!formRef.current) {
            return;
        }

        let emptyInputFields = false;
        e.preventDefault();

        const formData = new FormData(formRef.current);

        const formValues = {
            first_name: formData.get("first-name"),
            last_name: formData.get("last-name"),
            username: formData.get("username"),
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
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(formValues),
        }).then((response) => {
            if (response.status === 409) {
                setError409Flag(true);
            } else {
                navigate("/profile");
            }
        });
    };

    const [data, setData] = useState({
        first_name: "",
        last_name: "",
        username: "",
        id: "",
    });

    useEffect(() => {
        fetch("/api/users/profile")
            .then((res) => res.json())
            .then((jsonData) => {
                setData(jsonData);
            });
    }, []);

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
                            <h1 className="text-4xl font-semibold">Your Account</h1>
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
                                    defaultValue={data.first_name}
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
                                    defaultValue={data.last_name}
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
                                    defaultValue={data.username}
                                ></input>
                            </div>
                        </div>
                        {error409Flag ? (
                            <p className="text-2xl text-center mb-2 text-red-500">
                                A user already exists with the provided username
                            </p>
                        ) : null}
                        {emptyInputFlag ? (
                            <p className="text-2xl text-center mb-2 text-red-500">
                                Input fields cannot be empty
                            </p>
                        ) : null}
                        <button className="flex justify-center bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded w-full"
                            onClick={navigateTo("/ResetPassword")}>
                            Reset Password
                        </button>
                        <div className="py-1"></div>
                        <button className="flex justify-center bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded w-full">
                            Save Changes
                        </button>
                        <div className="py-1"></div>
                        <button className="flex justify-center bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded w-full"
                            onClick={navigateTo("/Goodbye")}>
                            Delete Account
                        </button>
                        <div className="py-1"></div>
                    </form>
                </div>
            </div >
        </section >
    );
}

export default EditProfile;
