import { useState, useEffect } from "react";
import { RxHamburgerMenu } from "react-icons/rx";
import { IoClose } from "react-icons/io5";

function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

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
    <section className="grid grid-cols-[30%_40%_30%] h-16 bg-white fixed w-full top-0">
      <div></div>

      <div className="m-auto">
        <h1 className="font-bold text-3xl">DoorHinge</h1>
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
          <p className="p-4">Profile</p>
          <p className="p-4">Favorites</p>
          <p className="p-4">Messages</p>
        </div>

        {/* Desktop Menu */}
        <div className="hidden lg:flex lg:justify-evenly lg:items-center lg:h-full lg:text-xl">
          <p>Messages</p>
          <p>Favorites</p>
          <p>Profile</p>
        </div>
      </div>
    </section>
  );
}

export default Navbar;
