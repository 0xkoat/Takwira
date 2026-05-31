export interface Stadium {
  id: number;
  ownerId: number;
  name: string;
  ownerName: string;
  ownerNumber: string;
  city: string;
  locationURL: string;
  images: string[];
  principalImageUrl: string;
  price: string;
  placesNum: string;
  description?: string;
}

export interface StadiumCardProps {
  stadium: Stadium;
}

export interface StadiumsListProps {
  stadiums: Stadium[];
}
