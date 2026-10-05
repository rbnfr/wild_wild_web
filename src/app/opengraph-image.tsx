import { ImageResponse } from "next/og";
export const alt = "Mary Granero. Etología y convivencia con perros y gatos.";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export default function Image() {
  return new ImageResponse(
    <div
      style={{
        background: "#244c3e",
        color: "#faf7ef",
        height: "100%",
        width: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        padding: 90,
      }}
    >
      <div style={{ fontSize: 38, marginBottom: 45 }}>Mary Granero</div>
      <div style={{ fontSize: 72, lineHeight: 1.12, maxWidth: 950 }}>
        Comprenderles cambia la forma de convivir.
      </div>
      <div style={{ fontSize: 26, marginTop: 45 }}>
        Etología · Perros y gatos
      </div>
    </div>,
    size,
  );
}
