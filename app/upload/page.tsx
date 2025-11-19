"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { storage } from "@/lib/firebase";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

export default function UploadPage() {
  const router = useRouter();
  const [images, setImages] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);
  const [uploading, setUploading] = useState(false);

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    const selectedFiles = Array.from(e.target.files).slice(0, 4);

    setImages(selectedFiles);

    const previewUrls = selectedFiles.map((file) =>
      URL.createObjectURL(file)
    );
    setPreviews(previewUrls);
  };

  const handleUpload = async () => {
    if (images.length === 0) return alert("사진을 최소 1장 업로드하세요!");
    try {
      setUploading(true);

      const uploadTasks = images.map(async (image) => {
        const storageRef = ref(storage, `plants/${Date.now()}_${image.name}`);
        await uploadBytes(storageRef, image);
        return await getDownloadURL(storageRef);
      });

      const urls = await Promise.all(uploadTasks);

      router.push(`/analysis?images=${encodeURIComponent(JSON.stringify(urls))}`);
    } catch (err) {
      alert("업로드 중 오류가 발생했습니다. 다시 시도해주세요.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <main style={{ padding: "20px", maxWidth: "480px", margin: "0 auto" }}>
      <h2 style={{ fontSize: "22px", fontWeight: "bold", marginBottom: "15px" }}>
        📸 작물 사진 업로드 (최대 4장)
      </h2>

      {/* 이미지 선택 */}
      <input
        type="file"
        accept="image/*"
        multiple
        onChange={handleFileInput}
        style={{
          width: "100%",
          padding: "12px",
          border: "1px solid #ccc",
          borderRadius: "6px",
          cursor: "pointer",
          marginBottom: "15px",
        }}
      />

      {/* 미리보기 영역 */}
      <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
        {previews.map((src, i) => (
          <img
            key={i}
            src={src}
            alt="preview"
            style={{
              width: "48%",
              height: "120px",
              objectFit: "cover",
              borderRadius: "8px",
              border: "1px solid #aaa",
            }}
          />
        ))}
      </div>

      {/* 분석 버튼 */}
      <button
        onClick={handleUpload}
        disabled={uploading}
        style={{
          width: "100%",
          marginTop: "20px",
          backgroundColor: uploading ? "#888" : "#007b00",
          color: "white",
          padding: "14px",
          borderRadius: "8px",
          fontSize: "18px",
          fontWeight: "bold",
          border: "none",
          cursor: uploading ? "not-allowed" : "pointer",
        }}
      >
        {uploading ? "⏳ 업로드 중..." : "🔍 AI 분석 시작"}
      </button>
    </main>
  );
}
