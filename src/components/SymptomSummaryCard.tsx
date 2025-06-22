import React, { useState } from 'react';

interface AssistantMessageProps {
  assistantContent: string;
}

const SymptomSummaryCard: React.FC<AssistantMessageProps> = ({
  assistantContent,
}) => {
  const [copied, setCopied] = useState(false);

  // 증상 요약 패턴 감지 함수
  const detectSymptomSummary = (content: string) => {
    const symptomKeywords = [
      'Main Symptom:',
      'Onset/Duration:',
      'Other Symptoms:',
      'Past Medical History:',
      'Medications:',
    ];

    // 증상 요약이 포함되어 있는지 확인
    const hasSymptomSummary = symptomKeywords.some((keyword) =>
      content.includes(keyword)
    );

    if (!hasSymptomSummary) {
      return {
        hasSymptoms: false,
        beforeSymptoms: content,
        symptoms: '',
        afterSymptoms: '',
      };
    }

    // 증상 요약 부분 추출
    const lines = content.split('\n');
    let symptomStartIndex = -1;
    let symptomEndIndex = -1;

    // 증상 요약 시작점 찾기
    for (let i = 0; i < lines.length; i++) {
      if (symptomKeywords.some((keyword) => lines[i].includes(keyword))) {
        if (symptomStartIndex === -1) symptomStartIndex = i;
        symptomEndIndex = i;
      } else if (symptomStartIndex !== -1 && lines[i].trim() === '') {
        continue; // 빈 줄은 건너뛰기
      } else if (symptomStartIndex !== -1) {
        break; // 증상 요약 끝
      }
    }

    if (symptomStartIndex === -1) {
      return {
        hasSymptoms: false,
        beforeSymptoms: content,
        symptoms: '',
        afterSymptoms: '',
      };
    }

    const beforeSymptoms = lines.slice(0, symptomStartIndex).join('\n').trim();
    const symptoms = lines
      .slice(symptomStartIndex, symptomEndIndex + 1)
      .join('\n')
      .trim();
    const afterSymptoms = lines
      .slice(symptomEndIndex + 1)
      .join('\n')
      .trim();

    return {
      hasSymptoms: true,
      beforeSymptoms,
      symptoms,
      afterSymptoms,
    };
  };

  // 복사 기능
  const handleCopySymptoms = async (symptomsText: string) => {
    try {
      await navigator.clipboard.writeText(symptomsText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('복사 실패:', err);
    }
  };

  // 증상 요약을 구조화된 형태로 렌더링
  const renderSymptomSummary = (symptomsText: string) => {
    const lines = symptomsText.split('\n');

    return (
      <div className="border p-2 rounded-2xl border-primary relative">
        <button
          type="button"
          onClick={() => handleCopySymptoms(symptomsText)}
          className={`absolute top-2 right-2 border px-2 py-1 h-fit rounded-md text-xs font-medium transition-all ${
            copied
              ? 'bg-primary text-white border-primary'
              : 'bg-white text-base-300 border-gray-300'
          }`}>
          {copied ? '✓ copied' : '📋 copy'}
        </button>

        <div className="pr-1">
          <div className="flex items-center mb-3">
            <span className="inline-block w-1 h-1 bg-secondary rounded-full mr-2"></span>
            <h4 className="font-semibold text-secondary text-sm">
              Symptom Summary
            </h4>
          </div>
          <div className="space-y-2">
            {lines.map((line, index) => {
              if (!line.trim()) return null;

              const [label, ...valueParts] = line.split(':');
              const value = valueParts.join(':').trim();

              if (!value) return null;

              const getLabelColor = (label: string | string[]) => {
                if (label.includes('Main Symptom'))
                  return 'text-red-600 bg-red-50';
                if (label.includes('Onset'))
                  return 'text-orange-600 bg-orange-50';
                if (label.includes('Other Symptoms'))
                  return 'text-yellow-600 bg-yellow-50';
                if (label.includes('Past Medical'))
                  return 'text-green-600 bg-green-50';
                if (label.includes('Medications'))
                  return 'text-purple-600 bg-purple-50';
                return 'text-gray-600 bg-gray-50';
              };

              return (
                <div
                  key={index}
                  className="flex items-start space-x-3">
                  <span
                    className={`inline-block p-1 rounded text-xs font-medium ${getLabelColor(
                      label
                    )}`}>
                    {label}:
                  </span>
                  <p className="text-sm text-primary-content">{value}</p>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  };

  const { hasSymptoms, beforeSymptoms, symptoms, afterSymptoms } =
    detectSymptomSummary(assistantContent);

  return (
    <div>
      {/* 증상 요약 이전 내용 */}
      {beforeSymptoms && <p>{beforeSymptoms}</p>}

      {/* 증상 요약 부분 */}
      {hasSymptoms && renderSymptomSummary(symptoms)}

      {/* 증상 요약 이후 내용 */}
      {afterSymptoms && (
        <div className="mt-4">
          <p className="text-gray-800 whitespace-pre-wrap">{afterSymptoms}</p>
        </div>
      )}

      {/* 증상 요약이 없는 경우 일반적으로 렌더링 */}
      {!hasSymptoms && (
        <p className="text-gray-800 whitespace-pre-wrap">{assistantContent}</p>
      )}
    </div>
  );
};

export default SymptomSummaryCard;
