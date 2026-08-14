import { ImageResponse } from "next/og";

export const alt = "Estadísticas del gimnasio";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(135deg, #eef4ff 0%, #dde9ff 55%, #c3d9ff 100%)",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width: 180,
            height: 180,
            borderRadius: 40,
            background: "#135CFB",
            color: "#fff",
            fontSize: 84,
            marginBottom: 40,
            boxShadow: "0 20px 60px -20px rgba(10, 68, 194, 0.5)",
          }}
        >
          🏋️
        </div>
        <div style={{ display: "flex", fontSize: 76, fontWeight: 800, color: "#0A44C2" }}>Mi gimnasio</div>
        <div
          style={{
            display: "flex",
            marginTop: 8,
            fontSize: 32,
            letterSpacing: 8,
            textTransform: "uppercase",
            fontWeight: 700,
            color: "#135CFB",
          }}
        >
          Estadísticas
        </div>
        <div style={{ display: "flex", marginTop: 32, fontSize: 26, color: "#0A44C2" }}>
          Tu rendimiento en el gimnasio, en un solo lugar
        </div>
      </div>
    ),
    { ...size }
  );
}
