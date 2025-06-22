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
          content: `Hello!\n This is Dr. Guide, your AI pre-diagnosis assistant. I'll guide you to the best primary care department for your symptoms and summarize your condition, saving you time.\n Important: My information is not a diagnosis or prescription and cannot replace a doctor's consultation. In emergencies, please call 911 or go to the nearest emergency room immediately.\nNow, tell me roughly what's bothering you?`,
          id: 'chat_123456789',
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
              <h1 className="text-lg font-bold text-white">Dr.Guide</h1>
              <p className="text-sm text-white/80">
                AI Pre-diagnosis Assistant
              </p>
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
                <i>⚠️</i>This service does not provide medical advice. In
                emergencies, please seek immediate professional help.
              </span>
            </em>
          </div>
        </section>
      </main>
    </>
  );
}

export default App;
