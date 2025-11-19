type ResultPageProps = {
  searchParams: { url?: string };
};

export default function ResultPage({ searchParams }: ResultPageProps) {
  const url = searchParams.url;

  if (!url) {
    return (
      <main style={{ padding: 24 }}>
        <h2>업로드된 이미지가 없습니다.</h2>
        <p>먼저 /upload 페이지에서 이미지를 업로드해 주세요.</p>
      </main>
    );
  }

  return (
    <main style={{ padding: 24 }}>
      <h2 style={{ fontSize: 24, marginBottom: 16 }}>✅ 업로드 완료</h2>

      <section style={{ marginBottom: 24 }}>
        <h3>이미지 미리보기</h3>
        <img
          src={url}
          alt="업로드된 이미지"
          style={{ maxWidth: "100%", height: "auto", marginTop: 8 }}
        />
      </section>

      <section>
        <h3>이미지 URL</h3>
        <p style={{ wordBreak: "break-all", marginTop: 8 }}>{url}</p>
      </section>
    </main>
  );
}
