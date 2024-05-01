import React, { useEffect } from "react";
import Modal from "./Modal";
import { Listing } from "../interfaces";
//import { Carousel } from "@material-tailwind/react";

function Favorites() {
  const [favorites, setFavorites] = React.useState<Listing[]>([]);
  const [selectedProperty, setSelectedProperty] =
    React.useState<Listing | null>(null);
  const [isModalOpen, setIsModalOpen] = React.useState<boolean>(false);

  const openModal = (property: Listing) => {
    setSelectedProperty(property);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedProperty(null);
  };

  const removeFavorite = async (property_id: number) => {
    const response = await fetch(`/api/users/favorite-listings`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({listing_id: property_id})
    });

    if(response.ok) {
      setFavorites(prevFavorites => prevFavorites.filter(property => property.id !== property_id));
    }
  };

  useEffect(() => {
    fetch("/api/users/favorite-listings")
      .then((res) => res.json())
      .then((listings) => {
        setFavorites(listings);
      });
  }, []);

  return (
    <section className="pt-16 h-full min-h-screen bg-blue-100">
      <div className="p-4">
        <h1 className="text-xl font-semibold lg:text-left md:text-left sm:text-center pb-2">Your Favorites</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {favorites.map((property) => (
            <div
              key={property.id}
              className="border bg-white rounded-lg overflow-hidden shadow-lg"
            >
              <img
                src={import.meta.env.VITE_API_TARGET + property.images[0].path}
                className="h-96 w-full object-cover"
                alt={`image ${property.images[0].id}`}
              />
              <div className="p-4">
                <p className="text-xl font-semibold">
                  {property?.addresses[0].house_num}{" "}
                  {property?.addresses[0].street_name},{" "}
                  {property?.addresses[0].city}, {property?.addresses[0].state}{" "}
                  {property?.addresses[0].zip_code}
                </p>
                <p className="text-gray-600">Realtor: {property.name}</p>
                <p className="text-gray-600">Price: ${property.price}</p>
                <p className="text-gray-600">Bedrooms: {property.num_beds}</p>
                <p className="text-gray-600">Bathrooms: {property.num_baths}</p>
                <button
                  className="mt-2 mr-2 py-2 px-4 bg-blue-500 text-white rounded hover:bg-blue700 transition duration-200"
                  onClick={() => openModal(property)}
                >
                  View Property
                </button>
                <button
                  className="mt-2 py-2 px-4 bg-red-500 text-white rounded hover:bg-red-700 transition duration-200"
                  onClick={() => removeFavorite(property?.id)}
                >
                  Unfavorite
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
      {isModalOpen && selectedProperty && (
        <Modal isOpen={isModalOpen} onClose={closeModal}>
          <div className="modal-content-wrapper">
            <h2 className="modal-location">
              {selectedProperty.addresses[0].house_num}{" "}
              {selectedProperty.addresses[0].street_name},{" "}
              {selectedProperty?.addresses[0].city},{" "}
              {selectedProperty?.addresses[0].state}{" "}
              {selectedProperty?.addresses[0].zip_code}
            </h2>
            {selectedProperty?.images.map((image) => (
              <img
                key={image.id}
                src={import.meta.env.VITE_API_TARGET + image.path}
                alt={`image ${image.id}`}
              />
            ))}
            <p className="modal-title">Realtor: {selectedProperty?.name}</p>
            <p className="modal-price">${selectedProperty?.price}</p>
            <p className="modal-details">
              Bedrooms: {selectedProperty?.num_beds}
            </p>
            <p className="modal-details">
              Bathrooms: {selectedProperty?.num_baths}
            </p>
          </div>
        </Modal>
      )}
    </section>
  );
}
export default Favorites;
