import { useState, useEffect } from "react";

function Profile() {
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
      </div>
    </section>
  );
}

export default Profile;
