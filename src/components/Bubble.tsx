import type { Ref } from 'react';

interface BubbleProps {
  role: 'user' | 'assistant' | 'system' | 'data';
  assistantContent?: string;
  senderContent?: string;
  assistantTime?: string;
  senderTime?: string;
  ref?: Ref<HTMLDivElement>;
  isLoading?: boolean;
}
export default function Bubble({
  role,
  ref,
  assistantContent = '',
  senderContent = '',
  assistantTime = '12:45',
  senderTime = '12:46',
  isLoading,
}: BubbleProps) {
  if (isLoading) {
    return (
      <div className="chat chat-receiver align-self-end w-full">
        <div className="chat-avatar avatar">
          <div className="size-10 rounded-full">
            <img
              src="/logo.png"
              className="rounded-full"
              alt="avatar"
            />
          </div>
        </div>
        <div className="chat-header text-base-content flex items-center gap-1">
          Doctor Guide
          <time className="text-base-content/50">{assistantTime}</time>
        </div>
        <div className="chat-bubble animate-fade animate-duration-500 animate-delay-[10ms] flex-col text-md">
          <div className="flex items-center gap-2 py-2">
            <div className="flex gap-1">
              <div className="w-2 h-2 bg-current rounded-full animate-bounce [animation-delay:-0.3s]"></div>
              <div className="w-2 h-2 bg-current rounded-full animate-bounce [animation-delay:-0.15s]"></div>
              <div className="w-2 h-2 bg-current rounded-full animate-bounce"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (role === 'assistant' || role === 'system' || role === 'data') {
    return (
      <div className="chat chat-receiver align-self-end">
        <div className="chat-avatar avatar">
          <div className="size-10 rounded-full">
            <img
              src="/logo.png"
              className="rounded-full"
              alt="avatar"
            />
          </div>
        </div>
        <div className="chat-header text-base-content flex items-center gap-1">
          Doctor Guide
          <time className="text-base-content/50">{assistantTime}</time>
        </div>
        <div
          ref={ref}
          className="chat-bubble animate-fade animate-duration-500 animate-delay-[10ms] flex-col text-md">
          {assistantContent.split(/([?.]|\n)/).map((part, index) => {
            if (part === '\n') {
              return <br key={index} />;
            }

            if (part === '?' || part === '.') {
              return <span key={index}>{part}</span>;
            }
            if (part.trim()) {
              const trimmedPart = part.trim();
              if (trimmedPart.includes('주의')) {
                return (
                  <span
                    key={`${index}-warning`}
                    className="inline-flex items-start gap-1 text-error py-1">
                    <i>⚠️</i>
                    {trimmedPart}
                  </span>
                );
              }
              return (
                <span
                  key={index}
                  className={part.includes('\n') ? 'block' : 'inline'}>
                  {part.trim()}
                </span>
              );
            }
            return null;
          })}
        </div>
      </div>
    );
  }

  return (
    <div className="chat chat-sender animate-fade-up animate-duration-300 animate-delay-[10ms] ">
      <div
        style={{
          textAlign: 'start',
        }}
        className="chat-bubble wrap-break-word">
        {senderContent}
      </div>
      <div className="chat-header text-base-content flex items-center gap-1">
        Me
        <time className="text-base-content/50">{senderTime}</time>
      </div>
    </div>
  );
}
