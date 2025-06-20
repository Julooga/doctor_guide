/* eslint-disable @typescript-eslint/no-explicit-any */
export const runLocationDiagnostic = async () => {
  console.log("🔍 위치 서비스 완전 진단 시작");

  // 1. 기본 환경 체크
  console.log("1. 기본 환경:");
  console.log("   - 브라우저:", navigator.userAgent);
  console.log("   - HTTPS:", location.protocol === "https:");
  console.log("   - localhost:", location.hostname === "localhost");
  console.log("   - Geolocation 지원:", !!navigator.geolocation);

  // 2. 권한 상태 체크
  if ("permissions" in navigator) {
    try {
      const permission = await navigator.permissions.query({
        name: "geolocation",
      });
      console.log("2. 권한 상태:", permission.state);

      permission.addEventListener("change", () => {
        console.log("   권한 변경됨:", permission.state);
      });
    } catch (e) {
      console.log("2. 권한 확인 실패:", e);
    }
  }

  // 3. 위치 요청 테스트 (여러 옵션으로)
  const testConfigs = [
    {
      name: "고정밀도",
      options: { enableHighAccuracy: true, timeout: 15000, maximumAge: 0 },
    },
    {
      name: "저정밀도",
      options: {
        enableHighAccuracy: false,
        timeout: 30000,
        maximumAge: 600000,
      },
    },
    {
      name: "캐시허용",
      options: {
        enableHighAccuracy: false,
        timeout: 60000,
        maximumAge: 3600000,
      },
    },
  ];

  for (const config of testConfigs) {
    console.log(`3. ${config.name} 테스트 시작...`);

    try {
      const position = await new Promise<GeolocationPosition>(
        (resolve, reject) => {
          navigator.geolocation.getCurrentPosition(
            resolve,
            reject,
            config.options
          );
        }
      );

      console.log(`   ✅ ${config.name} 성공:`);
      console.log(`   위도: ${position.coords.latitude}`);
      console.log(`   경도: ${position.coords.longitude}`);
      console.log(`   정확도: ${position.coords.accuracy}m`);
      return position; // 성공하면 바로 리턴
    } catch (error: any) {
      console.log(`   ❌ ${config.name} 실패:`, error.code, error.message);
    }
  }

  // 4. 대체 방법들
  console.log("4. 대체 방법 시도...");

  try {
    // IP 기반 위치
    const ipResponse = await fetch("https://ipapi.co/json/");
    const ipData = await ipResponse.json();
    console.log(
      "   IP 기반 위치:",
      ipData.city,
      ipData.latitude,
      ipData.longitude
    );
  } catch (e) {
    console.log("   IP 기반 위치 실패:", e);
  }
};
interface ILocation {
  latitude: number;
  longitude: number;
  accuracy?: number;
  source: "gps" | "ip" | "default";
}

// 브라우저 콘솔에서 사용할 수 있도록 전역 등록
(window as any).runLocationDiagnostic = runLocationDiagnostic;
export const getLocationByIP = async (): Promise<ILocation> => {
  const ipServices = {
    name: "ipinfo.io",
    url: "https://ipinfo.io/json",
    parser: (data: any) => {
      const [lat, lng] = data.loc.split(",");
      return { lat: parseFloat(lat), lng: parseFloat(lng), city: data.city };
    },
  };

  const response = await fetch(ipServices.url);
  if (!response.ok) {
    return {
      latitude: 0,
      longitude: 0,
      accuracy: undefined,
      source: "default",
    };
  }
  const data = await response.json();
  const parsed = ipServices.parser(data);
  return {
    latitude: parsed.lat,
    longitude: parsed.lng,
    accuracy: undefined,
    source: "ip",
  };
};
