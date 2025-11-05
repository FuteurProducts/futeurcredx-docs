import React from "react";

const StagingBadge: React.FC = () => {
  const appEnv = import.meta.env.VITE_APP_ENV as string | undefined;
  if (appEnv !== "staging") return null;

  return (
    <div
      style={{
        position: "fixed",
        top: 10,
        right: 10,
        zIndex: 10000,
        background: "#8b5cf6",
        color: "white",
        padding: "6px 10px",
        borderRadius: 8,
        fontSize: 12,
        fontWeight: 700,
        boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
        letterSpacing: 0.5,
        textTransform: "uppercase",
      }}
      aria-label="Staging Environment"
    >
      STAGING
    </div>
  );
};

export default StagingBadge;


