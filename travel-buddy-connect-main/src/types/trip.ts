export interface TripLocation {
  name: string;
  fullAddress: string;
  lat: number;
  lng: number;
}

export interface TripUser {
  _id: string;
  name: string;
  email: string;
  phone: string;
  avatar: string;
}

export interface PickupPoint {
  location: TripLocation;
  price: number;
}

export interface JoinedPassenger {
  user: TripUser;
  seatsBooked: number;
  selectedPickup: TripLocation;
  status: "accepted" | "pending" | "rejected";
  joinedAt: string;
}

export type TripStatus = "scheduled" | "ongoing" | "completed" | "cancelled";
export type UserRole = "host" | "passenger";

export interface Trip {
  _id: string;
  from: TripLocation;
  to: TripLocation;
  tripDate: string;
  tripTime: string;
  tripDateTime: string;
  vehicleType: string;
  basePrice: number;
  availableSeats: number;
  luggage: string;
  notes: string;
  genderPreference: string;
  status: TripStatus;
  role: UserRole;
  driver: TripUser;
  joinedPassengers: JoinedPassenger[];
  pickupPoints: PickupPoint[];
  createdAt: string;
  updatedAt: string;
  __v?: number;
}
