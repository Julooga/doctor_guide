/* eslint-disable @typescript-eslint/no-unused-vars */
import { useRef, useState } from 'react';
import './App.css';
import { useChat } from '@ai-sdk/react';
import SendInput from './components/SendInput';
import Bubble from './components/Bubble';
import { Api } from '@julooga/doctor_guide_api_sdk';

function App() {
  const [t, setT] = useState('');
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const getButtonLabel = (isLoading: boolean) => {
    if (isLoading) {
      return '전송 중...';
    }

    return '전송';
  };

  const getMessageStyles = (role: string) => {
    const baseStyles = 'max-w-[80%] p-4 rounded-lg mb-4';

    if (role === 'user') {
      return `${baseStyles} bg-blue-500 text-white ml-auto`;
    }

    if (role === 'assistant') {
      return `${baseStyles} bg-gray-100 text-gray-800 mr-auto border border-gray-200`;
    }

    return `${baseStyles} bg-green-50 text-green-800 mx-auto text-center border border-green-200`;
  };
  const api = new Api({
    baseURL: 'https://1acgaqfa8f.execute-api.ap-northeast-2.amazonaws.com',
  });
  const { messages, input, handleInputChange, handleSubmit, isLoading } =
    useChat({
      api: 'https://q0av814jfh.execute-api.ap-northeast-2.amazonaws.com/med/chat/stream',
    });
  return (
    <main className="max-w-md mx-auto h-screen bg-base-200">
      <section className="flex flex-col justify-between h-full p-3">
        <div>
          <Bubble
            role="assistant"
            assistantContent="안녕하세요! 무엇을 도와드릴까요?"
            assistantTime="12:44"
          />
          {messages.map((message) => (
            <Bubble
              key={message.id}
              role={message.role}
              assistantContent={
                message.role === 'assistant' ? message.content : ''
              }
              senderContent={message.role === 'user' ? message.content : ''}
              assistantTime={'12:45'}
              senderTime={'12:46'}
            />
          ))}
        </div>
        <div className="border-t border-gray-200 p-4 bg-white">
          <form
            onSubmit={handleSubmit}
            className="flex gap-3">
            <input
              value={input}
              onChange={handleInputChange}
              placeholder="증상을 설명해주세요..."
              disabled={isLoading}
              className="flex-1 p-3 border border-gray-300 rounded-lg
              focus:outline-none focus:ring-2 focus:ring-blue-500
              focus:border-transparent disabled:bg-gray-100
              disabled:cursor-not-allowed text-black"
            />
            <button
              type="submit"
              className="px-6 py-3 bg-blue-600 text-white rounded-lg
              hover:bg-blue-700 focus:outline-none focus:ring-2
              focus:ring-blue-500 focus:ring-offset-2 disabled:bg-gray-400
              disabled:cursor-not-allowed transition-colors duration-200
              font-medium">
              전송
            </button>
          </form>

          <div className="mt-2 text-xs text-gray-500 text-center">
            ⚠️ 이 서비스는 의학적 조언을 제공하지 않습니다. 응급상황 시 즉시
            의료진에게 연락하세요.
          </div>
        </div>

        {/* <SendInput {...{ v: t, setValue: setT }} /> */}
      </section>
    </main>
  );
}

export default App;
