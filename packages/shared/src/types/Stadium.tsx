export interface Stadium {
  id: Number;
  name: string;
  ownerName: string;
  ownerNumber: string;
  city: string;
  locationURL: string;
  images: string[];
  principalImageUrl: string;
  price: string;
  placesNum: string;
}

export interface StadiumCardProps {
  stadium: Stadium;
}

export interface StadiumsListProps {
  stadiums: Stadium[];
}

