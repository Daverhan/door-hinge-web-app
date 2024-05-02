import { useEffect, useState, useRef } from "react";
import { Carousel } from "@material-tailwind/react";
import { useNavigate } from "react-router-dom";
import { User, Listing, FilterFields } from "../interfaces";
import NoListingsFoundImage from "../assets/no-listings.webp";
import KrustyKrabAd from "../assets/KrustyKrab.jpg";

import { io, Socket } from "socket.io-client";
import { Chat, Message } from "../interfaces.ts";


function Home() {
  const [listing, setListing] = useState<Listing | null>(null);
  const [lister, setLister] = useState<User | null>(null);
  const [noListingsAlert, setNoListingsAlert] = useState(false);
  const [invalidFiltersAlert, setInvalidFiltersAlert] = useState(false);
  const [carouselKey, setCarouselKey] = useState(0);
  const [displayNoListingsImage, setDisplayNoListingsImage] = useState(false);
  const [filterFields, setFilterFields] = useState<FilterFields>({
    min_price: 0,
    max_price: 0,
    min_sqft: 0,
    max_sqft: 0,
    min_beds: 0,
    max_beds: 0,
    min_baths: 0,
    max_baths: 0,
    zip_code: 0,
  });

  const [messages, setMessages] = useState<Message[]>([]);
  const messageEndRef = useRef<HTMLDivElement | null>(null);

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


  useEffect(() => {
    if (messageEndRef.current) {
      messageEndRef.current.scrollTo(0, messageEndRef.current.scrollHeight);
    }
  }, [messages]);

  const handleMessageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setMessageText(event.target.value);
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
  };

  const navigate = useNavigate();

  const getNextListing = async (e?: React.FormEvent<HTMLFormElement>) => {
    if (e) {
      e.preventDefault();
    }

    if (
      filterFields.min_price > filterFields.max_price ||
      filterFields.min_sqft > filterFields.max_sqft ||
      filterFields.min_beds > filterFields.max_beds ||
      filterFields.min_baths > filterFields.max_baths
    ) {
      setInvalidFiltersAlert(true);
      setListing(null);
      setLister(null);
      setDisplayNoListingsImage(true);
      return;
    } else {
      setInvalidFiltersAlert(false);
      setDisplayNoListingsImage(false);
    }

    const filterFieldsToSend = {};

    if (filterFields.max_price != 0) {
      Object.assign(filterFieldsToSend, {
        min_price: filterFields.min_price,
        max_price: filterFields.max_price,
      });
    }
    if (filterFields.max_sqft != 0) {
      Object.assign(filterFieldsToSend, {
        min_sqft: filterFields.min_sqft,
        max_sqft: filterFields.max_sqft,
      });
    }
    if (filterFields.max_beds != 0) {
      Object.assign(filterFieldsToSend, {
        min_beds: filterFields.min_beds,
        max_beds: filterFields.max_beds,
      });
    }
    if (filterFields.max_baths != 0) {
      Object.assign(filterFieldsToSend, {
        min_baths: filterFields.min_baths,
        max_baths: filterFields.max_baths,
      });
    }
    if (filterFields.zip_code != 0) {
      Object.assign(filterFieldsToSend, {
        zip_code: filterFields.zip_code,
      });
    }

    const filter_settings_content = { ...filterFieldsToSend };
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
      setListing(null);
      setLister(null);
      setDisplayNoListingsImage(true);
      return;
    }

    if (listing_data_json.code === "NO_AVAILABLE_FILTERED_LISTINGS") {
      setInvalidFiltersAlert(true);
      setListing(null);
      setLister(null);
      setDisplayNoListingsImage(true);
      return;
    }

    setInvalidFiltersAlert(false);

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
        <div className="absolute w-full">
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
      {invalidFiltersAlert ? (
        <div className="absolute w-full">
          <div
            className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative"
            role="alert"
          >
            <strong className="font-bold">Invalid Filter Settings. </strong>
            <span className="block sm:inline">
              Either no listings matched the criteria entered or the minimum
              value is higher than the maximum value (unless both are 0,
              denoting no filter).
            </span>
          </div>
        </div>
      ) : null}
      <div className="flex flex-col lg:grid lg:grid-cols-[32%_36%_32%] 3xl:grid-cols-[1fr_691px_1fr] h-screen-adjusted">
        <div className="hidden lg:flex lg:flex-col gap-8 h-full w-full p-3 bg-blue-100 items-center">
          <p className="text-center text-2xl">Filter Properties</p>
          <form onSubmit={getNextListing}>
            <div className="grid grid-cols-[30%_70%] mr-14 xl:mr-20 gap-y-12">
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
              <label className="text-end">Zip Code: </label>
              <div>
                <input
                  value={filterFields.zip_code}
                  onChange={(e) => {
                    setFilterFields({
                      ...filterFields,
                      zip_code: parseInt(e.target.value) || 0,
                    });
                  }}
                  className="ml-1 w-24"
                ></input>
              </div>
            </div>
            <div className="flex justify-center xl:gap-4 mt-10">
              <button
                onClick={() => {
                  getNextListing();
                }}
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold text-xl py-2 px-4 rounded-full p-2 mx-2 w-36"
              >
                Apply
              </button>
              <button
                type="button"
                onClick={() => {
                  const resetFields = Object.keys(filterFields).reduce(
                    (acc: FilterFields, key) => {
                      acc[key as keyof FilterFields] = 0;
                      return acc;
                    },
                    {} as FilterFields
                  );

                  setFilterFields(resetFields);
                }}
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold text-xl py-2 px-4 rounded-full p-2 mx-2 w-36"
              >
                Reset
              </button>
            </div>
          </form>
        </div>
        <div className="grid grid-rows-[47.5%_40%_12.5%] lg:grid-rows-[45%_45%_10%] h-screen-adjusted">
          {listing ? (
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
                      className="h-full w-full"
                    />
                  ))}
                </Carousel>
              ) : null}
            </div>
          ) : displayNoListingsImage ? (
            <div>
              <img
                className="mt-16 lg:mt-8 w-full h-full"
                src={NoListingsFoundImage}
              />
            </div>
          ) : (
            <div></div>
          )}

          {listing ? (
            <div className="flex flex-col bg-green-200 pl-2 pt-2 items-left overflow-hidden break-words">
              <p>
                Listing posted by: {lister?.first_name} {lister?.last_name}
              </p>
              <p>
                Address: {listing?.addresses[0].house_num}{" "}
                {listing?.addresses[0].street_name},{" "}
                {listing?.addresses[0].city}, {listing?.addresses[0].state}{" "}
                {listing?.addresses[0].zip_code}
              </p>
              <p>Price: ${listing?.price}</p>
              <p className="my-2">{listing?.desc}</p>
              <p>
                {listing?.num_beds} BED / {listing?.num_baths} BATH
              </p>
              <p>{listing?.sqft} SQFT</p>
            </div>
          ) : (
            <div className="flex flex-col bg-green-200 pl-2 pt-2 items-left overflow-hidden break-words"></div>
          )}
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
        <div>
          <img
            className="w-full h-screen-adjusted"
            src={KrustyKrabAd}
          />
        </div>
      </div>
    </section>
  );
}

export default Home;
