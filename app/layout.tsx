// app/layout.tsx
export const metadata = {
  title: "Plant Doctor - AI 진단",
};

export default function RootLayout({ children }) {
  return (
    <html lang="ko">
      <body style={{ margin: 0, fontFamily: "Pretendard, sans-serif" }}>
        {children}
      </body>
    </html>
  );
}

