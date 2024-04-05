import React, { useEffect } from 'react';
import Navbar from './Navbar';
import Modal from './Modal';
//import { Carousel } from "@material-tailwind/react";

// defining types for favorites
interface FavoriteProperty {
  id: number;
  title: string;
  location: string;
  price: string;
  imageUrl: string;
  bedrooms: number;
  bathrooms: number;
}

function Favorites() {
    const [favorites, setFavorites] = React.useState<FavoriteProperty[]>([]);
    const [selectedProperty, setSelectedProperty] = React.useState<FavoriteProperty | null>(null);
    const [isModalOpen, setIsModalOpen] = React.useState<boolean>(false);
    //const [carouselKey, setCarouselKey] = React.useState(0);

    const openModal = (property: FavoriteProperty) => {
      console.log('Opening modal for property:', property);
      setSelectedProperty(property);
      setIsModalOpen(true);
    };

    const closeModal = () => {
      setIsModalOpen(false);
      setSelectedProperty(null);
    };

    useEffect(() => {
      //setFavorites(test_favorite);
      fetch("/api/users/favorite-listings")
        .then((res) => res.json())
        .then((listings) => {
          setFavorites(listings);
        })
    }, []);

      return(
        <div> 
          <Navbar/>
          <div className = "favorites-container mt-16 p-4">
            <h1 className="text-xl font-semibold">Your Favorites</h1>
            <div className = "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {favorites.map((property) => (
                <div key = {property.id} className = "border rounded-lg overflow-hidden shadow-lg">
                  <img src = {property.imageUrl} alt = {property.title} className = "w-full h-48 object-cover object-center"></img>
                  <div className = "p-4">
                  <p className = "text-xl font-semibold">Address Goes Here{(property.location)}</p>
                    <p className = "text-gray-600">Realtor: {property.title}</p>
                    <p className = "font-bold">${property.price}</p>
                    <p className = "text-gray-600">Bedrooms: {property.bedrooms}</p>
                    <p className = "text-gray-600">Bathrooms: {property.bathrooms}</p>
                    <button 
                      className = "mt-2 py-2 px-4 bg-blue-500 text-white rounded hover:bg-blue700 transition duration-200"
                      onClick = {() => openModal(property)}
                    >
                      View Property
                    </button>
                  </div>
                </div>
                ))}
            </div>
          </div>
          {isModalOpen && selectedProperty && (
          <Modal isOpen={isModalOpen} onClose={closeModal}>
            <div className="modal-content-wrapper">
              {selectedProperty?.imageUrl && (
                <img src={selectedProperty?.imageUrl} alt={selectedProperty?.title} className="modal-image" />
              )}
              <h2 className="modal-title">{selectedProperty?.title}</h2>
              <p className="modal-location">{selectedProperty?.location}</p>
              <p className="modal-price">${selectedProperty?.price}</p>
              <p className="modal-details">Bedrooms: {selectedProperty?.bedrooms}</p>
              <p className="modal-details">Bathrooms: {selectedProperty?.bathrooms}</p>
            </div>
          </Modal>
          )}
        </div>
)};
export default Favorites;