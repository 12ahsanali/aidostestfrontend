"use client";
import { Plane, Calendar, Upload, MapPin, Navigation, X } from "lucide-react";
import { useEffect, useState } from "react";
import {
  DEFAULT_FLIGHT_FORM,
  VALID_AIRPORTS,
  MOCK_SUBMISSION_RECORDS,
  createSubmissionRecord,
} from "../data/mockData";
import toast from "react-hot-toast";
import { submitFlightInfo } from "../../services/flightInfo";
export default function Sidebar({
  isOpen,
  onClose,
  onAirportChange,
  currentDeparture,
  currentDestination,
  onEvaluate,
  onSubmitRoute,
  onFlightSelect,
}) {
  const [isEvaluating, setIsEvaluating] = useState(false);
  const [formData, setFormData] = useState({
    departure: currentDeparture || DEFAULT_FLIGHT_FORM.departure,
    destination: currentDestination || DEFAULT_FLIGHT_FORM.destination,
    departureCoords: DEFAULT_FLIGHT_FORM.departureCoords,
    destinationCoords: DEFAULT_FLIGHT_FORM.destinationCoords,
    stops: DEFAULT_FLIGHT_FORM.stops,
    routeOption: DEFAULT_FLIGHT_FORM.routeOption,
    pilotId: DEFAULT_FLIGHT_FORM.pilotId,
    aircraftTailNumber: DEFAULT_FLIGHT_FORM.aircraftTailNumber,
    departureTime: DEFAULT_FLIGHT_FORM.departureTime,
    missionType: DEFAULT_FLIGHT_FORM.missionType,
    aircraftStatusFile: null,
    pilotConditionFile: null,
    plannedRouteFile: null,
  });
  const [inputMode, setInputMode] = useState("airport");
  const [inputMode2, setInputMode2] = useState("airport");

  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [submissionRecords, setSubmissionRecords] = useState(
    MOCK_SUBMISSION_RECORDS,
  );

  const parseStops = (value) => {
    // Handle single airport from autocomplete
    if (!value || value.trim()) {
      return value
        .split(",")
        .map((v) => v.trim().toUpperCase())
        .filter((stop) => stop.length === 4);
    }
    return [];
  };

  const validateField = (name, value) => {
    switch (name) {
      case "departure":
      case "destination":
        if (!value || value.trim() === "") {
          return "Required field";
        }
        if (inputMode === "airport") {
          if (value.trim().length !== 4) {
            return "Airport code must be 4 characters";
          }
          if (
            name === "destination" &&
            value.toUpperCase() === formData.departure.toUpperCase()
          ) {
            return "Cannot be same as departure";
          }
          if (
            name === "departure" &&
            value.toUpperCase() === formData.destination.toUpperCase()
          ) {
            return "Cannot be same as destination";
          }
        } else {
          const coordPattern = /^-?\d+\.?\d*,\s*-?\d+\.?\d*$/;
          if (!coordPattern.test(value.trim())) {
            return "Invalid coordinate format (e.g., 40.6413, -73.7781)";
          }
        }
        return "";

      case "departureCoords":
      case "destinationCoords":
        if (!value || value.trim() === "") {
          return "Required field";
        }
        const coordPattern = /^-?\d+\.?\d*,\s*-?\d+\.?\d*$/;
        if (!coordPattern.test(value.trim())) {
          return "Invalid coordinate format (e.g., 40.6413, -73.7781)";
        }
        return "";

      case "stops": {
        if (value || value.trim() === "") {
          return "";
        }

        const stops = parseStops(value);
        if (stops.length === 0) {
          return "Enter valid 4-letter ICAO codes separated by commas";
        }

        // Check each stop
        const invalidStops = stops.filter(
          (stop) => !VALID_AIRPORTS.includes(stop),
        );
        if (invalidStops.length > 0) {
          return `Invalid airports: ${invalidStops.join(", ")}`;
        }

        // Check duplicates
        if (stops.length !== new Set(stops).size) {
          return "Duplicate airports not allowed";
        }

        // Check if stops include departure/destination
        if (stops.includes(formData.departure.toUpperCase())) {
          return "Stops cannot include departure airport";
        }
        if (stops.includes(formData.destination.toUpperCase())) {
          return "Stops cannot include destination airport";
        }

        return "";
      }

      case "pilotId":
        if (!value || value.trim() === "") {
          return "Pilot ID is required";
        }
        if (!/^PILOT-[A-Z0-9-]+$/i.test(value)) {
          return "Invalid format (e.g., PILOT-AIO-0001)";
        }
        return "";

      case "aircraftTailNumber":
        if (!value || value.trim() === "") {
          return "Aircraft tail number is required";
        }
        if (!/^N[0-9A-Z]{1,5}$/i.test(value)) {
          return "Invalid format (e.g., N12345)";
        }
        return "";

      case "departureTime":
        if (!value || value.trim() === "") {
          return "Departure time is required";
        }
        return "";

      default:
        return "";
    }
  };

  // handle submit in the forms
  const handleFlightInfoSubmit = async () => {
    setIsEvaluating(true);
    try {
      const fd = new FormData();

      // Helper function to parse coordinate string
      const parseCoordinateString = (coordString) => {
        const parts = coordString.split(",");
        if (parts.length === 2) {
          const lat = parseFloat(parts[0].trim());
          const lon = parseFloat(parts[1].trim());
          if (!isNaN(lat) && !isNaN(lon)) {
            return { lat, lon };
          }
        }
        return null;
      };

      const payload = {
        RouteOption: formData.routeOption,
        PilotId: formData.pilotId,
        TrailNumber: formData.aircraftTailNumber,
        ExpectedDepartureTime: formData.departureTime,
        PassengerType: formData.missionType,
        Stops: formData.stops ? parseStops(formData.stops) : [], // Always ICAO
      };

      // Handle departure (ICAO or coordinates)
      if (inputMode === "coordinate") {
        const coords = parseCoordinateString(formData.departureCoords);
        if (coords) {
          payload.DepLat = coords.lat;
          payload.DepLon = coords.lon;
        }
      } else {
        payload.Departure = formData.departure;
      }

      // Handle destination (ICAO or coordinates)
      if (inputMode2 === "coordinate") {
        const coords = parseCoordinateString(formData.destinationCoords);
        if (coords) {
          payload.DesLat = coords.lat;
          payload.DesLon = coords.lon;
        }
      } else {
        payload.Destination = formData.destination;
      }
      console.log("Payload:", payload);
      console.log("Stops value:", formData.stops);
      // Append normal fields
      Object.entries(payload).forEach(
        ([key, value]) => value && fd.append(key, value),
      );

      // Append files if they exist
      if (formData.aircraftStatusFile)
        fd.append("AirCrftStatus", formData.aircraftStatusFile);
      if (formData.pilotConditionFile)
        fd.append("PilotCondition", formData.pilotConditionFile);
      if (formData.plannedRouteFile)
        fd.append("PlannedRoute", formData.plannedRouteFile);

      const result = await submitFlightInfo(fd);

      if (!result?.success) return;

      const { pilot, aircraft, environment, external } = result.data.scores;
      const flightId = result.data.flightInfo._id;
      onEvaluate?.({
        pilot,
        aircraft,
        environment,
        external,
        total: pilot + aircraft + environment + external,
      });

      onSubmitRoute?.(result.data);
      onFlightSelect?.(flightId);
      onClose();
      toast.success("Flight info submitted successfully!");
    } catch (err) {
      toast.error(
        err?.response?.data?.message ||
          err?.message ||
          "Failed to submit flight info",
      );
    }
    setIsEvaluating(false);
  };

  const handleFileChange = (fieldName, file) => {
    setFormData((prev) => ({ ...prev, [fieldName]: file }));
  };

  const handleFieldChange = (name, value) => {
    setFormData((prev) => ({ ...prev, [name]: value }));

    if (touched[name]) {
      const error = validateField(name, value);
      setErrors((prev) => ({ ...prev, [name]: error }));
    }

    if ((name === "departure" || name === "destination") && onAirportChange) {
      onAirportChange(name, value);
    }
  };

  const handleBlur = (name) => {
    setTouched((prev) => ({ ...prev, [name]: true }));
    const error = validateField(name, formData[name]);
    setErrors((prev) => ({ ...prev, [name]: error }));
  };

  const handleDepartureModeChange = (mode) => {
    setInputMode(mode);
    // Reset departure values when switching modes
    setFormData((prev) => ({
      ...prev,
      departure: "",
      departureCoords: "",
    }));
    setErrors((prev) => ({ ...prev, departure: null, departureCoords: null }));
    setTouched((prev) => ({
      ...prev,
      departure: false,
      departureCoords: false,
    }));
  };

  const handleDestinationModeChange = (mode) => {
    setInputMode2(mode);
    // Reset destination values when switching modes
    setFormData((prev) => ({
      ...prev,
      destination: "",
      destinationCoords: "",
    }));
    setErrors((prev) => ({
      ...prev,
      destination: null,
      destinationCoords: null,
    }));
    setTouched((prev) => ({
      ...prev,
      destination: false,
      destinationCoords: false,
    }));
  };

  const handleSubmit = (action) => {
    const allErrors = {};
    Object.keys(formData).forEach((key) => {
      const error = validateField(key, formData[key]);
      if (error) allErrors[key] = error;
    });

    setErrors(allErrors);
    setTouched({
      departure: true,
      destination: true,
      stops: true,
      pilotId: true,
      aircraftTailNumber: true,
      departureTime: true,
    });

    if (Object.keys(allErrors).length === 0) {
      const status = action === "Evaluate Flight Risk" ? "evaluated" : "logged";
      const record = createSubmissionRecord(formData, status);
      setSubmissionRecords((prev) => [record, ...prev]);

      if (onSubmitRoute) {
        onSubmitRoute(formData);
      }

      if (action === "Evaluate Flight Risk" && onEvaluate) {
        onEvaluate(formData);
      } else {
        console.log(`${action} - Form submitted:`, record);
        alert(`${action} successful! Check console for details.`);
      }
    } else {
      alert("Please fix validation errors before submitting.");
    }
  };

  return (
    <div className="w-[380px] bg-[var(--bg-card)] border-r border-[var(--border-color)] flex flex-col h-full p-6 overflow-y-auto z-50 flex-shrink-0 max-xl:w-full max-xl:h-auto max-xl:border-r-0 max-xl:border-b max-xl:p-4 max-xl:overflow-y-visible">
      <div className="flex flex-col gap-5">
        <div className="flex flex-col gap-2">
          <div className="flex justify-between items-center">
            <label className="text-xs text-[var(--text-secondary)] uppercase tracking-[0.05em]">
              Departure
            </label>
            <div className="flex gap-2">
              <button
                className={`text-xs cursor-pointer px-1 py-0.5 transition-colors ${
                  inputMode === "airport"
                    ? "text-[#0bb0f0] border-b border-[#0bb0f0]"
                    : "bg-transparent border-none text-[var(--text-muted)]"
                }`}
                onClick={() => handleDepartureModeChange("airport")}
              >
                Airport
              </button>
              <button
                className={`text-xs cursor-pointer px-1 py-0.5 transition-colors ${
                  inputMode === "coordinate"
                    ? "text-[#0bb0f0] border-b border-[#0bb0f0]"
                    : "bg-transparent border-none text-[var(--text-muted)]"
                }`}
                onClick={() => handleDepartureModeChange("coordinate")}
              >
                Coordinate
              </button>
            </div>
          </div>
          <div className="relative flex flex-col gap-2">
            {inputMode === "airport" ? (
              <input
                type="text"
                className={`bg-[var(--bg-input)] border border-[var(--border-color)] text-[var(--text-primary)] p-3 rounded-sm w-full text-sm transition-colors duration-200 focus:outline-none focus:border-[var(--accent-blue)] ${
                  errors.departure && touched.departure
                    ? "border-[#ef4444] focus:border-[#dc2626]"
                    : ""
                }`}
                value={formData.departure}
                onChange={(e) => handleFieldChange("departure", e.target.value)}
                onBlur={() => handleBlur("departure")}
                placeholder="e.g., KJFK"
                maxLength={4}
              />
            ) : (
              <div className="grid grid-cols-2 gap-2">
                <input
                  type="text"
                  className={`bg-[var(--bg-input)] border border-[var(--border-color)] text-[var(--text-primary)] p-3 rounded-sm w-full text-sm transition-colors duration-200 focus:outline-none focus:border-[var(--accent-blue)] ${errors.departure && touched.departure ? "border-[#ef4444] focus:border-[#dc2626]" : ""}`}
                  placeholder="Latitude"
                  value={formData.departureCoords?.split(",")[0] || ""}
                  onChange={(e) => {
                    const coords = formData.departureCoords?.split(",") || [
                      "",
                      "",
                    ];
                    handleFieldChange(
                      "departureCoords",
                      `${e.target.value}, ${coords[1]}`,
                    );
                  }}
                  onBlur={() => handleBlur("departureCoords")}
                />
                <input
                  type="text"
                  className={`bg-[var(--bg-input)] border border-[var(--border-color)] text-[var(--text-primary)] p-3 rounded-sm w-full text-sm transition-colors duration-200 focus:outline-none focus:border-[var(--accent-blue)] ${errors.departure && touched.departure ? "border-[#ef4444] focus:border-[#dc2626]" : ""}`}
                  placeholder="Longitude"
                  value={formData.departureCoords?.split(",")[1] || ""}
                  onChange={(e) => {
                    const coords = formData.departureCoords?.split(",") || [
                      "",
                      "",
                    ];
                    handleFieldChange(
                      "departureCoords",
                      `${coords[0]}, ${e.target.value}`,
                    );
                  }}
                  onBlur={() => handleBlur("departureCoords")}
                />
              </div>
            )}
            {errors.departure && touched.departure && (
              <span className="text-[#ef4444] text-[10px] -mt-1">
                {errors.departure}
              </span>
            )}
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <div className="flex justify-between items-center">
            <label className="text-xs text-[var(--text-secondary)] uppercase tracking-[0.05em]">
              Destination
            </label>
            <div className="flex gap-2">
              <button
                className={`text-xs cursor-pointer px-1 py-0.5 transition-colors ${
                  inputMode2 === "airport"
                    ? "text-[#0bb0f0] border-b border-[#0bb0f0]"
                    : "bg-transparent border-none text-[var(--text-muted)]"
                }`}
                onClick={() => handleDestinationModeChange("airport")}
              >
                Airport
              </button>
              <button
                className={`text-xs cursor-pointer px-1 py-0.5 transition-colors ${
                  inputMode2 === "coordinate"
                    ? "text-[#0bb0f0] border-b border-[#0bb0f0]"
                    : "bg-transparent border-none text-[var(--text-muted)]"
                }`}
                onClick={() => handleDestinationModeChange("coordinate")}
              >
                Coordinate
              </button>
            </div>
          </div>
          <div className="relative flex flex-col gap-2">
            {inputMode2 === "airport" ? (
              <input
                type="text"
                className={`bg-[var(--bg-input)] border border-[var(--border-color)] text-[var(--text-primary)] p-3 rounded-sm w-full text-sm transition-colors duration-200 focus:outline-none focus:border-[var(--accent-blue)] ${
                  errors.destination && touched.destination
                    ? "border-[#ef4444] focus:border-[#dc2626]"
                    : ""
                }`}
                value={formData.destination}
                onChange={(e) =>
                  handleFieldChange("destination", e.target.value)
                }
                onBlur={() => handleBlur("destination")}
                placeholder="e.g., KLAX"
                maxLength={4}
              />
            ) : (
              <div className="grid grid-cols-2 gap-2">
                <input
                  type="text"
                  className={`bg-[var(--bg-input)] border border-[var(--border-color)] text-[var(--text-primary)] p-3 rounded-sm w-full text-sm transition-colors duration-200 focus:outline-none focus:border-[var(--accent-blue)] ${errors.destination && touched.destination ? "border-[#ef4444] focus:border-[#dc2626]" : ""}`}
                  placeholder="Latitude"
                  value={formData.destinationCoords?.split(",")[0] || ""}
                  onChange={(e) => {
                    const coords = formData.destinationCoords?.split(",") || [
                      "",
                      "",
                    ];
                    handleFieldChange(
                      "destinationCoords",
                      `${e.target.value}, ${coords[1]}`,
                    );
                  }}
                  onBlur={() => handleBlur("destinationCoords")}
                />
                <input
                  type="text"
                  className={`bg-[var(--bg-input)] border border-[var(--border-color)] text-[var(--text-primary)] p-3 rounded-sm w-full text-sm transition-colors duration-200 focus:outline-none focus:border-[var(--accent-blue)] ${errors.destination && touched.destination ? "border-[#ef4444] focus:border-[#dc2626]" : ""}`}
                  placeholder="Longitude"
                  value={formData.destinationCoords?.split(",")[1] || ""}
                  onChange={(e) => {
                    const coords = formData.destinationCoords?.split(",") || [
                      "",
                      "",
                    ];
                    handleFieldChange(
                      "destinationCoords",
                      `${coords[0]}, ${e.target.value}`,
                    );
                  }}
                  onBlur={() => handleBlur("destinationCoords")}
                />
              </div>
            )}
            {errors.destination && touched.destination && (
              <span className="text-[#ef4444] text-[10px] -mt-1">
                {errors.destination}
              </span>
            )}
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-xs text-[var(--text-secondary)] uppercase tracking-[0.05em]">
            Route Options
          </label>
          <select
            className="bg-[var(--bg-input)] border border-[var(--border-color)] text-[var(--text-primary)] p-3 rounded-sm w-full text-sm transition-colors duration-200 focus:outline-none focus:border-[var(--accent-blue)]"
            value={formData.routeOption}
            onChange={(e) => handleFieldChange("routeOption", e.target.value)}
          >
            <option value="default routine">default routine</option>
            <option value="user-defined">user-defined</option>
            <option value="aiODAS designed">aiODAS designed</option>
          </select>
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-xs text-[var(--text-secondary)] uppercase tracking-[0.05em]">
            Stops (optional)
          </label>
          <input
            type="text"
            className={`bg-[var(--bg-input)] border border-[var(--border-color)] text-[var(--text-primary)] p-3 rounded-sm w-full text-sm transition-colors duration-200 focus:outline-none focus:border-[var(--accent-blue)] ${
              errors.stops && touched.stops
                ? "border-[#ef4444] focus:border-[#dc2626]"
                : ""
            }`}
            value={formData.stops}
            onChange={(e) => handleFieldChange("stops", e.target.value)}
            onBlur={() => handleBlur("stops")}
            placeholder="e.g., KATL, KORD, KDEN"
          />
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-xs text-[var(--text-secondary)] uppercase tracking-[0.05em]">
            Pilot ID
          </label>
          <input
            type="text"
            className={`bg-[var(--bg-input)] border border-[var(--border-color)] text-[var(--text-primary)] p-3 rounded-sm w-full text-sm transition-colors duration-200 focus:outline-none focus:border-[var(--accent-blue)] ${errors.pilotId && touched.pilotId ? "border-[#ef4444] focus:border-[#dc2626]" : ""}`}
            value={formData.pilotId}
            onChange={(e) => handleFieldChange("pilotId", e.target.value)}
            onBlur={() => handleBlur("pilotId")}
          />
          {errors.pilotId && touched.pilotId && (
            <span className="text-[#ef4444] text-[10px] -mt-1">
              {errors.pilotId}
            </span>
          )}
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-xs text-[var(--text-secondary)] uppercase tracking-[0.05em]">
            Aircraft Tail-number
          </label>
          <input
            type="text"
            className={`bg-[var(--bg-input)] border border-[var(--border-color)] text-[var(--text-primary)] p-3 rounded-sm w-full text-sm transition-colors duration-200 focus:outline-none focus:border-[var(--accent-blue)] ${errors.aircraftTailNumber && touched.aircraftTailNumber ? "border-[#ef4444] focus:border-[#dc2626]" : ""}`}
            value={formData.aircraftTailNumber}
            onChange={(e) =>
              handleFieldChange("aircraftTailNumber", e.target.value)
            }
            onBlur={() => handleBlur("aircraftTailNumber")}
          />
          {errors.aircraftTailNumber && touched.aircraftTailNumber && (
            <span className="text-[#ef4444] text-[10px] -mt-1">
              {errors.aircraftTailNumber}
            </span>
          )}
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-xs text-[var(--text-secondary)] uppercase tracking-[0.05em]">
            Expected Departure Time
          </label>
          <div className="relative flex items-center">
            <input
              type="datetime-local"
              className={`bg-[var(--bg-input)] border border-[var(--border-color)] text-[var(--text-primary)] p-3 rounded-sm w-full text-sm transition-colors duration-200 focus:outline-none focus:border-[var(--accent-blue)] ${errors.departureTime && touched.departureTime ? "border-[#ef4444] focus:border-[#dc2626]" : ""}`}
              value={formData.departureTime}
              onChange={(e) =>
                handleFieldChange("departureTime", e.target.value)
              }
              onBlur={() => handleBlur("departureTime")}
            />
          </div>
          {errors.departureTime && touched.departureTime && (
            <span className="text-[#ef4444] text-[10px] -mt-1">
              {errors.departureTime}
            </span>
          )}
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-xs text-[var(--text-secondary)] uppercase tracking-[0.05em]">
            Passenger/Mission Type:
          </label>
          <div className="flex gap-6 items-center">
            <label className="flex items-center gap-2 text-[var(--text-secondary)] text-xs cursor-pointer">
              <input
                type="radio"
                name="mission"
                checked={formData.missionType === "Routine"}
                onChange={() => handleFieldChange("missionType", "Routine")}
                className="accent-[var(--accent-blue)] w-3.5 h-3.5"
              />{" "}
              Routine
            </label>
            <label className="flex items-center gap-2 text-[var(--text-secondary)] text-xs cursor-pointer">
              <input
                type="radio"
                name="mission"
                checked={formData.missionType === "VIP"}
                onChange={() => handleFieldChange("missionType", "VIP")}
                className="accent-[var(--accent-blue)] w-3.5 h-3.5"
              />{" "}
              VIP
            </label>
            <label
              className={`flex items-center gap-2 text-xs cursor-pointer ${formData.missionType === "Important" ? "text-[var(--accent-blue)]" : "text-[var(--text-secondary)]"}`}
            >
              <input
                type="radio"
                name="mission"
                checked={formData.missionType === "Important"}
                onChange={() => handleFieldChange("missionType", "Important")}
                className="accent-[var(--accent-blue)] w-3.5 h-3.5"
              />{" "}
              Important
            </label>
            <label className="flex items-center gap-2 text-[var(--text-secondary)] text-xs cursor-pointer">
              <input
                type="radio"
                name="mission"
                checked={formData.missionType === "Critical"}
                onChange={() => handleFieldChange("missionType", "Critical")}
                className="accent-[var(--accent-blue)] w-3.5 h-3.5"
              />{" "}
              Critical
            </label>
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-xs text-[var(--text-secondary)] uppercase tracking-[0.05em]">
            Upload:
          </label>
          <div className="flex flex-col sm:flex-row gap-2">
            <div className="relative flex-1">
              <input
                type="file"
                id="aircraftStatus"
                className="hidden"
                accept="image/*,.pdf"
                onChange={(e) =>
                  handleFileChange("aircraftStatusFile", e.target.files[0])
                }
              />
              <button
                onClick={() =>
                  document.getElementById("aircraftStatus").click()
                }
                className="w-full bg-[#0a2d51] border border-[#0c3a68] text-white p-2 rounded-sm text-[0.7rem] flex items-center gap-1 cursor-pointer flex-1 justify-center whitespace-nowrap hover:bg-[#0c3a68]"
              >
                <Upload size={14} />
                {formData.aircraftStatusFile
                  ? "file uploaded"
                  : "Aircraft Status"}
              </button>
            </div>
            <div className="relative flex-1">
              <input
                type="file"
                id="pilotCondition"
                className="hidden"
                accept="image/*,.pdf"
                onChange={(e) =>
                  handleFileChange("pilotConditionFile", e.target.files[0])
                }
              />
              <button
                onClick={() =>
                  document.getElementById("pilotCondition").click()
                }
                className="w-full bg-[#0a2d51] border border-[#0c3a68] text-white p-2 rounded-sm text-[0.7rem] flex items-center gap-1 cursor-pointer flex-1 justify-center whitespace-nowrap hover:bg-[#0c3a68]"
              >
                <Upload size={14} />
                {formData.pilotConditionFile
                  ? "file uploaded"
                  : "Pilot Condition"}
              </button>
            </div>
            <div className="relative flex-1">
              <input
                type="file"
                id="plannedRoute"
                className="hidden"
                accept="image/*,.pdf"
                onChange={(e) =>
                  handleFileChange("plannedRouteFile", e.target.files[0])
                }
              />
              <button
                onClick={() => document.getElementById("plannedRoute").click()}
                className="w-full bg-[#0a2d51] border border-[#0c3a68] text-white p-2 rounded-sm text-[0.7rem] flex items-center gap-1 cursor-pointer flex-1 justify-center whitespace-nowrap hover:bg-[#0c3a68]"
              >
                <Upload size={14} />
                {formData.plannedRouteFile ? "file uploaded" : "Planned Route"}
              </button>
            </div>
          </div>
        </div>

        <div className="mt-0 sm:mt-4 flex flex-col gap-3">
          <button
            className="w-full p-3.5 rounded-sm font-semibold text-sm cursor-pointer transition-all duration-200 bg-[#0bb0f0] border border-[#0bb0f0] text-[#111b2b] shadow-[0_0_10px_rgba(11,176,240,0.25)] hover:bg-[#09a0d8] disabled:opacity-50 disabled:cursor-not-allowed"
            onClick={handleFlightInfoSubmit}
            disabled={isEvaluating}
          >
            {isEvaluating ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                    fill="none"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  />
                </svg>
                Evaluating...
              </span>
            ) : (
              "Evaluate Flight Risk"
            )}
          </button>
          <button
            className="w-full p-3.5 rounded-sm font-semibold text-sm cursor-pointer transition-all duration-200 bg-[#0a2d51] border border-[#0c3a68] text-white hover:bg-[#0c3a68]"
            onClick={() => handleSubmit("Log Pre-Flight Risk")}
          >
            Log Pre-Flight Risk
          </button>
        </div>
      </div>
    </div>
  );
}
