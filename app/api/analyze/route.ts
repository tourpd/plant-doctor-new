import { NextResponse } from "next/server";
import { initializeApp, getApps } from "firebase/app";
import {
  getStorage,
  ref,
  uploadBytes,
  getDownloadURL,
} from "firebase/storage";

import {
  GoogleGenerativeAI,
} from "@google/generative-ai";

// -----------------------------
// 🔥 Firebase 초기화
// -----------------------------
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY!,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN!,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID!,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET!,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID!,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID!,
};

if (!getApps().length) {
  initializeApp(firebaseConfig);
}

const storage = getStorage();

// -----------------------------
// 🔥 Gemini 초기화
// -----------------------------
const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY!);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

// -----------------------------
// 🔥 POST /api/analyze
// -----------------------------
export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json(
        { error: "이미지 파일이 존재하지 않습니다." },
        { status: 400 }
      );
    }

    // 1) Firebase Storage에 업로드
    const buffer = Buffer.from(await file.arrayBuffer());
    const fileName = `uploads/${Date.now()}-${file.name}`;
    const storageRef = ref(storage, fileName);

    await uploadBytes(storageRef, buffer, {
      contentType: file.type,
    });

    const imageUrl = await getDownloadURL(storageRef);

    // 2) Gemini 분석 실행
    const prompt = `
당신은 한국 농민들을 돕는 병해충 전문 AI입니다.
아래 이미지를 분석하여 다음을 한국어로 상세히 작성하세요.

1) **의심되는 병해충 이름**
2) **발생 원인**
3) **초기 증상과 현재 상태**
4) **농가가 지금 당장 해야 할 조치**
5) **예방 방법 (구체적인 횟수, 희석배수, 시기 포함)**

아래는 업로드된 이미지 URL입니다:
${imageUrl}
    `;

    const result = await model.generateContent([
      {
        inlineData: {
          data: buffer.toString("base64"),
          mimeType: file.type,
        },
      },
      prompt,
    ]);

    const text = result.response.text();

    return NextResponse.json({
      imageUrl,
      analysis: text,
    });
  } catch (err: any) {
    console.error("🔥 Analyze API Error:", err);
    return NextResponse.json(
      { error: "분석 중 오류가 발생했습니다.", detail: err.message },
      { status: 500 }
    );
  }
}