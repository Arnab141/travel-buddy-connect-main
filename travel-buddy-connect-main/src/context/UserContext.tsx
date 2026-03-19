import React, { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useLocation } from "react-router-dom";
import { io, Socket } from "socket.io-client";
import { request } from "http";
import { a } from "vitest/dist/chunks/suite.d.FvehnV49.js";

/* ------------------ Types ------------------ */

interface AppNotification {
  id: string;
  type: "join_request" | "accepted" | "rejected";
  message: string;
  read: boolean;
  createdAt: Date;

  tripId?: string;
  requestId?: string;
}

interface Address {
  houseNumber: string;
  street: string;
  city: string;
  state: string;
  postalCode: string;
}

interface Location {
  name: string;
  fullAddress: string;
  lat?: number;
  lng?: number;
}

interface PickupPoint {
  location: Location;
  price: number;
}

interface HostedTrip {
  _id: string;
  from: Location;
  to: Location;
  tripDate: string;
  tripTime: string;
  basePrice: number;
  availableSeats: number;
  status: string;
}

interface User {
  _id: string;
  name: string;
  email: string;
  phone: string;
  gender: string;
  avatar: string;
  bio: string;
  rating: number;

  address: Address;

  hostedTrips: HostedTrip[];
  joinedTrips: HostedTrip[];

  isAdmin: boolean;
  isVerified: boolean;

  createdAt: string;
  updatedAt: string;
}

interface UserContextType {
  user: User | null;
  setUser: React.Dispatch<React.SetStateAction<User | null>>;

  tbtoken: string | null;
  setTbtoken: React.Dispatch<React.SetStateAction<string | null>>;

  logout: () => void;

  register: (userData: any) => Promise<void>;
  generateOTP: (email: string) => Promise<any>;
  verifyOTP: (email: string, otp: string) => Promise<any>;
  login: (email: string, password: string) => Promise<void>;
  shareTrip: (tripData: any) => Promise<any>;
  setTripData: React.Dispatch<React.SetStateAction<any>>;
  tripData: any;
  joinrequest: (tripId: string, pickupIndex: number | null) => Promise<any>;
  notifications: AppNotification[];
  unreadCount: number;
  markAsRead: (id: string) => void;
  fetchRequest: (requestId: string) => Promise<any>;
  markNotificationRead: (notificationId: string) => Promise<void>;
  unreadNotifications: AppNotification[];
  backendUrl: String
  myTrips: any;
  tracking: any;
  fetchTripTracking: (tripId: string) => Promise<void>;
  currentIndex: number;

}

/* ------------------ Context ------------------ */

const UserContext = createContext<UserContextType | undefined>(undefined);

/* ------------------ Hook ------------------ */

export const useUser = (): UserContextType => {
  const context = useContext(UserContext);
  if (!context) throw new Error("useUser must be used within a UserProvider");
  return context;
};

/* ------------------ Helper (JWT Expiry Check) ------------------ */

const isTokenExpired = (token: string) => {
  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    const expiry = payload.exp * 1000;
    return Date.now() > expiry;
  } catch {
    return true;
  }
};

