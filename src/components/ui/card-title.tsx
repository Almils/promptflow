import React, { HTMLAttributes } from "react";

export const CardTitle: React.FC<HTMLAttributes<HTMLHeadingElement>> = ({ className = "", children, ...props }) => {
  return (
    <h3
      className={`text-lg font-semibold text-indigo-700 ${className}`}
      {...props}
    >
      {children}
    </h3>
  );
};
