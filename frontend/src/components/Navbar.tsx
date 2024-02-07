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

  return (
    <section className="grid grid-cols-[30%_40%_30%] h-16 bg-white fixed w-full top-0 z-10">
      <div></div>

      <div className="m-auto">
        <button onClick={navigateTo("/")} className="font-bold text-3xl">
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
          <button onClick={navigateTo("/profile")} className="p-4">
            Profile
          </button>
          <button onClick={navigateTo("/favorites")} className="p-4">
            Favorites
          </button>
          <button onClick={navigateTo("/messages")} className="p-4">
            Messages
          </button>
        </div>

        {/* Desktop Menu */}
        <div className="hidden lg:flex lg:justify-evenly lg:items-center lg:h-full lg:text-xl">
          <button
            onClick={navigateTo("/profile")}
            className="p-4 hover:text-gray-400"
          >
            Profile
          </button>
          <button
            onClick={navigateTo("/favorites")}
            className="p-4 hover:text-gray-400"
          >
            Favorites
          </button>
          <button
            onClick={navigateTo("/messages")}
            className="p-4 hover:text-gray-400"
          >
            Messages
          </button>
        </div>
      </div>
    </section>
  );
}

export default Navbar;
