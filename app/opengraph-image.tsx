import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "Marilyn's Morsels Bakery — Fresh-Baked Cookies from Westerville, OH";
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = "image/png";

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "1200px",
          height: "630px",
          background: "#FFF7ED",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          padding: "60px",
        }}
      >
        {/* Gold accent bar */}
        <div
          style={{
            width: "80px",
            height: "6px",
            background: "#D79B4E",
            borderRadius: "3px",
            marginBottom: "32px",
          }}
        />

        {/* Brand name */}
        <div
          style={{
            fontSize: "72px",
            fontWeight: 700,
            color: "#2C1810",
            textAlign: "center",
            lineHeight: 1.1,
            marginBottom: "20px",
          }}
        >
          Marilyn&apos;s Morsels
        </div>

        {/* Tagline */}
        <div
          style={{
            fontSize: "28px",
            color: "#3F2A1C",
            opacity: 0.75,
            textAlign: "center",
            marginBottom: "12px",
          }}
        >
          Small-batch cookies baked fresh in Westerville, OH
        </div>

        {/* Gold accent bar bottom */}
        <div
          style={{
            width: "80px",
            height: "4px",
            background: "#D79B4E",
            borderRadius: "2px",
            marginTop: "28px",
          }}
        />

        {/* URL */}
        <div
          style={{
            marginTop: "24px",
            fontSize: "20px",
            color: "#D79B4E",
          }}
        >
          marilynsmorsels.com
        </div>
      </div>
    ),
    { ...size }
  );
}
