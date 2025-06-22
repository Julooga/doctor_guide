import { useEffect, useRef } from 'react';
import './App.css';
import SendInput from './components/SendInput';
import Bubble from './components/Bubble';
import { useChat } from '@ai-sdk/react';

function App() {
  const divRef = useRef<HTMLDivElement>(null);

  const { messages, input, handleInputChange, handleSubmit, isLoading } =
    useChat({
      api: `${import.meta.env.VITE_API_URL}/med/chat/stream`,
      initialMessages: [
        {
          role: 'system',
          content: `안녕하세요!\nAI 예진 도우미 닥터 가이드입니다.\n증상을 듣고 적절한 진료과 안내와 증상 요약을 도와드릴게요.주의: 제 정보는 진단/처방이 아니며 의사 진료를 대신할 수 없습니다
          위급 시엔 즉시 119나 응급실로 가세요.\n이제, 어떻게 불편하신지 말씀해주시겠어요?`,
          id: '1',
        },
      ],
    });

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('ko-KR', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  // const getCurrentLocation = (): Promise<GeolocationPosition> => {
  //   return new Promise((resolve, reject) => {
  //     if (!navigator.geolocation) {
  //       reject(new Error('Geolocation을 지원하지 않습니다.'));
  //     }
  //     navigator.geolocation.getCurrentPosition(resolve, reject, {
  //       enableHighAccuracy: true,
  //       timeout: 10000,
  //       maximumAge: 600000,
  //     });
  //   });
  // };

  // const fetchPharmacies = async () => {
  //   console.log('fetchPharmacies 함수 시작!'); // 디버깅용 로그
  //   const position = await getCurrentLocation();
  //   console.log('현재 위치:', {
  //     latitude: position.coords.latitude,
  //     longitude: position.coords.longitude,
  //   });

  //   const latitude = position.coords.latitude;
  //   const longitude = position.coords.longitude;
  //   // await getLocationByIP().then((location) => {
  //   //   console.log("IP 기반 위치 정보:", location);
  //   // });

  //   const response = await fetch(
  //     `https://dapi.kakao.com/v2/local/search/category.json?category_group_code=HP8&ㅅ&x=${longitude}&y=${latitude}`,
  //     {
  //       method: 'GET',
  //       headers: {
  //         Authorization: `KakaoAK ${import.meta.env.VITE_KAKAO_REST_API_KEY}`,
  //       },
  //     }
  //   );

  //   if (!response.ok) {
  //     throw new Error(`HTTP error! status: ${response.status}`);
  //   }

  //   const data = await response.json();
  //   return data;
  // };

  useEffect(() => {
    if (divRef.current && isLoading) {
      divRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [isLoading]);

  return (
    <>
      <header className="max-w-md mx-auto sticky top-0 z-10 bg-black/80 backdrop-blur-sm border-b border-primary">
        <div className="flex items-center justify-between px-4 py-3">
          <div className="flex items-center gap-3">
            <div>
              <h1 className="text-lg font-bold text-white">Doctor Guide</h1>
              <p className="text-sm text-white/80">AI 예진 도우미</p>{' '}
            </div>
          </div>
        </div>
      </header>
      <main className="max-w-md mx-auto bg-base-200 relative">
        <section className="flex flex-col justify-between px-3">
          <div className="pt-5 pb-30 overflow-y-auto h-[calc(100svh-150px)]">
            {messages.map((message) => {
              return (
                <Bubble
                  ref={divRef}
                  key={message.id}
                  role={message.role}
                  assistantContent={
                    message.role === 'assistant' ||
                    message.role === 'system' ||
                    message.role === 'data'
                      ? message.content
                      : ''
                  }
                  senderContent={message.role === 'user' ? message.content : ''}
                  assistantTime={formatTime(new Date())}
                  senderTime={formatTime(new Date())}
                />
              );
            })}
            {isLoading && (
              <Bubble
                isLoading={true}
                ref={divRef}
                role="assistant"
                assistantContent=""
                assistantTime={formatTime(new Date())}
              />
            )}
          </div>

          <div className="flex flex-col gap-3 fixed bottom-0 max-w-md p-2 w-full left-1/2 -translate-x-1/2 bg-base-200">
            <form
              onSubmit={handleSubmit}
              className="flex gap-3">
              <SendInput
                {...{
                  isLoading,
                  value: input,
                  onChange: handleInputChange,
                }}
              />
            </form>
            <em className="text-xs text-warning flex gap-2">
              <span>
                <i>⚠️</i>이 서비스는 의학적 조언을 제공하지 않습니다. 응급
                상황에서는 즉시 전문가의 도움을 받으세요.
              </span>
            </em>
          </div>
        </section>
      </main>
    </>
  );
}

export default App;