/* ------------------ Provider ------------------ */

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [tbtoken, setTbtoken] = useState<string | null>(null);
  const [tripData, setTripData] = useState<any>([]);
  const [socket, setSocket] = useState<Socket | null>(null);
  const [notifications, setNotifications] = useState<AppNotification[]>([]);
  const [myTrips, setMyTrips] = useState<any>([]);
  const [tracking, setTracking] = useState<any>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [driverLocation, setDriverLocation] = useState<any>(null);


  const location = useLocation();
  const backendUrl = import.meta.env.VITE_BACKEND_URL + "/api/v1" || "http://localhost:3000";
  const socketUrl = import.meta.env.VITE_SOCKET_URL || "http://localhost:3000";

  useEffect(() => {
    if (!user) return;

    const newSocket = io(socketUrl, {
      transports: ["websocket"],
    });

    setSocket(newSocket);

    // Join personal room
    newSocket.emit("join", user._id);

    /* ---------------- LISTEN EVENTS ---------------- */

    // Host receives new join request
    newSocket.on("new_join_request", (notification: AppNotification) => {
      setNotifications((prev) => [notification, ...prev]);

      toast.info(notification.message);
    });

    // Passenger notified accepted
    newSocket.on("request_accepted", (data) => {
      const notification: AppNotification = {
        id: Date.now().toString(),
        type: "accepted",
        message: data.message || "Your join request was accepted!",
        read: false,
        createdAt: new Date(),
      };

      setNotifications((prev) => [notification, ...prev]);
      toast.success(notification.message);
    });

    // Passenger notified rejected
    newSocket.on("request_rejected", (data) => {
      const notification: AppNotification = {
        id: Date.now().toString(),
        type: "rejected",
        message: data.message || "Your join request was rejected.",
        read: false,
        createdAt: new Date(),
      };

      setNotifications((prev) => [notification, ...prev]);
      toast.error(notification.message);
    });
    // trip tracking update current index of driver

    // FULL tracking update (MAIN EVENT)
    newSocket.on("tracking_update", (updatedTracking) => {
      setTracking(updatedTracking);
    });

    // Optional: only index update
    newSocket.on("current_checkpoint", (data) => {
      setCurrentIndex(data.currentIndex);
    });

    // Driver live location
    newSocket.on("driver_location", (location) => {
      setDriverLocation(location);
    });

    return () => {
      newSocket.disconnect();
    };
  }, [user]);



  /* ------------------ Load Token on Refresh ------------------ */
  useEffect(() => {
    const savedToken = localStorage.getItem("tbtoken");

    if (savedToken && !isTokenExpired(savedToken)) {
      setTbtoken(savedToken);
    } else {
      localStorage.removeItem("tbtoken");
      setTbtoken(null);
      setUser(null);
    }
  }, []);

  /* ------------------ Attach Header Automatically ------------------ */
  useEffect(() => {
    if (tbtoken) {
      axios.defaults.headers.common[
        "Authorization"
      ] = `Bearer ${tbtoken}`;
    } else {
      delete axios.defaults.headers.common["Authorization"];
    }
  }, [tbtoken]);

  /* ------------------ Fetch Fresh User After Token Set ------------------ */
  useEffect(() => {
    if (tbtoken) {
      getUserData();
    }
  }, [tbtoken]);

  /* ------------------ Auto logout when token expires ------------------ */
  useEffect(() => {
    if (!tbtoken) return;

    const checkInterval = setInterval(() => {
      if (isTokenExpired(tbtoken)) {
        toast.info("Session expired. Please login again.", {
          position: "top-center",
        });
        logout();
      }
    }, 3000);

    return () => clearInterval(checkInterval);
  }, [tbtoken]);

  /* ------------------ Logout ------------------ */
  const logout = () => {
    setUser(null);
    setTbtoken(null);
    localStorage.removeItem("tbtoken");
  };

  /* ------------------ Register ------------------ */
  const register = async (userData: any) => {
    try {
      const response = await axios.post(
        `${backendUrl}/user/register`,
        userData
      );

      if (response.data.success) {
        toast.success("Registration successful!", {
          position: "top-center",
        });

        setTbtoken(response.data.token);
        localStorage.setItem("tbtoken", response.data.token);

        window.location.href = "/";
      } else {
        toast.error(response.data.message || "Registration failed!");
      }
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Registration failed!");
    }
  };

  /* ------------------ Generate OTP ------------------ */
  const generateOTP = async (email: string) => {
    const response = await axios.post(
      `${backendUrl}/user/genarate-otp`,
      { email }
    );
    return response.data;
  };

  /* ------------------ Verify OTP ------------------ */
  const verifyOTP = async (email: string, otp: string) => {
    const response = await axios.post(
      `${backendUrl}/user/verify-otp`,
      { email, otp }
    );
    return response.data;
  };
  /* ------------------ Login ------------------ */
  const login = async (email: string, password: string) => {
    try {
      const response = await axios.post(`${backendUrl}/user/login`, {
        email,
        password,
      });

      if (response.data.success) {
        toast.success("Login successful!", {
          position: "top-center",
        });

        setTbtoken(response.data.token);
        localStorage.setItem("tbtoken", response.data.token);

        window.location.href = "/";
      } else {
        toast.error(response.data.message || "Login failed!");
      }
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Login failed!");
    }
  }
  /* ------------------ Share Trip ------------------ */
  const shareTrip = async (tripData: any) => {
    const response = await axios.post(
      `${backendUrl}/trip/share`,
      tripData
    );
    return response.data;
  };

  /* ------------------ Get All Trips ------------------ */
  const getTripsData = async () => {
    try {
      const response = await axios.get(`${backendUrl}/trip/all`);
      if (response.data.success) {
        setTripData(response.data.trips);
      } else {
        toast.error(response.data.message);
      }
    } catch (err) {
      console.error(err);
    }
  };

  /* ------------------ Get User Profile ------------------ */
  const getUserData = async () => {
    try {
      const response = await axios.get(
        `${backendUrl}/user/profile`
      );
      if (response.data.success) {
        setUser(response.data.user);
      }
    } catch (err) {
      console.error("Failed to fetch user data:", err);
      logout();
    }
  };

  const joinrequest = async (
    tripId: string,
    pickupIndex: number | null
  ) => {
    try {
      const response = await axios.post(
        `${backendUrl}/trip/join-request`,
        { tripId, pickupIndex }
      );

      console.log("Join Request Response:", response.data);
      return response.data;

    } catch (err: any) {
      console.error("Failed to send join request:", err);

      // 🔥 IMPORTANT PART
      if (err.response && err.response.data) {
        return err.response.data;  // return backend message
      }

      return { success: false, message: "Join request failed" };
    }
  };

  const fetchRequest = async (requestId: string) => {
    try {
      const res = await axios.get(`${backendUrl}/trip/join/${requestId}`, {
        headers: { Authorization: `Bearer ${tbtoken}` },
      });
      return res.data;
    } catch (error: any) {
      console.error("Failed to fetch request:", error?.response?.data);

      return {
        success: false,
        message: error?.response?.data?.message || "Fetch failed",
      };
    }
  };

  const markNotificationRead = async (notificationId: string) => {
    if (!tbtoken) return;

    try {
      await axios.put(
        `${backendUrl}/trip/notifications/${notificationId}`,
        { read: true },
        {
          headers: { Authorization: `Bearer ${tbtoken}` },
        }
      );
    } catch (error) {
      console.error("Failed to mark notification");
    }
  };

  const getMyTrips = async () => {
    if (!tbtoken) return;
    try {
      const res = await axios.get(`${backendUrl}/trip/get-my-trips`, {
        headers: { Authorization: `Bearer ${tbtoken}` },
      });
      if (res.data.success) {
        setMyTrips(res.data.data);
      }
    } catch (error) {
      console.error("Failed to fetch my trips");
    }
  };

  const fetchTripTracking = async (tripId: string) => {
    try {

      if (!tbtoken) return; // important

      const res = await axios.get(
        `${backendUrl}/trip/tracking/${tripId}`, {
        headers: { Authorization: `Bearer ${tbtoken}` },
      }
      );

      setTracking(res.data.data);

    } catch (error) {
      console.error("Tracking fetch error:", error);
    }
  };



  const unreadNotifications = React.useMemo(
    () => notifications.filter(n => !n.read),
    [notifications]
  );
  // get notifications on login and when new notification arrives via socket
  useEffect(() => {
    if (!tbtoken) return;

    const fetchNotifications = async () => {
      try {
        const res = await axios.get(`${backendUrl}/trip/notifications`);
        setNotifications(res.data.notifications);

      } catch (error) {
        console.log("Failed to fetch notifications");
      }
    };

    fetchNotifications();
  }, [tbtoken]);

  const markAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) =>
        n.id === id ? { ...n, read: true } : n
      )
    );
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  /* ------------------ Auto Fetch Trips ------------------ */
  useEffect(() => {
    if (
      location.pathname === "/user/trips" &&
      tbtoken &&
      tripData.length === 0
    ) {
      getTripsData();
    }

    if (location.pathname === "/user/my-trips" && tbtoken && myTrips.length === 0) {
      getMyTrips();
    }
  }, [location.pathname, tbtoken]);

  /* ------------------ Provider Return ------------------ */
  return (
    <UserContext.Provider
      value={{
        user,
        setUser,
        tbtoken,
        setTbtoken,
        logout,
        register,
        generateOTP,
        verifyOTP,
        login,
        shareTrip,
        setTripData,
        tripData,
        joinrequest,
        notifications,
        unreadCount,
        markAsRead,
        fetchRequest,
        markNotificationRead,
        unreadNotifications,
        backendUrl,
        myTrips,
        tracking,
        fetchTripTracking,
        currentIndex


      }}
    >
      {children}
    </UserContext.Provider>
  );
};