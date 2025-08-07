import React, { HTMLAttributes } from "react";

export const CardContent: React.FC<HTMLAttributes<HTMLDivElement>> = ({ className = "", children, ...props }) => {
  return (
    <div
      className={`text-gray-700 ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};
