import { useRef, useState } from "react";

export default function BubbleReveal({ children }) {
  const [bubbles, setBubbles] = useState([]);
  const lastPointRef = useRef({ x: 0, y: 0 });

  const handleMouseMove = (e) => {
    const x = e.clientX;
    const y = e.clientY;

    const dx = x - lastPointRef.current.x;
    const dy = y - lastPointRef.current.y;
    const distance = Math.sqrt(dx * dx + dy * dy);

    if (distance > 60) {
      lastPointRef.current = { x, y };

      setBubbles((prev) => [...prev, { x, y }]);
    }
  };

  return (
    <div
      onMouseMove={handleMouseMove}
      className="relative w-full h-screen overflow-hidden bg-black"
    >
      {children}

      <svg className="absolute inset-0 w-full h-full pointer-events-none">
        <defs>
          <mask id="bubbleMask">
            {/* start with full black */}
            <rect width="100%" height="100%" fill="white" />

            {/* cut holes */}
            {bubbles.map((b, i) => (
              <circle key={i} cx={b.x} cy={b.y} r="130" fill="black" />
            ))}
          </mask>
        </defs>

        <rect width="100%" height="100%" fill="black" mask="url(#bubbleMask)" />
      </svg>
    </div>
  );
}