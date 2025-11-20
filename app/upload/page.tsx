"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { storage } from "@/lib/firebase";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

export default function UploadPage() {
  const router = useRouter();
  const [images, setImages] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);
  const [cropName, setCropName] = useState("");
  const [memo, setMemo] = useState("");
  const [uploading, setUploading] = useState(false);

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    const files = Array.from(e.target.files).slice(0, 4);
    setImages(files);
    setPreviews(files.map(f => URL.createObjectURL(f)));
  };

  const handleUpload = async () => {
    if (images.length === 0) {
      alert("오늘 작물 사진을 최소 1장은 올려주세요.");
      return;
    }
    try {
      setUploading(true);

      // 1) Firebase Storage 업로드
      const uploadTasks = images.map(async (image) => {
        const storageRef = ref(storage, `journal/${Date.now()}_${image.name}`);
        await uploadBytes(storageRef, image);
        return await getDownloadURL(storageRef);
      });
      const urls = await Promise.all(uploadTasks);

      // 2) 일지 저장 API 호출
      const res = await fetch("/api/entry", {
        method: "POST",
        body: JSON.stringify({
          cropName: cropName || "미지정 작물",
          memo,
          imageUrls: urls,
          createdAt: new Date().toISOString(),
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data?.message || "저장 실패");
      }

      // 3) 분석 페이지로 이동 (entryId, imageUrls 전달)
      const query = new URLSearchParams({
        entryId: data.entryId,
        images: JSON.stringify(urls),
      }).toString();

      router.push(`/analysis?${query}`);
    } catch (e) {
      console.error(e);
      alert("업로드/저장 중 오류가 발생했습니다. 다시 시도해주세요.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <main style={{ padding: 20, maxWidth: 520, margin: "0 auto" }}>
      <h1 style={{ fontSize: 24, fontWeight: 700, marginBottom: 8 }}>
        🌱 Farming Journal
      </h1>
      <p style={{ marginBottom: 16 }}>
        오늘 농부님의 작물은 어떤 하루를 보내고 있나요?<br />
        사진과 한 줄 메모만 남겨도, Dr. Crop이 함께 기록해드립니다.
      </p>

      <label style={{ display: "block", marginBottom: 8, fontWeight: 600 }}>
        작물 이름
      </label>
      <input
        value={cropName}
        onChange={e => setCropName(e.target.value)}
        placeholder="예: 딸기 설향, 노지마늘, 하우스오이…"
        style={{
          width: "100%",
          padding: 10,
          borderRadius: 8,
          border: "1px solid #ccc",
          marginBottom: 16,
        }}
      />

      <label style={{ display: "block", marginBottom: 8, fontWeight: 600 }}>
        오늘 작물 상태 한 줄 메모
      </label>
      <textarea
        value={memo}
        onChange={e => setMemo(e.target.value)}
        placeholder="예: 잎은 무성한데 열매는 적은 느낌, 비가 계속 와서 습도가 높음 등"
        rows={3}
        style={{
          width: "100%",
          padding: 10,
          borderRadius: 8,
          border: "1px solid #ccc",
          marginBottom: 16,
        }}
      />

      <label style={{ display: "block", marginBottom: 8, fontWeight: 600 }}>
        작물 사진 (최대 4장)
      </label>
      <input
        type="file"
        accept="image/*"
        multiple
        onChange={handleFileInput}
        style={{ marginBottom: 12 }}
      />
      <p style={{ fontSize: 13, color: "#555", marginBottom: 12 }}>
        📸 잎, 줄기, 열매, 흙이 함께 나오면 더 정확한 분석이 가능합니다.
      </p>

      <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 16 }}>
        {previews.map((src, idx) => (
          <img
            key={idx}
            src={src}
            alt="preview"
            style={{
              width: "48%",
              height: 120,
              objectFit: "cover",
              borderRadius: 8,
              border: "1px solid #aaa",
            }}
          />
        ))}
      </div>

      <button
        onClick={handleUpload}
        disabled={uploading}
        style={{
          width: "100%",
          padding: 14,
          borderRadius: 10,
          border: "none",
          fontSize: 18,
          fontWeight: 700,
          cursor: uploading ? "not-allowed" : "pointer",
          backgroundColor: uploading ? "#777" : "#0b7b2d",
          color: "white",
        }}
      >
        {uploading ? "⏳ 기록 저장 & 분석 중…" : "🔍 오늘 기록 남기고 분석 받기"}
      </button>
    </main>
  );
}
