import { ImageResponse } from 'next/og';

export const size = { width: 64, height: 64 };
export const contentType = 'image/png';

export default function Icon() {
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
          fontSize: 30,
          fontWeight: 500,
          letterSpacing: -1,
          border: '1.5px solid #C9A961',
          borderRadius: 6,
        }}
      >
        HO
      </div>
    ),
    size,
  );
}
