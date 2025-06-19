/* eslint-disable @typescript-eslint/no-unused-vars */
import { useEffect, useRef, useState } from 'react';
import './App.css';

import SendInput from './components/SendInput';
import Bubble from './components/Bubble';
import { Api } from '@julooga/doctor_guide_api_sdk';
import { useChat } from '@ai-sdk/react';

function App() {
  const divRef = useRef<HTMLDivElement>(null);
  const getButtonLabel = (isLoading: boolean) => {
    if (isLoading) {
      return '전송 중...';
    }

    return '전송';
  };

  const { messages, input, handleInputChange, handleSubmit, isLoading } =
    useChat({
      api: `${import.meta.env.VITE_API_URL}/med/chat/stream`,
    });

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('ko-KR', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  useEffect(() => {
    if (divRef.current && isLoading) {
      divRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isLoading]);

  return (
    <>
      <header className="max-w-md mx-auto sticky top-0 z-10 bg-black/80 backdrop-blur-sm border-b border-primary">
        <div className="flex items-center justify-between px-4 py-3">
          <div className="flex items-center gap-3">
            <div>
              <h1 className="text-lg font-bold text-white">Doctor Guide</h1>
              <p className="text-sm text-white/80">AI 예진 도우미</p>
            </div>
          </div>
        </div>
      </header>
      <main className="max-w-md mx-auto bg-base-200 relative">
        <section className="flex flex-col justify-between px-3">
          <div className="pt-5 pb-30 overflow-y-auto h-[calc(100svh-150px)]">
            <Bubble
              role="assistant"
              assistantContent={`안녕하세요!\nAI 예진 도우미 닥터 가이드입니다.\n증상을 듣고 적절한 진료과 안내와 증상 요약을 도와드릴게요.주의: 제 정보는 진단/처방이 아니며 의사 진료를 대신할 수 없습니다
              위급 시엔 즉시 119나 응급실로 가세요.\n이제, 어떻게 불편하신지 말씀해주시겠어요?`}
              assistantTime={formatTime(new Date())}
            />

            {messages.map((message) => {
              return (
                <Bubble
                  ref={divRef}
                  key={message.id}
                  role={message.role}
                  assistantContent={
                    message.role === 'assistant' ? message.content : ''
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
              <i>⚠️</i> Notice : This service does not provide medical
              consultations. If you need medical advice, please consult with a
              professional
            </em>
          </div>
        </section>
      </main>
    </>
  );
}

export default App;
