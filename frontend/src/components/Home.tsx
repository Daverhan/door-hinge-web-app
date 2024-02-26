import { useEffect, useState } from "react";
import { Carousel } from "@material-tailwind/react";
import Home_1 from "../assets/1.jpg";
import Home_2 from "../assets/2.jpg";
import Home_3 from "../assets/3.jpg";

interface Address {
  id: number;
  listing_id: number;
  house_num: number;
  street_name: string;
  city: string;
  state: string;
  zip_code: number;
}

interface Listing {
  id: number;
  user_id: number;
  name: string;
  desc: string;
  price: number;
  num_beds: number;
  num_baths: number;
  sqft: number;
  addresses: Address[];
}

interface User {
  first_name: string;
  last_name: string;
}

function Home() {
  const [listingData, setListingData] = useState<Listing | null>(null);
  const [listerData, setListerData] = useState<User | null>(null);
  const [index, setIndex] = useState(0);
  const listingIds = [1, 3, 4, 5, 6, 7];

  const getNextIndex = () => {
    const nextIndex = (index + 1) % 6;
    setIndex(nextIndex);
  };

  useEffect(() => {
    try {
      fetch(`/api/listings/${listingIds[index]}`)
        .then((response) => response.json())
        .then((json) => setListingData(json as Listing));
    } catch (error) {
      console.error("Failed to fetch listing: ", error);
    }
  }, [index]);

  useEffect(() => {
    if (listingData) {
      try {
        fetch(`/api/users/${listingData?.user_id}`)
          .then((response) => response.json())
          .then((json) => setListerData(json as User));
      } catch (error) {
        console.error("Failed to fetch lister: ", error);
      }
    }
  }, [listingData]);

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
            <p>
              Listing posted by: {listerData?.first_name}{" "}
              {listerData?.last_name}
            </p>
            <p>
              Address: {listingData?.addresses[0].house_num}{" "}
              {listingData?.addresses[0].street_name},{" "}
              {listingData?.addresses[0].state},{" "}
              {listingData?.addresses[0].zip_code}
            </p>
            <p>Price: ${listingData?.price}</p>
            <p className="my-2">{listingData?.desc}</p>
            <p>
              {listingData?.num_beds} BED / {listingData?.num_baths} BATH
            </p>
            <p>{listingData?.sqft} SQFT</p>
          </div>
          <div className="flex justify-evenly items-center bg-orange-300">
            <button onClick={getNextIndex} className="text-3xl">
              No
            </button>
            <button onClick={getNextIndex} className="text-3xl">
              Yes
            </button>
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
