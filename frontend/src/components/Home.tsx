import { useEffect, useState } from "react";
import { Carousel } from "@material-tailwind/react";
import { useNavigate } from "react-router-dom";

interface Address {
  id: number;
  listing_id: number;
  house_num: number;
  street_name: string;
  city: string;
  state: string;
  zip_code: number;
}

interface Image {
  id: number;
  path: string;
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
  images: Image[];
}

interface User {
  first_name: string;
  last_name: string;
}

function Home() {
  const [listing, setListing] = useState<Listing | null>(null);
  const [lister, setLister] = useState<User | null>(null);
  const [noListingsAlert, setNoListingsAlert] = useState(false);
  const [invalidFiltersAlert, setInvalidFiltersAlert] = useState(false);
  const [carouselKey, setCarouselKey] = useState(0);
  const [filterFields, setFilterFields] = useState({
    min_price: 0,
    max_price: 0,
    min_sqft: 0,
    max_sqft: 0,
    min_beds: 0,
    max_beds: 0,
    min_baths: 0,
    max_baths: 0,
  });

  const navigate = useNavigate();

  const getNextListing = async () => {
    const filter_settings_content = { ...filterFields };
    const listing_response = await fetch("/api/listings/next-listing", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(filter_settings_content),
    });

    let listing_data_json = await listing_response.json();

    if (listing_data_json.code === "NO_AVAILABLE_LISTINGS") {
      setNoListingsAlert(true);
      return;
    }

    if (listing_response.ok) {
      const listing = listing_data_json as Listing;
      setListing(listing);

      const lister_response = await fetch(`/api/users/${listing?.user_id}`);

      if (lister_response.ok) {
        setLister((await lister_response.json()) as User);
        setCarouselKey((prevKey) => (prevKey + 1) % 10);
      }
    }
  };

  const favoriteListing = async () => {
    const request_content = {
      listing_id: listing?.id,
    };

    const response = await fetch(`/api/users/favorite-listings`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(request_content),
    });

    if (response.ok) {
      getNextListing();
    }
  };

  const passListing = async () => {
    const request_content = {
      listing_id: listing?.id,
    };

    const response = await fetch(`/api/users/passed-listings`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(request_content),
    });

    if (response.ok) {
      getNextListing();
    }
  };

  useEffect(() => {
    getNextListing();
  }, []);

  return (
    <section className="h-screen pt-16">
      {noListingsAlert ? (
        <div className="absolute w-full z-10">
          <div
            id="alert-border-1"
            className="flex items-center p-4 mb-4 text-blue-800 border-t-4 border-blue-300 bg-blue-50 dark:text-blue-400 dark:bg-gray-800 dark:border-blue-800"
            role="alert"
          >
            <svg
              className="flex-shrink-0 w-4 h-4"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5ZM9.5 4a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3ZM12 15H8a1 1 0 0 1 0-2h1v-3H8a1 1 0 0 1 0-2h2a1 1 0 0 1 1 1v4h1a1 1 0 0 1 0 2Z" />
            </svg>
            <div className="ms-3 text-md lg:text-lg font-medium">
              No more available listings. Meanwhile, check out your favorited
              listings{" "}
              <button
                onClick={() => {
                  navigate("/favorites");
                }}
                className="font-semibold underline hover:no-underline"
              >
                here.
              </button>
            </div>
          </div>
        </div>
      ) : null}
      <div className="flex flex-col lg:grid lg:grid-cols-[32%_36%_32%] 3xl:grid-cols-[1fr_691px_1fr] h-screen-adjusted">
        <div className="hidden lg:flex lg:flex-col gap-12 h-full w-full p-3 bg-blue-100 items-center">
          <p className="text-center text-2xl">Filter Properties</p>
          <div className="grid grid-cols-[15%_85%]">
            <label className="text-end">Price: </label>
            <div className="flex">
              <input
                value={filterFields.min_price}
                onChange={(e) => {
                  setFilterFields({
                    ...filterFields,
                    min_price: parseInt(e.target.value) || 0,
                  });
                }}
                className="ml-1 w-24"
              ></input>
              <p className="mx-2">TO</p>
              <input
                value={filterFields.max_price}
                onChange={(e) => {
                  setFilterFields({
                    ...filterFields,
                    max_price: parseInt(e.target.value) || 0,
                  });
                }}
                className="w-24"
              ></input>
            </div>
          </div>
          <div className="grid grid-cols-[15%_85%]">
            <label className="text-end">SQFT: </label>
            <div className="flex">
              <input
                value={filterFields.min_sqft}
                onChange={(e) => {
                  setFilterFields({
                    ...filterFields,
                    min_sqft: parseInt(e.target.value) || 0,
                  });
                }}
                className="ml-1 w-24"
              ></input>
              <p className="mx-2">TO</p>
              <input
                value={filterFields.max_sqft}
                onChange={(e) => {
                  setFilterFields({
                    ...filterFields,
                    max_sqft: parseInt(e.target.value) || 0,
                  });
                }}
                className="w-24"
              ></input>
            </div>
          </div>
          <div className="grid grid-cols-[15%_85%]">
            <label className="text-end">Beds: </label>
            <div className="flex">
              <input
                value={filterFields.min_beds}
                onChange={(e) => {
                  setFilterFields({
                    ...filterFields,
                    min_beds: parseInt(e.target.value) || 0,
                  });
                }}
                className="ml-1 w-24"
              ></input>
              <p className="mx-2">TO</p>
              <input
                value={filterFields.max_beds}
                onChange={(e) =>
                  setFilterFields({
                    ...filterFields,
                    max_beds: parseInt(e.target.value) || 0,
                  })
                }
                className="w-24"
              ></input>
            </div>
          </div>
          <div className="grid grid-cols-[15%_85%]">
            <label className="text-end">Baths: </label>
            <div className="flex">
              <input
                value={filterFields.min_baths}
                onChange={(e) => {
                  setFilterFields({
                    ...filterFields,
                    min_baths: parseInt(e.target.value) || 0,
                  });
                }}
                className="ml-1 w-24"
              ></input>
              <p className="mx-2">TO</p>
              <input
                value={filterFields.max_baths}
                onChange={(e) => {
                  setFilterFields({
                    ...filterFields,
                    max_baths: parseInt(e.target.value) || 0,
                  });
                }}
                className="w-24"
              ></input>
            </div>
          </div>
        </div>
        <div className="grid grid-rows-[47.5%_40%_12.5%] lg:grid-rows-[45%_45%_10%] h-screen-adjusted">
          <div>
            {listing?.images ? (
              <Carousel
                key={carouselKey}
                loop={true}
                className="z-0"
                placeholder={<p className="text-3xl">Loading...</p>}
              >
                {listing?.images.map((image) => (
                  <img
                    key={image.id}
                    src={import.meta.env.VITE_API_TARGET + image.path}
                    alt={`image ${image.id}`}
                    className="object-cover h-full w-full"
                  />
                ))}
              </Carousel>
            ) : null}
          </div>
          <div className="flex flex-col bg-green-200 pl-2 pt-2 items-left overflow-hidden break-words">
            <p>
              Listing posted by: {lister?.first_name} {lister?.last_name}
            </p>
            <p>
              Address: {listing?.addresses[0].house_num}{" "}
              {listing?.addresses[0].street_name}, {listing?.addresses[0].city},{" "}
              {listing?.addresses[0].state} {listing?.addresses[0].zip_code}
            </p>
            <p>Price: ${listing?.price}</p>
            <p className="my-2">{listing?.desc}</p>
            <p>
              {listing?.num_beds} BED / {listing?.num_baths} BATH
            </p>
            <p>{listing?.sqft} SQFT</p>
          </div>
          <div className="flex justify-evenly items-center bg-orange-300">
            <button
              onClick={passListing}
              className="bg-red-500 hover:bg-red-700 text-white font-bold w-full h-full text-2xl"
            >
              Pass
            </button>
            <button
              onClick={favoriteListing}
              className="bg-green-500 hover:bg-green-700 text-white font-bold w-full h-full text-2xl"
            >
              Favorite
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
