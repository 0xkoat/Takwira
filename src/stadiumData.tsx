export interface Stadium {
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

// dummy stadiums

export const ALL_STADIUMS: Stadium[] = [
  {
    name: 'mouelhi',
    ownerName: 'koat',
    ownerNumber: '12345678',
    city: 'tunis',
    locationURL: 'https://google.com',
    images: [
      'https://via.placeholder.com/150',
      'https://via.placeholder.com/150',
    ],
    principalImageUrl: 'https://via.placeholder.com/150',
    price: '100',
    placesNum: '11',
  },
  {
    name: 'korbi',
    ownerName: 'koat',
    ownerNumber: '12345678',
    city: 'tunis',
    locationURL: 'https://google.com',
    images: [
      'https://via.placeholder.com/150',
      'https://via.placeholder.com/150',
    ],
    principalImageUrl: 'https://via.placeholder.com/150',
    price: '100',
    placesNum: '11',
  },
  {
    name: 'vedetto',
    ownerName: 'koat',
    ownerNumber: '12345678',
    city: 'tunis',
    locationURL: 'https://google.com',
    images: [
      'https://via.placeholder.com/150',
      'https://via.placeholder.com/150',
    ],
    principalImageUrl: 'https://via.placeholder.com/150',
    price: '100',
    placesNum: '11',
  },
];
