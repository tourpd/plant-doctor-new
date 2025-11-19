import { NextResponse } from "next/server";

// 🚀 감정 & 상황 자동 믹스 메세지 생성 함수
function mixToneText({ diagnosis, solution }: any) {
  const neutral = `📌 진단 결과: ${diagnosis}\n💊 처방 안내: ${solution}`;
  const expert = `🔬 분석 결론: ${diagnosis}\n🧪 대응 전략: ${solution}\n📎 추가 분석 필요 시 사진을 더 보내주세요.`;
  const emotional = `🤗 음… 작물이 조금 힘들어하고 있는 것 같아요.\n"${diagnosis}" 가능성이 보여요.\n그래도 걱정 마세요! 함께 해결할 수 있어요.\n💚 ${solution}`;

  return { neutral, expert, emotional };
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const imageUrl = body?.imageUrl;

    if (!imageUrl) {
      return NextResponse.json({
        success: false,
        confidence: 0,
        diagnosis: "분석 불가",
        cause: "이미지 데이터가 확인되지 않습니다.",
        solution: "다른 각도 및 선명한 사진으로 다시 촬영해주세요.",
        recommendedProducts: [],
        tone: 4,
        followUpDays: 7
      });
    }

    // 🚧 실제 AI 연결 구간 (Placeholder 예시)
    // 여기에 Gemini Vision 또는 Firebase ML Kit 연동 예정
    const mockResult = {
      success: true,
      confidence: Math.random() * (0.95 - 0.65) + 0.65, // 65~95% 랜덤
      diagnosis: "영양 불균형 또는 초기 병반 의심",
      cause: "수분 및 영양 공급 불균형에 의한 약한 조직 발생",
      solution: "관수량 점검 및 칼슘/아미노산 공급 확인",
      recommendedProducts: ["Ca-Power", "Kelpak", "Multi-Feed"],
      followUpDays: 7
    };

    return NextResponse.json({
      tone: 4,
      ...mockResult
    });

  } catch (err: any) {
    return NextResponse.json(
      {
        success: false,
        confidence: 0,
        diagnosis: "처리 중 오류 발생",
        cause: err.message ?? "알 수 없는 오류",
        solution: "관리자에게 문의하거나 재촬영 해주세요.",
        recommendedProducts: [],
        tone: 4,
        followUpDays: 7
      },
      { status: 500 }
    );
  }
}
