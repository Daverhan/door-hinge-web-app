import { Carousel } from "@material-tailwind/react";
import Home_1 from "../assets/1.jpg";
import Home_2 from "../assets/2.jpg";
import Home_3 from "../assets/3.jpg";

function Home() {
  return (
    <section className="h-screen pt-16">
      <div className="flex flex-col lg:grid lg:grid-cols-[32%_36%_32%] 3xl:grid-cols-[1fr_691px_1fr] h-full">
        <div className="hidden lg:flex h-full w-full justify-center items-center bg-blue-100">
          <p className="break-words mx-4">
            This section can be used to filter for properties
          </p>
        </div>
        <div className="grid grid-rows-[47.5%_40%_12.5%] lg:grid-rows-[45%_45%_10%] h-full">
          <div>
            <Carousel
              className="z-0"
              placeholder={<p className="text-3xl">Loading...</p>}
            >
              <img
                src={Home_1}
                alt="image 1"
                className="h-full w-full object-fill"
              />
              <img
                src={Home_2}
                alt="image 2"
                className="h-full w-full object-fill"
              />
              <img
                src={Home_3}
                alt="image 3"
                className="h-full w-full object-fill"
              />
            </Carousel>
          </div>
          <div className="flex flex-col bg-green-300 pl-2 pt-2 items-left overflow-hidden break-words">
            <p>Listing posted by: David Silva</p>
            <p>Address: 1609 Wonderful Ave, Tallahassee FL, 31010</p>
            <p>Price: $350,000</p>
            <p className="my-2">
              Lovely home waiting for an owner! The location offers an action
              packed experience in Tallahassee! More random text here.
            </p>
            <p>4 BED / 2 BATH</p>
            <p>2504 SQFT</p>
          </div>
          <div className="flex justify-evenly items-center bg-orange-300">
            <p className="text-3xl">No</p>
            <p className="text-3xl">Yes</p>
          </div>
        </div>
        <div className="hidden lg:flex h-full w-full justify-center items-center bg-blue-100">
          <p className="break-words mx-4">
            This section can be used to directly message the lister
          </p>
        </div>
      </div>
    </section>
  );
}

export default Home;
