"use client";
import { useState } from "react";

export default function AnalysisPage() {
  const [imageBase64, setImageBase64] = useState("");
  const [result, setResult] = useState("");

  const convertToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
    });
  };

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const base64 = await convertToBase64(file);
    setImageBase64(base64.replace(/^data:image\/\w+;base64,/, ""));
  };

  const handleAnalyze = async () => {
    if (!imageBase64) {
      setResult("⚠️ 이미지를 먼저 업로드해주세요.");
      return;
    }

    try {
      setResult("🔍 AI 분석 중...⏳");

      const response = await fetch("/api/analyze", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ imageBase64 }),
      });

      const data = await response.json();

      if (response.ok) {
        setResult(`📌 분석 결과: ${data.result || "결과 없음"}`);
      } else {
        setResult(`❌ 오류 발생: ${data.error || "알 수 없는 오류"}`);
      }
    } catch (error) {
      console.error(error);
      setResult("❌ 서버 오류 발생");
    }
  };

  return (
    <div style={{ padding: 20 }}>
      <h2>🌾 작물 병해충 AI 분석</h2>

      <input type="file" accept="image/*" onChange={handleUpload} />

      <button onClick={handleAnalyze} style={{ marginTop: 10 }}>
        AI 분석 시작
      </button>

      <div style={{ marginTop: 20, whiteSpace: "pre-line" }}>
        {result && <p>{result}</p>}
      </div>
    </div>
  );
}