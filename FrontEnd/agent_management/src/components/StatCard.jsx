import React from 'react'

const StatCard = ({ title, value, color, icon }) => {
  const colorMap = {
    green: {
      bar: "#22c55e",
      bg: "#f0fdf4",
      iconColor: "#22c55e",
    },
    red: {
      bar: "#ef4444",
      bg: "#fef2f2",
      iconColor: "#ef4444",
    },
    yellow: {
      bar: "#eab308",
      bg: "#fefce8",
      iconColor: "#eab308",
    },
  };

  const theme = colorMap[color] || colorMap.green;

  return (
    <div
      style={{
        flex: "1 1 0",
        minWidth: "160px",
        height: "156px",
        borderRadius: "10px",
        border: "0.4px solid #e2e8f0",
        backgroundColor: "#ffffff",
        padding: "20px 18px 0 18px",
        display: "flex",
        flexDirection: "column",
        justifyContent: "flex-start",
        boxSizing: "border-box",
        boxShadow: "0 1px 4px rgba(0,0,0,0.05)",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Top row: title + icon */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
        <span
          style={{
            fontSize: "13px",
            color: "#6b7280",
            fontWeight: 400,
            lineHeight: "1.4",
          }}
        >
          {title}
        </span>
        <div
          style={{
            width: "36px",
            height: "36px",
            borderRadius: "50%",
            backgroundColor: theme.bg,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
          }}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={theme.iconColor} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            {icon}
          </svg>
        </div>
      </div>

      {/* Value — directly below title */}
      <div
        style={{
          fontSize: "36px",
          fontWeight: "700",
          color: "#111827",
          lineHeight: "1",
          marginTop: "16px",
        }}
      >
        {value}
      </div>

      {/* Bottom bar */}
      <div
        style={{
          height: "4px",
          backgroundColor: theme.bar,
          borderRadius: "0 0 10px 10px",
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
        }}
      />
    </div>
  );
}

export default StatCard