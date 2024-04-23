export interface Address {
  id: number;
  listing_id: number;
  house_num: number;
  street_name: string;
  city: string;
  state: string;
  zip_code: number;
}

export interface Image {
  id: number;
  path: string;
}

export interface Listing {
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

export interface User {
  first_name: string;
  last_name: string;
}

export interface FilterFields {
  min_price: number;
  max_price: number;
  min_sqft: number;
  max_sqft: number;
  min_beds: number;
  max_beds: number;
  min_baths: number;
  max_baths: number;
  zip_code: number;
}

export interface AuthenticationContext {
  isAuthenticated: boolean;
  htmlContent: string;
}

export interface Chat {
  name: string;
  first_name: string;
  last_name: string;
  chat_id: number;
}