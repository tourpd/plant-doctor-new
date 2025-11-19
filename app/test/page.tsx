"use client";

import { useState, useEffect } from "react";
import { db } from "@lib/firebase";
import { collection, getDocs, addDoc, onSnapshot } from "firebase/firestore";

export default function TestPage() {
  const [data, setData] = useState<any[]>([]);
  const [name, setName] = useState("");
  const [age, setAge] = useState("");

  // 실시간 데이터 가져오기
  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, "test"), (snapshot) => {
      const newData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setData(newData);
    });

    return () => unsubscribe();
  }, []);

  // 문서 추가
  const addData = async () => {
    if (!name || !age) return alert("모든 입력값을 채워주세요!");

    await addDoc(collection(db, "test"), {
      name,
      age: Number(age),
      createdAt: new Date(),
    });

    setName("");
    setAge("");
  };

  return (
    <div style={{ padding: 20 }}>
      <h2>🔥 Firestore CRUD 테스트</h2>

      <div style={{ marginBottom: 20 }}>
        <input
          type="text"
          placeholder="이름 입력"
          value={name}
          onChange={(e) => setName(e.target.value)}
          style={{ marginRight: 10 }}
        />
        <input
          type="number"
          placeholder="나이 입력"
          value={age}
          onChange={(e) => setAge(e.target.value)}
          style={{ marginRight: 10 }}
        />
        <button onClick={addData}>추가하기</button>
      </div>

      <h3>📋 저장된 데이터 목록:</h3>
      <pre>{JSON.stringify(data, null, 2)}</pre>
    </div>
  );
}
