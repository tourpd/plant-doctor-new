"use client";

import { useState } from "react";

export default function AnalysisPage() {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [result, setResult] = useState<string | null>(null);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // -----------------------------
  // 🔥 파일 선택
  // -----------------------------
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;

    const selected = e.target.files[0];
    setFile(selected);

    const reader = new FileReader();
    reader.onload = (ev) => setPreview(ev.target?.result as string);
    reader.readAsDataURL(selected);
  };

  // -----------------------------
  // 🔥 서버 업로드 + 분석 요청
  // -----------------------------
  const handleAnalyze = async () => {
    if (!file) {
      alert("이미지를 선택해주세요.");
      return;
    }

    setLoading(true);
    setResult(null);

    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("/api/analyze", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (data.error) {
        alert(data.error);
      } else {
        setImageUrl(data.imageUrl);
        setResult(data.analysis);
      }
    } catch (error) {
      alert("분석 요청 중 오류가 발생했습니다.");
      console.error(error);
    }

    setLoading(false);
  };

  return (
    <div className="p-6 max-w-2xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold">병해충 진단 결과</h1>

      {/* 이미지 선택 */}
      <input type="file" accept="image/*" onChange={handleFileChange} />

      {/* 미리보기 */}
      {preview && (
        <div className="mt-4">
          <p className="font-semibold">선택한 이미지 미리보기</p>
          <img src={preview} className="w-full rounded-lg border" />
        </div>
      )}

      {/* 분석 버튼 */}
      <button
        onClick={handleAnalyze}
        disabled={loading}
        className="bg-green-600 text-white px-4 py-2 rounded-lg mt-4"
      >
        {loading ? "분석 중..." : "분석하기"}
      </button>

      {/* 서버에서 받은 이미지 */}
      {imageUrl && (
        <div>
          <p className="font-semibold mt-4">서버에 저장된 이미지</p>
          <img src={imageUrl} className="w-full rounded-lg border" />
        </div>
      )}

      {/* 분석 결과 */}
      {result && (
        <div className="mt-4 p-4 border rounded-lg bg-gray-50 whitespace-pre-wrap leading-relaxed">
          <h2 className="font-bold mb-2">📌 분석 결과</h2>
          {result}
        </div>
      )}
    </div>
  );
}