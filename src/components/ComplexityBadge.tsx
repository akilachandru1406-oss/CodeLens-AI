import React from "react";

interface ComplexityBadgeProps {
  complexity: string;
  type?: "time" | "space";
  size?: "sm" | "md" | "lg";
}

export const ComplexityBadge: React.FC<ComplexityBadgeProps> = ({
  complexity,
  type = "time",
  size = "md",
}) => {
  const comp = complexity.replace(/\s+/g, "").toLowerCase();

  // Color mapping based on algorithmic efficiency
  let colorStyle = "bg-emerald-500/10 text-emerald-400 border-emerald-500/30";

  if (comp.includes("o(1)") || comp.includes("o(logn)") || comp.includes("o(log(n))")) {
    colorStyle = "bg-emerald-500/10 text-emerald-400 border-emerald-500/30";
  } else if (comp.includes("o(n)") && !comp.includes("o(n^") && !comp.includes("o(n²)") && !comp.includes("o(nlogn)")) {
    colorStyle = "bg-blue-500/10 text-blue-400 border-blue-500/30";
  } else if (comp.includes("o(nlogn)") || comp.includes("o(n*logn)")) {
    colorStyle = "bg-cyan-500/10 text-cyan-400 border-cyan-500/30";
  } else if (comp.includes("o(n^2)") || comp.includes("o(n²)") || comp.includes("o(n*n)")) {
    colorStyle = "bg-amber-500/10 text-amber-400 border-amber-500/30";
  } else if (comp.includes("o(2^n)") || comp.includes("o(2ⁿ)") || comp.includes("o(n!)") || comp.includes("o(n^3)") || comp.includes("o(n³)")) {
    colorStyle = "bg-rose-500/10 text-rose-400 border-rose-500/30";
  }

  const sizeClasses = {
    sm: "text-xs px-2 py-0.5",
    md: "text-sm px-2.5 py-1 font-semibold",
    lg: "text-base px-3.5 py-1.5 font-bold tracking-wide",
  };

  return (
    <span
      className={`inline-flex items-center font-mono rounded-lg border shadow-xs ${colorStyle} ${sizeClasses[size]}`}
      title={`${type === "time" ? "Time" : "Space"} Complexity: ${complexity}`}
    >
      {complexity}
    </span>
  );
};
