import React, { HTMLAttributes } from "react";

export const CardHeader: React.FC<HTMLAttributes<HTMLDivElement>> = ({ className = "", children, ...props }) => {
  return (
    <div
      className={`mb-2 ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};
