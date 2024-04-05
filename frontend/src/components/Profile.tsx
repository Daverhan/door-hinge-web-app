import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

function Profile() {
  const navigate = useNavigate();

  const navigateTo = (path: string) => () => {
    navigate(path);
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
      <div className="font-semibold text-xl m-2">
        <p>Username: {data.username}</p>
        <p>
          Name: {data.first_name} {data.last_name}
        </p>
        <p>ID: {data.id}</p>
        <button className="flex justify-center bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded w-full"
          onClick={navigateTo("/EditProfile")}>
          Account Settings
        </button>
      </div>
    </section>
  );
}

export default Profile;
