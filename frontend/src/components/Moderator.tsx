import { useEffect, useState } from "react";
import Navbar from "./Navbar";

function Moderator() {
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [htmlContent, setHtmlContent] = useState("");

  useEffect(() => {
    fetch("/api/users/moderator")
      .then((response) => {
        if (response.ok) {
          return response.json();
        }
        return response.text();
      })
      .then((data) => {
        if (typeof data === "string") {
          setHtmlContent(data);
          setIsAuthorized(false);
        } else {
          setIsAuthorized(true);
        }
      })
      .catch((error) => console.error("Error: ", error));
  }, []);

  if (isAuthorized) {
    return (
      <>
        <Navbar />
        <section className="pt-16 h-full min-h-screen bg-blue-100">
          <h1 className="mt-8 text-center text-5xl">You are authorized!</h1>
        </section>
      </>
    );
  } else {
    return <div dangerouslySetInnerHTML={{ __html: htmlContent }} />;
  }
}

export default Moderator;
