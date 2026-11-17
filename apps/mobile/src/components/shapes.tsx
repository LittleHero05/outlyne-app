import { Circle, Ellipse, Path, Rect } from "react-native-svg";
import type { Shape } from "@outlyne/core";

/** Draw one shared Shape with react-native-svg, tinted with `color`. */
export function ShapeView({ shape, color }: { shape: Shape; color: string }) {
  switch (shape.kind) {
    case "circle":
      return <Circle cx={shape.cx} cy={shape.cy} r={shape.r} fill={color} />;
    case "ellipse":
      return (
        <Ellipse
          cx={shape.cx}
          cy={shape.cy}
          rx={shape.rx}
          ry={shape.ry}
          fill={color}
          rotation={shape.rotate ?? 0}
          origin={[shape.cx, shape.cy]}
        />
      );
    case "rect":
      return (
        <Rect
          x={shape.x}
          y={shape.y}
          width={shape.width}
          height={shape.height}
          rx={shape.rx}
          fill={color}
        />
      );
    case "path":
      return <Path d={shape.d} fill={color} fillRule={shape.fillRule ?? "nonzero"} />;
    case "stroke":
      return (
        <Path
          d={shape.d}
          fill="none"
          stroke={color}
          strokeWidth={shape.strokeWidth}
          strokeLinecap={shape.linecap ?? "butt"}
          strokeLinejoin="round"
        />
      );
  }
}
