//import { useNavigate } from 'react-router-dom';
import React, {useEffect} from 'react';
import Navbar from './Navbar';
import Home_4 from "../assets/4.jpg";
import Home_5 from "../assets/5.jpg";
import Home_6 from "../assets/6.jpg";
import Home_7 from "../assets/7.jpg";
import Home_8 from "../assets/8.jpg"; 
import Home_9 from "../assets/9.jpg";
//import React from 'react'

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

// testing out the favorites page
const test_favorite: FavoriteProperty[] = [
  {
    id: 1,
    title: 'Pineapple',
    location: '124 Conch Street',
    price: '100',
    imageUrl: Home_4,
    bedrooms: 3,
    bathrooms: 2,
  },
  {
    id: 2,
    title: 'Squidward',
    location: '122 Conch Street',
    price: '200',
    imageUrl: Home_5,
    bedrooms: 4,
    bathrooms: 3,
  },
  {
    id: 3,
    title: 'Patrick',
    location: '120 Conch Street',
    price: '300',
    imageUrl: Home_6,
    bedrooms: 5,
    bathrooms: 4,
  },
  {
    id: 4,
    title: 'Krusty Krab',
    location: '831 Bottomfeeder Lane',
    price: '400',
    imageUrl: Home_7,
    bedrooms: 6,
    bathrooms: 5,
  },
  {
    id: 5,
    title: 'Strawberry',
    location: '1 Berry Bitty Lane',
    price: '500',
    imageUrl: Home_8,
    bedrooms: 1,
    bathrooms: 5,
  },
  {
    id: 6,
    title: 'Chum Bucket',
    location: '1 Chum Bucket Lane',
    price: '600',
    imageUrl: Home_9,
    bedrooms: 2,
    bathrooms: 5,
  },
];

function Favorites() {
    const [favorites, setFavorites] = React.useState<FavoriteProperty[]>([]);

    useEffect(() => {
      setFavorites(test_favorite);

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
                    <h2 className = "text-xl font-semibold">{property.title}</h2>
                    <p className = "text-gray-600">{property.location}</p>
                    <p className = "font-bold">${property.price}</p>
                    <p className = "text-gray-600">Bedrooms: {property.bedrooms}</p>
                    <p className = "text-gray-600">Bathrooms: {property.bathrooms}</p>
                    <button className = "mt-2 py-2 px-4 bg-blue-500 text-white rounded hover:bg-blue700 transition duration-200">
                      View Property
                    </button>
                  </div>
                </div>
                ))}
            </div>
          </div>
        </div>
    );
}
export default Favorites;
