import { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

function MakeAccount() {
  const formRef = useRef<HTMLFormElement>(null);
  const [error409Flag, setError409Flag] = useState(false);
  const [emptyInputFlag, setEmptyInputFlag] = useState(false);
  const [serverErrorFlag, setServerErrorFlag] = useState(false);
  const [firstNameTooLong, setfirstNameTooLong] = useState(false);
  const [lastNameTooLong, setLastNameTooLong] = useState(false);
  const [emailTooLong, setEmailTooLong] = useState(false);
  const [usernameTooLong, setUsernameTooLong] = useState(false);
  const [passwordTooLong, setPasswordTooLong] = useState(false);

  const MAX_FIRST_NAME_LENGTH = 64;
  const MAX_LAST_NAME_LENGTH = 64;
  const MAX_EMAIL_LENGTH = 320;
  const MAX_USERNAME_LENGTH = 64;
  const MAX_PASSWORD_LENGTH = 100;

  const navigate = useNavigate();

  const getInputClasses = (isTooLong: boolean) => {
    const baseClasses =
      "appearance-none block w-full bg-gray-200 text-gray-700 border rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white";
    const errorClasses = "border-red-500";
    return `${baseClasses} ${isTooLong ? errorClasses : "border-gray-200"}`;
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

    let inputFieldsTooLong = false;

    if (
      typeof formValues.first_name === "string" &&
      formValues.first_name.length > MAX_FIRST_NAME_LENGTH
    ) {
      setfirstNameTooLong(true);
      inputFieldsTooLong = true;
    } else {
      setfirstNameTooLong(false);
    }

    if (
      typeof formValues.last_name === "string" &&
      formValues.last_name.length > MAX_LAST_NAME_LENGTH
    ) {
      setLastNameTooLong(true);
      inputFieldsTooLong = true;
    } else {
      setLastNameTooLong(false);
    }

    if (
      typeof formValues.email === "string" &&
      formValues.email.length > MAX_EMAIL_LENGTH
    ) {
      setEmailTooLong(true);
      inputFieldsTooLong = true;
    } else {
      setEmailTooLong(false);
    }

    if (
      typeof formValues.username === "string" &&
      formValues.username.length > MAX_USERNAME_LENGTH
    ) {
      setUsernameTooLong(true);
      inputFieldsTooLong = true;
    } else {
      setUsernameTooLong(false);
    }

    if (
      typeof formValues.password === "string" &&
      formValues.password.length > MAX_PASSWORD_LENGTH
    ) {
      setPasswordTooLong(true);
      inputFieldsTooLong = true;
    } else {
      setPasswordTooLong(false);
    }

    if (inputFieldsTooLong) return;

    fetch("/api/users", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formValues),
    }).then((response) => {
      if (response.status === 409) {
        setError409Flag(true);
      } else if (response.ok) {
        sessionStorage.setItem('username', formValues.username);
        navigate("/home");
      } else {
        setServerErrorFlag(true);
      }
    });
  };

  return (
    <section className="bg-blue-100 h-screen">
      <div>
        <div className="min-h-screen flex w-full justify-center items-center">
          <form
            ref={formRef}
            onSubmit={handleSubmit}
            className="w-full lg:max-w-lg md:max-w-lg max-w-screen py-3 px-5 bg-gray-100 lg:rounded md:rounded"
          >
            <div className="flex justify-center lg:text-left md:text-left text-center flex-col pb-2">
              <h1 className="text-4xl font-semibold">Sign Up</h1>
              <p className="text-gray-700 py-1">It's quick and easy</p>
            </div>
            <div className="flex flex-wrap -mx-3">
              <div className="relative w-full px-3 mb-2">
                {firstNameTooLong && (
                  <div className="absolute top-0 pt-4 w-full text-red-500 text-xs">
                    First name must be less than {MAX_FIRST_NAME_LENGTH}{" "}
                    characters
                  </div>
                )}
                <label
                  htmlFor="first-name"
                  className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-4"
                >
                  First Name
                </label>
                <input
                  className={getInputClasses(firstNameTooLong)}
                  id="first-name"
                  name="first-name"
                  autoComplete="first-name"
                ></input>
              </div>
              <div className="relative w-full px-3 mb-2">
                {lastNameTooLong && (
                  <div className="absolute top-0 pt-4 w-full text-red-500 text-xs">
                    Last name must be less than {MAX_LAST_NAME_LENGTH}{" "}
                    characters
                  </div>
                )}
                <label
                  htmlFor="last-name"
                  className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-4"
                >
                  Last Name
                </label>
                <input
                  className={getInputClasses(lastNameTooLong)}
                  id="last-name"
                  name="last-name"
                ></input>
              </div>
              <div className="relative w-full px-3 mb-2">
                {emailTooLong && (
                  <div className="absolute top-0 pt-4 w-full text-red-500 text-xs">
                    Email must be less than {MAX_EMAIL_LENGTH} characters
                  </div>
                )}
                <label
                  htmlFor="email"
                  className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-4"
                >
                  Email
                </label>
                <input
                  className={getInputClasses(emailTooLong)}
                  id="email"
                  type="email"
                  name="email"
                  autoComplete="email"
                ></input>
              </div>
              <div className="relative w-full px-3 mb-2">
                {usernameTooLong && (
                  <div className="absolute top-0 pt-4 w-full text-red-500 text-xs">
                    Username must be less than {MAX_USERNAME_LENGTH} characters
                  </div>
                )}
                <label
                  htmlFor="username"
                  className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-4"
                >
                  Username
                </label>
                <input
                  className={getInputClasses(usernameTooLong)}
                  id="username"
                  type="username"
                  name="username"
                  autoComplete="username"
                ></input>
              </div>
              <div className="relative w-full px-3 mb-2">
                {passwordTooLong && (
                  <div className="absolute top-0 pt-4 w-full text-red-500 text-xs">
                    Password must be less than {MAX_PASSWORD_LENGTH} characters
                  </div>
                )}
                <label
                  htmlFor="password"
                  className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-4"
                >
                  Password
                </label>
                <input
                  className={getInputClasses(passwordTooLong)}
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
            {serverErrorFlag ? (
              <p className="text-2xl text-center mb-2 text-red-500">
                An Internal Server Error Occurred
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
