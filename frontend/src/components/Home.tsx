import { useEffect, useState } from "react";
import { io } from "socket.io-client";
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

const socket = io("http://127.0.0.1::5001")

function Home() {
  const [listing, setListing] = useState<Listing | null>(null);
  const [lister, setLister] = useState<User | null>(null);
  const [carouselKey, setCarouselKey] = useState(0);
  const [username, setUsername] = useState("");
  const [currentMessage, setCurrentMessage] = useState("");
  const [messages, setMessages] = useState<Array<{ username: string; message: string }>>([]);

  // Connect to WebSocket server
  useEffect(() => {
      socket.on('connect', () => {
          console.log('Connected to WebSocket server');
      });

      // Listening for messages from the server
      socket.on('receive_message', (data) => {
          setMessages((prevMessages) => [...prevMessages, data]);
      });

      return () => {
          socket.off('connect');
          socket.off('receive_message');
      };
  }, []);

  const handleSendMessage = () => {
      if (!currentMessage.trim()) return;
      // Send message to the server
      socket.emit('send_message', { username, message: currentMessage });
      setCurrentMessage("");
  };

  const navigate = useNavigate();

  const getNextListing = async () => {
    const listing_response = await fetch("/api/listings/next-listing");

    let listing_data_json = await listing_response.json();

    if (listing_data_json.code === "NO_AVAILABLE_LISTINGS") {
      navigate("/favorites");
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
      <div className="flex flex-col lg:grid lg:grid-cols-[32%_36%_32%] 3xl:grid-cols-[1fr_691px_1fr] h-screen-adjusted">
        <div className="hidden lg:flex h-full w-full justify-center items-center bg-blue-100">
          <p className="break-words mx-4">
            This section can be used to filter for properties
          </p>
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
          <div className="chat-setup">
            <input
              type="text"
              placeholder="Enter username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="border-2 border-gray-300 p-2 my-2"
            />
            {/* Placeholder for future chat UI */}
          </div>
        </div>
      </div>
    </section>
  );
}

export default Home;
