"use client";

import React from "react";
import Link from "next/link";

export default function Home() {
  return (
    <div style={{ padding: "40px", textAlign: "center" }}>
      <h1>🌱 Plant Doctor</h1>
      <p>AI 기반 작물 병해충 진단 서비스</p>

      <Link href="/upload">
        <button
          style={{
            marginTop: "20px",
            padding: "12px 20px",
            background: "green",
            color: "white",
            borderRadius: "8px",
            cursor: "pointer"
          }}
        >
          진단 시작하기 🚀
        </button>
      </Link>
    </div>
  );
}
<a href="/profile">
  <button style={{ marginTop: 20, padding: "12px 20px" }}>
    👨‍🌾 프로필 설정하기
  </button>
</a>


