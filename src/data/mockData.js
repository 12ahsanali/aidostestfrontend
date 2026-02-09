export const AIRPORTS = {
  KJFK: { lat: 40.6413, lon: -73.7781 },
  KLAX: { lat: 33.9416, lon: -118.4085 },
  KORD: { lat: 41.9742, lon: -87.9073 },
  KATL: { lat: 33.6407, lon: -84.4277 },
  KDFW: { lat: 32.8998, lon: -97.0403 },
  OPIS: { lat: 33.549, lon: 72.8258 },
  LTBA: { lat: 40.9769, lon: 28.8146 },
  KBUR: { lat: 34.2007, lon: -118.3587 },
  KSNA: { lat: 33.6747, lon: -117.8692 },
  KVNY: { lat: 34.18, lon: -118.49 }
};

export const METAR_STATION_BY_POINT = {
  OPIS: 'OPIS'
};

export const VALID_AIRPORTS = Object.keys(AIRPORTS);

export const DEFAULT_FLIGHT_FORM = {
  departure: 'OPIS',
  destination: 'KJFK',
  departureCoords: '33.549, 72.8258',  // OPIS coordinates
  destinationCoords: '40.6413, -73.7781',  // KJFK coordinates
  stops: '',
  routeOption: 'aiODAS designed',
  pilotId: 'PILOT-AIO-0001',
  aircraftTailNumber: 'N12345',
  departureTime: '2026-01-20T14:30',
  missionType: 'Important'
};

export const MOCK_SUBMISSION_RECORDS = [
  {
    id: 'SUB-0001',
    status: 'logged',
    submittedAt: '2026-01-20T14:45',
    ...DEFAULT_FLIGHT_FORM
  }
];

const buildRoutePoints = (departure, destination, stops = []) => ([
  departure,
  ...stops,
  destination
]);

const buildRouteCoordinates = (routePoints) => routePoints.map((code) => ({
  code,
  lat: AIRPORTS[code].lat,
  lon: AIRPORTS[code].lon
}));

const AIRPORT_CODES = Object.keys(AIRPORTS);

export const MOCK_FLIGHTS = AIRPORT_CODES.flatMap((departure) => (
  AIRPORT_CODES.filter((destination) => destination !== departure)
    .map((destination) => {
      const stops = departure === 'OPIS' && destination === 'KJFK' ? ['LTBA'] : [];
      const routePoints = buildRoutePoints(departure, destination, stops);

      return {
        id: `FLT-${departure}-${destination}`,
        departure,
        destination,
        stops,
        routePoints,
        coordinates: buildRouteCoordinates(routePoints)
      };
    })
));

export const createSubmissionRecord = (formData, status = 'logged') => ({
  id: `SUB-${Math.floor(Math.random() * 9000) + 1000}`,
  status,
  submittedAt: new Date().toISOString().slice(0, 16),
  ...formData
});

export const MOCK_ROUTE_DATA = {
  type: 'FeatureCollection',
  routePoints: ['OPIS', 'LTBA', 'KJFK'],
  features: [
    {
      type: 'Feature',
      geometry: {
        type: 'LineString',
        coordinates: [
          [AIRPORTS.OPIS.lon, AIRPORTS.OPIS.lat],
          [AIRPORTS.LTBA.lon, AIRPORTS.LTBA.lat]
        ]
      },
      properties: {
        segment_id: 1,
        risk_level: 'LOW',
        color: '#4CAF50',
        advisory: 'Standard conditions in this sector',
        waypoints: [
          { name: 'OPIS (Start)', coords: [AIRPORTS.OPIS.lat, AIRPORTS.OPIS.lon], type: 'start' },
          { name: 'LTBA (Stay)', coords: [AIRPORTS.LTBA.lat, AIRPORTS.LTBA.lon], type: 'waypoint' }
        ]
      }
    },
    {
      type: 'Feature',
      geometry: {
        type: 'LineString',
        coordinates: [
          [AIRPORTS.LTBA.lon, AIRPORTS.LTBA.lat],
          [AIRPORTS.KJFK.lon, AIRPORTS.KJFK.lat]
        ]
      },
      properties: {
        segment_id: 2,
        risk_level: 'CRITICAL',
        color: '#F44336',
        advisory: 'Severe Turbulence forecasted in this sector',
        waypoints: [
          { name: 'KJFK (End)', coords: [AIRPORTS.KJFK.lat, AIRPORTS.KJFK.lon], type: 'end' }
        ]
      }
    }
  ]
};
