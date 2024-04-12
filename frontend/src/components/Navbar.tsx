import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { RxHamburgerMenu } from "react-icons/rx";
import { IoClose } from "react-icons/io5";

function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  const navigateTo = (path: string) => () => {
    setIsOpen(false);
    navigate(path);
  };

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  useEffect(() => {
    setIsOpen(false);
  }, []);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setIsOpen(false);
      }
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const handleLogout = () => {
    fetch("api/users/logout", {
      method: "POST",
    }).then((response) => {
      if (response.ok) {
        navigate("/");
      }
    });
  };

  return (
    <section className="grid grid-cols-[30%_40%_30%] lg:grid-cols-[20%_10%_70%] h-16 bg-white fixed w-full top-0 z-10">
      <div className="flex items-center ml-4">
        <button
          onClick={navigateTo("/home")}
          className="font-bold text-3xl hidden lg:flex"
        >
          DoorHinge
        </button>
      </div>

      <div className="m-auto">
        <button
          onClick={navigateTo("/home")}
          className="font-bold text-3xl lg:hidden"
        >
          DoorHinge
        </button>
      </div>

      <div className="h-full text-4xl">
        <div className="lg:hidden flex justify-end items-center w-full h-full pr-5">
          {isOpen ? (
            <IoClose onClick={toggleMenu}></IoClose>
          ) : (
            <RxHamburgerMenu onClick={toggleMenu}></RxHamburgerMenu>
          )}
        </div>

        {/* Mobile Menu */}
        <div
          className={`lg:hidden text-3xl fixed top-16 bottom-0 left-0 bg-blue-100 w-64 z-10 transition-transform transform ${
            isOpen ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          <button onClick={navigateTo("/profile")} className="flex p-3 w-full">
            Profile
          </button>
          <button
            onClick={navigateTo("/create-listing")}
            className="flex p-3 w-full"
          >
            Create Listing
          </button>
          <button
            onClick={navigateTo("/favorites")}
            className="flex p-3 w-full"
          >
            Favorites
          </button>
          <button onClick={navigateTo("/messages")} className="flex p-3 w-full">
            Messages
          </button>
          <button onClick={handleLogout} className="flex p-3 w-full">
            Logout
          </button>
        </div>

        {/* Desktop Menu */}
        <div className="hidden lg:flex lg:justify-end lg:items-center lg:h-full lg:text-xl gap-8">
          <button
            onClick={navigateTo("/profile")}
            className="hover:text-gray-400"
          >
            Profile
          </button>
          <button
            onClick={navigateTo("/create-listing")}
            className="hover:text-gray-400"
          >
            Create Listing
          </button>
          <button
            onClick={navigateTo("/favorites")}
            className="hover:text-gray-400"
          >
            Favorites
          </button>
          <button
            onClick={navigateTo("/messages")}
            className="hover:text-gray-400"
          >
            Messages
          </button>
          <button onClick={handleLogout} className="mr-8 hover:text-gray-400">
            Logout
          </button>
        </div>
      </div>
    </section>
  );
}

export default Navbar;
