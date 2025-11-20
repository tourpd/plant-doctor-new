// /app/api/entry/route.ts
import { NextResponse } from "next/server";
import { getFirestore, collection, addDoc } from "firebase/firestore";
import { initializeApp, getApps } from "firebase/app";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY!,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN!,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID!,
};

const app = !getApps().length ? initializeApp(firebaseConfig) : getApps()[0];
const db = getFirestore(app);

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { cropName, memo, imageUrls, createdAt } = body;

    // TODO: 실제 로그인 사용자 ID로 대체
    const userId = "demo-user";

    const docRef = await addDoc(
      collection(db, "users", userId, "entries"),
      {
        cropName,
        memo,
        imageUrls,
        createdAt,
      }
    );

    return NextResponse.json({ entryId: docRef.id });
  } catch (e: any) {
    console.error(e);
    return NextResponse.json(
      { message: "일지 저장 중 오류가 발생했습니다." },
      { status: 500 }
    );
  }
}
