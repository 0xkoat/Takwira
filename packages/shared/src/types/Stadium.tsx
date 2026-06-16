export interface StadiumOwner {
  id: number;
  username: string;
  imageUrl: string;
  phoneNumber: number;
}

export interface StadiumImage {
  id: string;
  url: string;
}

export interface Stadium {
  id: number;
  ownerId: number;
  name: string;
  city: string;
  locationURL: string;
  images?: StadiumImage[];
  principalImageUrl: string;
  principalImageId?: string;
  price: number;
  placesNum: number;
  description?: string;
  owner?: StadiumOwner;
}
