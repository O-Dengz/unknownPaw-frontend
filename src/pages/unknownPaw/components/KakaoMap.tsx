import { useEffect, useRef, useState } from "react";

interface KakaoMapProps {
  latitude: number | null;
  longitude: number | null;
  address: string;
}

declare global {
  interface Window {
    kakao: typeof kakao;
  }
}

const KakaoMap = ({ latitude, longitude, address }: KakaoMapProps) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstance = useRef<any>(null);
  const [isScriptLoaded, setIsScriptLoaded] = useState(false);

  useEffect(() => {
    const checkKakaoMap = () => {
      if (window.kakao && window.kakao.maps) {
        setIsScriptLoaded(true);
        return true;
      }
      return false;
    };

    if (checkKakaoMap()) {
      return;
    }

    const interval = setInterval(() => {
      if (checkKakaoMap()) {
        clearInterval(interval);
      }
    }, 100);

    setTimeout(() => {
      clearInterval(interval);
    }, 5000);

    return () => {
      clearInterval(interval);
    };
  }, []);

  useEffect(() => {
    if (!isScriptLoaded) {
      return;
    }

    const initMap = () => {
      try {
        if (!mapRef.current) {
          return;
        }

        if (mapInstance.current) {
          mapInstance.current = null;
        }

        const map = new window.kakao.maps.Map(mapRef.current, {
          center: new window.kakao.maps.LatLng(latitude || 35.1795543, longitude || 129.0756416),
          level: 3
        });

        const marker = new window.kakao.maps.Marker({
          position: new window.kakao.maps.LatLng(latitude || 35.1795543, longitude || 129.0756416)
        });

        marker.setMap(map);
        mapInstance.current = map;
      } catch (error) {
        console.error("지도 생성 중 오류 발생:", error);
      }
    };

    initMap();

    return () => {
      if (mapInstance.current) {
        mapInstance.current = null;
      }
    };
  }, [isScriptLoaded, latitude, longitude, address]);

  if (!isScriptLoaded) {
    return (
      <div
        style={{
          width: "100%",
          height: "400px",
          borderRadius: "12px",
          marginTop: "24px",
          boxShadow: "rgba(0, 0, 0, 0.1) 0px 0px 10px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#f5f5f5",
        }}
      >
        지도를 불러오는 중...
      </div>
    );
  }

  return (
    <div
      ref={mapRef}
      style={{
        width: "100%",
        height: "400px",
        borderRadius: "12px",
        marginTop: "24px",
        boxShadow: "rgba(0, 0, 0, 0.1) 0px 0px 10px",
      }}
    />
  );
};

export default KakaoMap;
