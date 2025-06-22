interface SendInputProps {
  isLoading: boolean;
  value: string;
  onChange?: (
    e:
      | React.ChangeEvent<HTMLInputElement>
      | React.ChangeEvent<HTMLTextAreaElement>
  ) => void;
}

export default function SendInput({
  isLoading,
  value,
  onChange,
}: SendInputProps) {
  return (
    <div className="textarea max-w-md relative rounded-box">
      <textarea
        disabled={isLoading}
        value={value}
        data-testid="send-input"
        name="send-input"
        id="send-input"
        autoFocus
        autoComplete="off"
        autoCorrect="off"
        spellCheck="false"
        maxLength={1000}
        rows={3}
        onChange={onChange}
        className="grow resize-none"
        placeholder="증상을 러프하게 써주세요. 꼭 문장으로 쓸 필요는 없어요. 예시: 두통, 기침, 열, 구토, 설사 등"
      />
      <button
        disabled={isLoading}
        aria-label="Send message"
        data-testid="send-button"
        type="submit"
        className="bg-accent w-8 h-8 flex items-center justify-center absolute bottom-3 right-3 rounded-full active:animate-jump active:animate-once disabled:opacity-50 disabled:pointer-events-none">
        <span className="icon-[tabler--send] text-base-content/80 size-4 shrink-0 "></span>
      </button>
    </div>
  );
}
