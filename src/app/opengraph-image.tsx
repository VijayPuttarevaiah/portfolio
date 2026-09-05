import { ImageResponse } from "next/og";
import { person } from "@/content/resume";

export const alt = `${person.name} — ${person.headline}`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

/** Social preview card. Same restrained palette as the site. */
export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "#fbfbfa",
          padding: "72px 80px",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div
            style={{
              fontSize: 22,
              letterSpacing: "0.18em",
              textTransform: "uppercase",
              color: "#858c99",
            }}
          >
            Halifax, Nova Scotia
          </div>
          <div
            style={{
              fontSize: 82,
              fontWeight: 600,
              letterSpacing: "-0.03em",
              color: "#16181d",
              marginTop: 28,
            }}
          >
            {person.name}
          </div>
          <div style={{ fontSize: 42, color: "#14508f", marginTop: 12 }}>
            {person.headline}
          </div>
        </div>

        <div
          style={{
            display: "flex",
            fontSize: 26,
            color: "#5a6170",
            borderTop: "1px solid #e4e4e2",
            paddingTop: 28,
          }}
        >
          Java · Spring Boot · Microservices · AWS · Kubernetes
        </div>
      </div>
    ),
    { ...size },
  );
}
