import { ImageResponse } from 'next/og';

export const size = { width: 180, height: 180 };
export const contentType = 'image/png';

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          background: '#0E1420',
          color: '#ECE8DD',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontFamily: 'serif',
          fontSize: 90,
          fontWeight: 500,
          letterSpacing: -2,
          border: '4px solid #C9A961',
          borderRadius: 22,
        }}
      >
        HO
      </div>
    ),
    size,
  );
}
