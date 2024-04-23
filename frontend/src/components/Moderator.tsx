import React, { useEffect, useState } from "react";
import Navbar from "./Navbar";
import { Listing } from "../interfaces";
import Modal from "./Modal";

function Moderator() {
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [htmlContent, setHtmlContent] = useState("");
  const [listings, setListings] = React.useState<Listing[]>([]);
  const [selectedProperty, setSelectedProperty] =
    React.useState<Listing | null>(null);
  const [isModalOpen, setIsModalOpen] = React.useState<boolean>(false);

  const openModal = (property: Listing) => {
    setSelectedProperty(property);
    setIsModalOpen(true);
  }

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedProperty(null);
  }

  useEffect(() => {
    fetch("/api/users/moderator")
      .then((response) => {
        if (response.ok) {
          return response.json();
        }
        return response.text();
      })
      .then((data) => {
        if (typeof data === "string") {
          setHtmlContent(data);
          setIsAuthorized(false);
        } else {
          setIsAuthorized(true);
          setListings(data);
        }
      })
      .catch((error) => console.error("Error: ", error));
  }, []);

  if (isAuthorized) {
    return (
      <>
        <Navbar />
        <section className="pt-16 h-full min-h-screen bg-blue-100">
          <div className="p-4">
            <h1 className="text-xl font-semibold pb-2">Moderator Dashboard</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {listings.map((property) => (
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
                  className="mt-2 py-2 px-4 bg-blue-500 text-white rounded hover:bg-blue700 transition duration-200"
                  onClick={() => openModal(property)}
                >
                  View Property
                </button>
              </div>
            </div>
              ))}
            </div>
          </div>
          {isModalOpen && (
            <Modal isOpen={isModalOpen} onClose={closeModal}>
              <div className="modal-content-wrapper">
                <h2 className="modal-location text-xl font-semibold">
                  {selectedProperty?.addresses[0].house_num}{" "}
                  {selectedProperty?.addresses[0].street_name},{" "}
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
                <p className="modal-price">Price: ${selectedProperty?.price}</p>
                <p className="modal-beds">Bedrooms: {selectedProperty?.num_beds}</p>
                <p className="modal-baths">Bathrooms: {selectedProperty?.num_baths}</p>
                <p className="modal-sqft">Square Feet: {selectedProperty?.sqft}</p>
              </div>
            </Modal>
          )}
        </section>
        <section className="pt-16 h-full min-h-screen bg-blue-100">
          <h1 className="mt-8 text-center text-5xl">You are authorized!</h1>
        </section>
      </>
    );
  } else {
    return <div dangerouslySetInnerHTML={{ __html: htmlContent }} />;
  }
}

export default Moderator;