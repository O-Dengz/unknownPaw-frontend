declare namespace kakao {
  namespace maps {
    class Map {
      constructor(container: HTMLElement, options: MapOptions);
      setCenter(latlng: LatLng): void;
    }

    class LatLng {
      constructor(lat: number, lng: number);
    }

    class Marker {
      constructor(options: MarkerOptions);
      setMap(map: Map | null): void;
    }

    namespace services {
      const Status: {
        OK: string;
        ZERO_RESULT: string;
        ERROR: string;
      };

      class Geocoder {
        addressSearch(address: string, callback: (result: any[], status: string) => void): void;
      }
    }

    interface MapOptions {
      center: LatLng;
      level: number;
    }

    interface MarkerOptions {
      position: LatLng;
    }
  }
}

interface Window {
  kakao: typeof kakao;
} 