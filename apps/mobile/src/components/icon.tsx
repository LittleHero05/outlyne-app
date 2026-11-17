import Svg from "react-native-svg";
import { ICON_SHAPES, type IconName } from "@outlyne/core";
import { ShapeView } from "@/components/shapes";

type IconProps = {
  name: IconName;
  color: string;
  /** Rendered height in points; width follows the icon's aspect ratio. */
  size: number;
};

/** Activity icons and brand marks from @outlyne/core, tintable to any color. */
export function Icon({ name, color, size }: IconProps) {
  const icon = ICON_SHAPES[name];
  const width = (size * icon.width) / icon.height;
  return (
    <Svg
      width={width}
      height={size}
      viewBox={`0 0 ${icon.width} ${icon.height}`}
      accessibilityElementsHidden
      importantForAccessibility="no-hide-descendants"
    >
      {icon.shapes.map((shape, index) => (
        <ShapeView key={index} shape={shape} color={color} />
      ))}
    </Svg>
  );
}
