export interface Stadium {
  id: number;
  ownerId: number;
  name: string;
  ownerName: string;
  ownerNumber: number;
  city: string;
  locationURL: string;
  images: string[];
  principalImageUrl: string;
  price: number;
  placesNum: number;
  description?: string;
}

export interface StadiumCardProps {
  stadium: Stadium;
}

export interface StadiumsListProps {
  stadiums: Stadium[];
}
