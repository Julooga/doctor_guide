interface BubbleProps {
  role: 'user' | 'assistant' | 'system' | 'data';
  assistantContent?: string;
  senderContent?: string;
  assistantTime?: string;
  senderTime?: string;
}
export default function Bubble({
  role,
  assistantContent = '',
  senderContent = '',
  assistantTime = '12:45',
  senderTime = '12:46',
}: BubbleProps) {
  if (role === 'assistant') {
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
        <div className="chat-bubble">{assistantContent}</div>
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
      <div className="chat-header text-base-content">
        Me
        <time className="text-base-content/50">{senderTime}</time>
      </div>
    </div>
  );
}
