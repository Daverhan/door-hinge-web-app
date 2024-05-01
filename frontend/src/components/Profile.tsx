import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";

function Profile() {
  const formRef = useRef<HTMLFormElement>(null);
  const navigate = useNavigate();

  const navigateTo = (path: string) => () => {
    navigate(path);
  };

  const [data, setData] = useState({
    first_name: "",
    last_name: "",
    username: "",
    id: "",
    email: "",
  });

  useEffect(() => {
    fetch("/api/users/profile")
      .then((res) => res.json())
      .then((jsonData) => {
        setData(jsonData);
      });
  }, []);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    if (!formRef.current) {
      return;
    }

    e.preventDefault();

    const formData = new FormData(formRef.current);

    const formValues = {
      first_name: formData.get("first-name"),
      last_name: formData.get("last-name"),
      username: formData.get("username"),
      email: formData.get("email")
    };


    fetch("/api/users/delete", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formValues),
    }).then((response) => {
      // if (response.status === 409) {
      //   setError409Flag(true);
      // }
      if (response.ok) {
        navigate("/goodbye");
      }
      // else {
      //   setServerErrorFlag(true);
      // }
    });
  }

  return (
    <section className="pt-16">
      <form
        onSubmit={handleSubmit}>
        <div className="font-semibold text-xl m-2">
          <p>Username: {data.username}</p>
          <p>
            Name: {data.first_name} {data.last_name}
          </p>
          <p>ID: {data.id}</p>
          <p>Email: {data.email}</p>
          <div className="flex flex-row justify-center space-x-4">
            <button className="flex justify-center bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded w-full"
              onClick={navigateTo("/edit-profile")}>
              Account Settings
            </button>
            <button className="flex justify-center bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded w-full"
              onClick={navigateTo("/reset-password")}>
              Reset Password
            </button>
            <button className="flex justify-center bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded w-full">
              Delete Account
            </button>
          </div>
        </div>
      </form>
    </section >
  );
}

export default Profile;
