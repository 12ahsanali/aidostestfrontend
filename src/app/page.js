"use client";
import { useState,useEffect, useCallback } from "react";
import { Menu, LogOut } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useSelector, useDispatch } from "react-redux";
import toast from "react-hot-toast";
import dynamic from "next/dynamic";
import Sidebar from "../components/Sidebar";
import StatsCard from "../components/StatsCard";
import AdvisoryCard from "../components/AdvisoryCard";
import WhatIfCard from "../components/WhatIfCard";
import Checklist from "../components/Checklist";
import { logout } from "../../services/authService";
import Header from "../components/Header";
import AuthLoader from "../components/AuthLoader";

const MapArea = dynamic(() => import("../components/MapArea"), {
  ssr: false,
});

import { DEFAULT_FLIGHT_FORM, VALID_AIRPORTS } from "../data/mockData";

function Dashboard() {
	const [departure, setDeparture] = useState(DEFAULT_FLIGHT_FORM.departure);
	const [destination, setDestination] = useState(DEFAULT_FLIGHT_FORM.destination);
	const [riskData, setRiskData] = useState(null);
	const [showDetailedAdvisory, setShowDetailedAdvisory] = useState(false);
	const [submittedRouteData, setSubmittedRouteData] = useState(null);
	const [flightResponseData, setFlightResponseData] = useState(null);
	const [selectedFlightId, setSelectedFlightId] = useState(null);
	const router = useRouter();
	const dispatch = useDispatch();
	const { isAuthenticated, name } = useSelector((state) => state.auth);
	// Check authentication on mount
	// useEffect(() => {
	// 	const checkAuthentication = async () => {
	// 		try {
	// 			const response = await checkAuth();
	// 			if (response.success) {
	// 				dispatch(setUser({ name: response.user.name }));
	// 			}
	// 		} catch (error) {
	// 			console.log("Not authenticated");
	// 		}
	// 	};

	// 	checkAuthentication();
	// }, [dispatch]);

  const handleEvaluate = useCallback((riskData) => {
    const finalData = {
      pilot: riskData.pilot,
      aircraft: riskData.aircraft,
      environment: riskData.environment,
      external: riskData.external,
      total: riskData.total,
    };

    setRiskData(finalData);
    setShowDetailedAdvisory(false);
  }, []);

  const handleSubmitRoute = useCallback((flightData) => {
    console.log("Flight data received:", flightData);
    setFlightResponseData(flightData);

    const routePoints = [
      flightData.departure.icao,
      flightData.destination.icao,
    ];
    if (flightData.stops && flightData.stops.length > 0) {
      const stopIcaos = flightData.stops.map(stop => stop.icao);
      routePoints.splice(1, 0, ...stopIcaos);
    }
    const routeData = {
      routePoints,
      flightData, // Pass the full flight data for map to use
    };
    setSubmittedRouteData(routeData);
  }, []);

  const handleAirportChange = useCallback((type, value) => {
    if (type === "departure") {
      setDeparture(value);
    } else if (type === "destination") {
      setDestination(value);
    }
  }, []);

  return (
    <main className="flex h-screen w-screen bg-[var(--bg-dark)] relative pt-[50px] overflow-hidden max-[1280px]:flex-col max-[1280px]:pt-[60px] max-[1280px]:h-auto max-[1280px]:w-full max-[1280px]:overflow-visible">
      {/* Sticky Header */}
      <Header username={name} isAuthenticated={isAuthenticated}/>
      <div className="pt-6 pr-0 pb-6 pl-6 overflow-y-auto h-full shrink-0 max-[1280px]:p-4 max-[1280px]:w-full max-[1280px]:max-w-full max-[1280px]:h-auto max-[1280px]:overflow-visible max-[640px]:p-3">
        <Sidebar
          isOpen={true}
          onClose={() => {}}
          onAirportChange={handleAirportChange}
          currentDeparture={departure}
          currentDestination={destination}
          onEvaluate={handleEvaluate}
          onSubmitRoute={handleSubmitRoute}
          onFlightSelect={setSelectedFlightId}
        />
      </div>

      <div className="flex-1 p-6 grid grid-cols-3 gap-6 overflow-y-auto h-full [grid-template-rows:auto_1fr] max-[1280px]:p-4 max-[1280px]:gap-4 max-[1280px]:flex max-[1280px]:flex-col max-[1280px]:h-auto max-[1280px]:overflow-visible max-[1280px]:flex-none max-[640px]:p-3 max-[640px]:gap-3">
        <div className="col-span-1 min-w-0 w-full">
          <StatsCard
            riskData={riskData}
            onViewDetailedAdvisory={() => setShowDetailedAdvisory(true)}
          />
        </div>
        <div className="col-span-1 min-w-0 w-full">
          <AdvisoryCard
            riskData={riskData}
            showDetailedAdvisory={showDetailedAdvisory}
          />
        </div>
        <div className="col-span-1 min-w-0 w-full">
          <WhatIfCard riskData={riskData} flightInfoId={selectedFlightId} />
        </div>
        <div className="col-span-2 min-w-0">
          <MapArea
            routeData={submittedRouteData}
            departure={departure}
            destination={destination}
          />
        </div>
        <div className="col-span-1 min-w-0">
          <Checklist riskData={riskData} />
        </div>
      </div>
    </main>
  );
}

export default function Home() {
  return (
    <AuthLoader>
      <Dashboard />
    </AuthLoader>
  );
}
