interface GeometricDividerProps {
  className?: string;
}

export default function GeometricDivider({ className = "" }: GeometricDividerProps) {
  return (
    <div className={`geo-divider ${className}`} aria-hidden="true">
      {/* 8-point star diamond center piece */}
      <svg
        width="12"
        height="12"
        viewBox="0 0 12 12"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="flex-shrink-0"
      >
        <path
          d="M6 0 L7.2 4.8 L12 6 L7.2 7.2 L6 12 L4.8 7.2 L0 6 L4.8 4.8 Z"
          fill="white"
          opacity="0.8"
        />
      </svg>
    </div>
  );
}
