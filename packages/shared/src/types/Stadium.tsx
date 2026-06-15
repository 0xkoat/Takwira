export interface StadiumOwner {
  id: number;
  username: string;
  imageUrl: string;
  phoneNumber: number;
}

export interface Stadium {
  id: number;
  ownerId: number;
  name: string;
  city: string;
  locationURL: string;
  images: string[];
  principalImageUrl: string;
  price: number;
  placesNum: number;
  description?: string;
  owner?: StadiumOwner;
}
