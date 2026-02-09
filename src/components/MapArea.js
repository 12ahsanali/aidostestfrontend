'use client';
import { useEffect, useRef ,useState} from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { AIRPORTS } from '../data/mockData';

export default function MapArea({destination,departure, routeData }) {
    const mapRef = useRef(null);
    const mapInstanceRef = useRef(null);
    const layersRef = useRef([]);
    const [metarByStation, setMetarByStation] = useState({});

    // Get real weather data from API response if available
    const getWeatherFromApi = (airportCode) => {
        if (!routeData?.flightData) return null;
        
        const flightData = routeData.flightData;
        
        // Check departure (supports both ICAO and coordinate-based responses)
        if (flightData.departure && flightData.departure.icao === airportCode) {
            return flightData.departure.weather;
        }
        
        // Check destination (supports both ICAO and coordinate-based responses)
        if (flightData.destination && flightData.destination.icao === airportCode) {
            return flightData.destination.weather;
     }
        
        // Check stops (supports both ICAO and coordinate-based responses)
        if (flightData.stops) {
            const stop = flightData.stops.find(stop => stop.icao === airportCode);
            return stop?.weather || null;
        }
        
        return null;
    };
   
    useEffect(() => {
        if (!mapRef.current || mapInstanceRef.current) return;

        mapInstanceRef.current = L.map(mapRef.current, {
            center: [39.8283, -98.5795],
            zoom: 4,
            zoomControl: true,
        });

        mapInstanceRef.current.createPane('routePane');
        mapInstanceRef.current.getPane('routePane').style.zIndex = 400;
        mapInstanceRef.current.createPane('markerPane');
        mapInstanceRef.current.getPane('markerPane').style.zIndex = 650;

        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            className: 'grayscale-tiles',
            attribution: '© OpenStreetMap contributors'
        }).addTo(mapInstanceRef.current);

        return () => {
            if (mapInstanceRef.current) {
                mapInstanceRef.current.remove();
                mapInstanceRef.current = null;
            }
        };
    }, []);

    useEffect(() => {
        if (!mapInstanceRef.current) return;
        // Clear existing layers
        layersRef.current.forEach(layer => layer.remove());
        layersRef.current = [];

        const routeCodes = routeData?.routePoints?.length
            ? routeData.routePoints
            : [];

        const routePoints = routeCodes
            .map((code) => {
                const apiWeather = getWeatherFromApi(code);
                if (apiWeather) {
                    return { 
                        code, 
                        data: { 
                            lat: apiWeather.lat, 
                            lon: apiWeather.lon 
                        },
                        weather: apiWeather
                    };
                }
                return { 
                    code, 
                    data: AIRPORTS[code],
                    weather: null
                };
            })
            .filter((point) => Boolean(point.data));

        if (routePoints.length < 2) return;

        const markers = routePoints.map((point, index) => {
            const isStart = index === 0;
            const isEnd = index === routePoints.length - 1;
            const fillColor = isStart ? '#4CAF50' : isEnd ? '#F44336' : '#F59E0B';
            const label = isStart ? 'Departure' : isEnd ? 'Destination' : 'Stop';

            const apiWeather = point.weather;
            const metar = metarByStation?.[point.code];

            let popupContent;
            if (apiWeather) {
                const reportTime = new Date(apiWeather.reportTime).toLocaleString();
                popupContent = `${label}: ${point.code}<br/>` +
                    `Airport: ${apiWeather.name}<br/>` +
                    `Report Time: ${reportTime}<br/>` +
                    `Temperature: ${apiWeather.temp}°C<br/>` +
                    `Dew Point: ${apiWeather.dewp}°C<br/>` +
                    `Wind: ${apiWeather.wdir}° at ${apiWeather.wspd} kt<br/>` +
                    `Visibility: ${apiWeather.visib}+ km<br/>` +
                    `Altimeter: ${apiWeather.altim} hPa<br/>` +
                    `Flight Category: ${apiWeather.fltCat}<br/>` +
                    `Cloud Cover: ${apiWeather.cover}<br/>` 
            } else {
                popupContent = `${label}: ${point.code}<br/>Weather data not available`;
            }
            return L.circleMarker([point.data.lat, point.data.lon], {
                pane: 'markerPane',
                radius: 6,
                fillColor,
                color: '#fff',
                weight: 2,
                fillOpacity: 1
            }).addTo(mapInstanceRef.current).bindPopup(
                popupContent
            );
        });
        layersRef.current.push(...markers);
        const polyline = L.polyline(
            routePoints.map((point) => [point.data.lat, point.data.lon]),
            {
                pane: 'routePane',
                color: '#3b82f6',
                weight: 3,
                opacity: 0.8
            }
        ).addTo(mapInstanceRef.current);
        layersRef.current.push(polyline);

        mapInstanceRef.current.fitBounds(polyline.getBounds(), { padding: [50, 50] });
    }, [departure, destination, routeData]);

    return (
    <div 
      ref={mapRef} 
      className="flex-1 w-full h-full min-h-[400px] bg-[#1a1a1a] relative z-10 lg:w-full max-sm:min-h-[300px] max-sm:h-[300px] max-sm:my-2"
    />
);
}