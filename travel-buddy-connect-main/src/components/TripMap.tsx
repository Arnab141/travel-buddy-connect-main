import React, { useEffect, useRef, useState } from "react";
import tt from "@tomtom-international/web-sdk-maps";
import "@tomtom-international/web-sdk-maps/dist/maps.css";

interface Location {
  lat: number;
  lng: number;
  name: string;
  fullAddress: string;
}

interface PickupPoint {
  location: Location;
  price: number;
}

interface TripMapProps {
  tripId: string;
  from: Location;
  to: Location;
  pickupPoint: PickupPoint[];
}

function TripMap({ tripId, from, to, pickupPoint }: TripMapProps) {

  const mapRef = useRef<HTMLDivElement | null>(null);
  const mapInstance = useRef<any>(null);

  const [tripInfo, setTripInfo] = useState({
    distanceKm: 0,
    durationMin: 0,
  });

  useEffect(() => {

    if (!mapRef.current) return;

    const isValidCoord = (lat: any, lng: any) =>
      typeof lat === "number" &&
      typeof lng === "number" &&
      !isNaN(lat) &&
      !isNaN(lng);

    if (!isValidCoord(from?.lat, from?.lng) || !isValidCoord(to?.lat, to?.lng)) {
      console.warn("Invalid start or destination coordinates");
      return;
    }

    const map = tt.map({
      key: "BcyoHeCBM79dehocalmqXNXt00qJ28mN",
      container: mapRef.current,
      center: [from.lng, from.lat],
      zoom: 9,
    });

    mapInstance.current = map;

    map.addControl(new tt.NavigationControl());

    map.on("load", () => {

      const addMarker = (
        lng: number,
        lat: number,
        number: number,
        color: string
      ) => {

        if (!isValidCoord(lat, lng)) return;

        const el = document.createElement("div");

        el.style.width = "36px";
        el.style.height = "36px";
        el.style.borderRadius = "50%";
        el.style.background = color;
        el.style.color = "white";
        el.style.display = "flex";
        el.style.alignItems = "center";
        el.style.justifyContent = "center";
        el.style.fontWeight = "bold";
        el.style.boxShadow = "0 4px 10px rgba(0,0,0,0.3)";
        el.innerText = number.toString();

        new tt.Marker({ element: el })
          .setLngLat([lng, lat])
          .addTo(map);
      };

      let counter = 1;

      // START MARKER
      addMarker(from.lng, from.lat, counter++, "#2563eb");

      // VALID PICKUPS
      const validPickups = pickupPoint
        .map((p) => ({
          lat: p?.location?.lat,
          lng: p?.location?.lng,
        }))
        .filter((p) => isValidCoord(p.lat, p.lng));

      // ADD PICKUP MARKERS
      validPickups.forEach((p) => {
        addMarker(p.lng, p.lat, counter++, "#f59e0b");
      });

      // DESTINATION MARKER
      addMarker(to.lng, to.lat, counter++, "#dc2626");

      // ROUTE LOCATIONS
      const routePoints = [
        `${from.lat},${from.lng}`,
        ...validPickups.map((p) => `${p.lat},${p.lng}`),
        `${to.lat},${to.lng}`,
      ];

      const locations = routePoints.join(":");

      fetch(
        `https://api.tomtom.com/routing/1/calculateRoute/${locations}/json?key=BcyoHeCBM79dehocalmqXNXt00qJ28mN&travelMode=car&routeType=fastest`
      )
        .then((res) => res.json())
        .then((data) => {

          if (!data?.routes?.length) {
            console.error("Routing failed:", data);
            return;
          }

          const route = data.routes[0];

          const distanceKm = (
            route.summary.lengthInMeters / 1000
          ).toFixed(1);

          const durationMin = Math.ceil(
            route.summary.travelTimeInSeconds / 60
          );

          setTripInfo({
            distanceKm: Number(distanceKm),
            durationMin,
          });

          const routeCoords = route.legs.flatMap((leg: any) =>
            leg.points.map((p: any) => [p.longitude, p.latitude])
          );

          const geoJson: GeoJSON.Feature<GeoJSON.LineString> = {
            type: "Feature",
            geometry: {
              type: "LineString",
              coordinates: routeCoords,
            },
            properties: {},
          };

          if (map.getSource("route")) {
            (map.getSource("route") as any).setData(geoJson);
          } else {

            map.addSource("route", {
              type: "geojson",
              data: geoJson,
            });

            map.addLayer({
              id: "route-line",
              type: "line",
              source: "route",
              paint: {
                "line-color": "#2563eb",
                "line-width": 6,
              },
            });

          }

          const bounds = routeCoords.reduce(
            (b: any, coord: any) => b.extend(coord),
            new tt.LngLatBounds(routeCoords[0], routeCoords[0])
          );

          map.fitBounds(bounds, { padding: 80 });

        })
        .catch((err) => {
          console.error("Routing error:", err);
        });

    });

    return () => {
      if (mapInstance.current) {
        mapInstance.current.remove();
        mapInstance.current = null;
      }
    };

  }, [tripId, from, to, pickupPoint]);

  return (
    <div className="relative w-full h-[500px] rounded-2xl overflow-hidden shadow-lg">

      <div ref={mapRef} className="w-full h-full" />

      <div className="absolute bottom-4 left-4 bg-white px-4 py-2 rounded-xl shadow-lg text-sm font-medium">
        🚗 {tripInfo.distanceKm} km • ⏱ {Math.floor(tripInfo.durationMin / 60)}h{" "}
        {tripInfo.durationMin % 60}m
      </div>

    </div>
  );
}

export default TripMap;