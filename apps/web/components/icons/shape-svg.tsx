import type { Shape } from "@outlyne/core";

/** Draw one shared Shape as DOM SVG. Mirrors apps/mobile ShapeView. */
export function ShapeSvg({ shape, color }: { shape: Shape; color: string }) {
  switch (shape.kind) {
    case "circle":
      return <circle cx={shape.cx} cy={shape.cy} r={shape.r} fill={color} />;
    case "ellipse":
      return (
        <ellipse
          cx={shape.cx}
          cy={shape.cy}
          rx={shape.rx}
          ry={shape.ry}
          fill={color}
          transform={
            shape.rotate ? `rotate(${shape.rotate} ${shape.cx} ${shape.cy})` : undefined
          }
        />
      );
    case "rect":
      return (
        <rect
          x={shape.x}
          y={shape.y}
          width={shape.width}
          height={shape.height}
          rx={shape.rx}
          fill={color}
        />
      );
    case "path":
      return <path d={shape.d} fill={color} fillRule={shape.fillRule} />;
    case "stroke":
      return (
        <path
          d={shape.d}
          fill="none"
          stroke={color}
          strokeWidth={shape.strokeWidth}
          strokeLinecap={shape.linecap}
          strokeLinejoin="round"
        />
      );
  }
}
