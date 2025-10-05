import { Geolocation } from '@capacitor/geolocation';
import { Capacitor } from '@capacitor/core';

export interface LocationCoords {
  latitude: number;
  longitude: number;
}

export const getCurrentPosition = async (): Promise<LocationCoords | null> => {
  try {
    if (!Capacitor.isNativePlatform()) {
      // Use browser geolocation API for web
      return new Promise((resolve) => {
        if ('geolocation' in navigator) {
          navigator.geolocation.getCurrentPosition(
            (position) => {
              resolve({
                latitude: position.coords.latitude,
                longitude: position.coords.longitude,
              });
            },
            (error) => {
              console.error('Error getting position:', error);
              resolve(null);
            }
          );
        } else {
          resolve(null);
        }
      });
    }

    // Use Capacitor Geolocation for native platforms
    const position = await Geolocation.getCurrentPosition({
      enableHighAccuracy: true,
      timeout: 10000,
    });

    return {
      latitude: position.coords.latitude,
      longitude: position.coords.longitude,
    };
  } catch (error) {
    console.error('Error getting current position:', error);
    return null;
  }
};

export const getGoogleMapsUrl = (latitude: number, longitude: number): string => {
  return `https://www.google.com/maps?q=${latitude},${longitude}`;
};

export const getLocationPreviewUrl = (latitude: number, longitude: number): string => {
  // Using OpenStreetMap static map API (free alternative to Google Maps Static API)
  return `https://www.openstreetmap.org/export/embed.html?bbox=${longitude - 0.01},${latitude - 0.01},${longitude + 0.01},${latitude + 0.01}&layer=mapnik&marker=${latitude},${longitude}`;
};
