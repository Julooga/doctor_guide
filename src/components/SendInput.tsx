import { type Dispatch, type SetStateAction } from 'react';

interface SendInputProps {
  v: string;
  setValue: Dispatch<SetStateAction<string>>;
}

export default function SendInput({ v, setValue }: SendInputProps) {
  return (
    <div className="textarea max-w-md relative rounded-box">
      <textarea
        value={v}
        rows={3}
        onChange={(e) => {
          setValue(e.target.value);
        }}
        className="grow resize-none"
        placeholder="Hello!!!"
      />
      <button
        onClick={() => {
          console.log('Send message:', v);
        }}
        aria-label="Send message"
        data-testid="send-button"
        type="button"
        className="bg-accent w-8 h-8 flex items-center justify-center absolute bottom-3 right-3 rounded-full active:animate-jump active:animate-once">
        <span className="icon-[tabler--send] text-base-content/80 size-4 shrink-0 "></span>
      </button>
    </div>
  );
}
