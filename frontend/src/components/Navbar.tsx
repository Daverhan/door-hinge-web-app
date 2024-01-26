import { RxHamburgerMenu } from "react-icons/rx";

function Navbar() {
  return (
    <section className="grid grid-cols-[30%_40%_30%] h-16 w-screen">
      <div></div>
      <div className="m-auto">
        <h1 className="font-bold text-3xl">DoorHinge</h1>
      </div>
      <div className="text-4xl m-auto">
        <div className="lg:hidden">
          <RxHamburgerMenu />
        </div>
        <div className="hidden lg:flex gap-5 lg:text-xl">
          <p>Messages</p>
          <p>Favorites</p>
          <p>Profile</p>
        </div>
      </div>
    </section>
  );
}

export default Navbar;
