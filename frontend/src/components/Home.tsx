import { Carousel } from "@material-tailwind/react";
import Home_1 from "../assets/1.jpg";
import Home_2 from "../assets/2.jpg";
import Home_3 from "../assets/3.jpg";

function Home() {
  return (
    <section className="bg-blue-100 h-screen pt-16">
      <div className="flex flex-col lg:grid lg:grid-cols-[25%_50%_25%] h-full">
        <div className="hidden lg:flex h-full w-full justify-center items-center">
          <p className="break-words mx-4">
            This section can be used to filter for properties
          </p>
        </div>
        <div className="grid grid-rows-[52.5%_32.5%_15%] lg:grid-rows-[62.5%_27.5%_10%] h-full">
          <div>
            <Carousel
              className="z-0"
              placeholder={<p className="text-3xl">Loading...</p>}
            >
              <img
                src={Home_1}
                alt="image 1"
                className="h-full w-full object-cover"
              />
              <img
                src={Home_2}
                alt="image 2"
                className="h-full w-full object-cover"
              />
              <img
                src={Home_3}
                alt="image 3"
                className="h-full w-full object-cover"
              />
            </Carousel>
          </div>
          <div className="flex flex-col bg-green-300 pl-2 pt-2 items-left overflow-hidden break-words">
            <p>Lister's Name: David Silva</p>
            <p>Listing's Price: $350,000</p>
            <br></br>
            <p>4BED/2BATH LOVELY HOME</p>
          </div>
          <div className="flex justify-evenly items-center bg-orange-300">
            <p className="text-3xl">No</p>
            <p className="text-3xl">Yes</p>
          </div>
        </div>
        <div className="hidden lg:flex h-full w-full justify-center items-center">
          <p className="break-words mx-4">
            This section can be used to directly message the lister
          </p>
        </div>
      </div>
    </section>
  );
}

export default Home;
