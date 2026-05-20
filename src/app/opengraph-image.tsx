import { ImageResponse } from 'next/og';

export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';
export const alt = 'Hasan Oso — AI Engineer';

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          background:
            'linear-gradient(135deg, #0E1420 0%, #161D2E 100%)',
          color: '#ECE8DD',
          display: 'flex',
          flexDirection: 'column',
          padding: '80px 96px',
          position: 'relative',
        }}
      >
        {/* corner brackets */}
        <div
          style={{
            position: 'absolute',
            top: 48,
            left: 48,
            width: 28,
            height: 28,
            borderTop: '1px solid #C9A961',
            borderLeft: '1px solid #C9A961',
          }}
        />
        <div
          style={{
            position: 'absolute',
            top: 48,
            right: 48,
            width: 28,
            height: 28,
            borderTop: '1px solid #C9A961',
            borderRight: '1px solid #C9A961',
          }}
        />
        <div
          style={{
            position: 'absolute',
            bottom: 48,
            left: 48,
            width: 28,
            height: 28,
            borderBottom: '1px solid #C9A961',
            borderLeft: '1px solid #C9A961',
          }}
        />
        <div
          style={{
            position: 'absolute',
            bottom: 48,
            right: 48,
            width: 28,
            height: 28,
            borderBottom: '1px solid #C9A961',
            borderRight: '1px solid #C9A961',
          }}
        />

        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 16,
            color: '#C9A961',
            fontSize: 22,
            letterSpacing: 6,
            textTransform: 'uppercase',
            fontStyle: 'italic',
          }}
        >
          <div style={{ width: 40, height: 1, background: '#C9A961' }} />
          <span>Aleppo · Ankara</span>
        </div>

        <div
          style={{
            marginTop: 'auto',
            display: 'flex',
            flexDirection: 'column',
            gap: 32,
          }}
        >
          <div
            style={{
              fontSize: 132,
              fontFamily: 'serif',
              fontWeight: 500,
              lineHeight: 1,
              letterSpacing: -2,
            }}
          >
            Hasan Oso
          </div>
          <div
            style={{
              fontSize: 36,
              color: 'rgba(236,232,221,0.78)',
              letterSpacing: -0.5,
            }}
          >
            AI Engineer building tools for the new Syria
          </div>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 16,
              color: '#C9A961',
              fontSize: 20,
              letterSpacing: 6,
              textTransform: 'uppercase',
              marginTop: 16,
            }}
          >
            <div style={{ width: 40, height: 1, background: '#C9A961' }} />
            <span>Engineer · Builder · Researcher</span>
          </div>
        </div>
      </div>
    ),
    size,
  );
}
