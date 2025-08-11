import { ImageResponse } from 'next/og';

export const size = { width: 512, height: 512 };
export const contentType = 'image/png';

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          height: '100%',
          width: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'linear-gradient(135deg,#2563eb,#1e40af)',
          color: 'white',
          fontSize: 180,
          fontWeight: 700,
          letterSpacing: -4,
        }}
      >
        SL
      </div>
    ),
    { width: 512, height: 512 }
  );
}