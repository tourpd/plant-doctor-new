import { db } from "@/lib/firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";

export async function saveDiaryRecord(userId: string, recordData: any) {
  try {
    const ref = collection(db, "users", userId, "diaries");
    await addDoc(ref, {
      ...recordData,
      createdAt: serverTimestamp()
    });
    return { ok: true };
  } catch (err) {
    console.error("🔥 Diary Save Error:", err);
    return { ok: false, error: err };
  }
}

