"use client";

import { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";

export default function QuestionsPage() {
  const router = useRouter();
  const params = useSearchParams();
  const urls = params.get("urls") ? JSON.parse(params.get("urls")!) : [];

  const [answers, setAnswers] = useState<{ [key: string]: string }>({});
  const [questions, setQuestions] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function generateQuestions() {
      // Gemini / GPT 연결 전에 임시 시나리오
      const mock = [
        "언제부터 증상이 나타났나요?",
        "최근 비료 또는 영양제 사용 이력이 있습니까?",
        "물주기 주기는 어떻게 되나요?",
        "햇빛은 하루 몇 시간 정도 받나요?"
      ];
      setQuestions(mock);
      setLoading(false);
    }
    generateQuestions();
  }, []);

  function handleChange(idx: number, value: string) {
    setAnswers({ ...answers, [idx]: value });
  }

  function handleNext() {
    router.push(`/final?urls=${encodeURIComponent(JSON.stringify(urls))}&answers=${encodeURIComponent(JSON.stringify(answers))}`);
  }

  if (loading) return <h2 style={{ padding: 20 }}>질문 생성 중…</h2>;

  return (
    <div style={{ padding: 20, fontSize: 18 }}>
      <h2>📋 추가 질문</h2>
      <p>정확한 진단을 위해 아래 질문에 답해주세요.</p>
      <br />

      {questions.map((q, i) => (
        <div key={i} style={{ marginBottom: 16 }}>
          <b>{i + 1}. {q}</b><br />
          <input
            style={{ width: "100%", marginTop: 6, padding: 8, fontSize: 16, borderRadius: 6, border: "1px solid #ccc" }}
            placeholder="답변 입력"
            onChange={(e) => handleChange(i, e.target.value)}
          />
        </div>
      ))}

      <button
        onClick={handleNext}
        style={{
          background: "#28a745",
          color: "white",
          padding: "12px 20px",
          fontSize: 18,
          borderRadius: 8,
          border: "none",
          cursor: "pointer",
          marginTop: 20
        }}
      >
        최종 진단 보기 ▶
      </button>
    </div>
  );
}
