import { FC, useEffect, useState } from 'react';
import { GoogleMap, LoadScript, Marker, InfoWindow } from '@react-google-maps/api';
import { Box, Spinner } from '@chakra-ui/react';
import Image from 'next/image';

interface Point {
  name: string;
  location: {
    lat: number;
    lng: number;
  };
  address?: string;
  phone?: string;
  photos?: string[];
  rating?: number;
}

interface MapProps {
  center: { lat: number; lng: number };
  onPointsUpdate: (points: Point[]) => void;
}

const containerStyle = {
  width: '100%',
  height: '400px',
};

const Map: FC<MapProps> = ({ center, onPointsUpdate }) => {
  const [loading, setLoading] = useState<boolean>(true);
  const [selected, setSelected] = useState<Point | null>(null);

  useEffect(() => {
    const fetchPlaces = () => {
      const service = new window.google.maps.places.PlacesService(document.createElement('div'));

      const request: google.maps.places.PlaceSearchRequest = {
        location: center,
        radius: 5000,
        type: 'tourist_attraction',
      };

      service.nearbySearch(request, (results, status) => {
        if (status === window.google.maps.places.PlacesServiceStatus.OK && results) {
          const places: Point[] = results.map((result) => {
            const photos = result.photos ? result.photos.map((photo) => photo.getUrl({ maxWidth: 400 })) : [];
            return {
              name: result.name || '',
              location: {
                lat: result.geometry?.location?.lat() || 0,
                lng: result.geometry?.location?.lng() || 0,
              },
              address: result.vicinity || '',
              phone: result.formatted_phone_number || '',
              photos,
              rating: result.rating || 0,
            };
          });
          onPointsUpdate(places);
        } else {
          onPointsUpdate([]); // No results or error, still update
        }
        setLoading(false); // Loading is complete
      });
    };

    if (window.google) {
      fetchPlaces();
    } else {
      const handleGoogleLoad = () => {
        fetchPlaces();
      };
      window.addEventListener('googleLoaded', handleGoogleLoad);
      return () => {
        window.removeEventListener('googleLoaded', handleGoogleLoad);
      };
    }
  }, [center, onPointsUpdate]);

  return (
    <LoadScript
      googleMapsApiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY!}
      libraries={['places']}
    >
      <Box position="relative" width="100%" height="400px" boxShadow="md" borderRadius="md" overflow="hidden" mt={4} borderWidth="1px" borderColor="gray.200">
        {loading ? (
          <Box display="flex" justifyContent="center" alignItems="center" height="100%">
            <Spinner size="xl" />
          </Box>
        ) : (
          <GoogleMap mapContainerStyle={containerStyle} center={center} zoom={12}>
            {selected && (
              <InfoWindow position={selected.location} onCloseClick={() => setSelected(null)}>
                <div>
                  <h2>{selected.name}</h2>
                  <p>{selected.address}</p>
                  <p>{selected.phone}</p>
                  {selected.photos &&
                    selected.photos.map((photo, index) => (
                      <Image key={index} src={photo} alt={selected.name} width={100} height={100} />
                    ))}
                  <p>Rating: {selected.rating}</p>
                </div>
              </InfoWindow>
            )}
          </GoogleMap>
        )}
      </Box>
    </LoadScript>
  );
};

export default Map;
