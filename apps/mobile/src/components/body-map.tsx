import { View } from "react-native";
import Svg, { G } from "react-native-svg";
import {
  BODY_OPACITY,
  BODY_REGIONS,
  BODY_SILHOUETTE,
  BODY_VIEW,
  formatMuscleList,
  type BodySide,
  type MuscleGroupId,
} from "@outlyne/core";
import { ShapeView } from "@/components/shapes";

type BodyMapProps = {
  selected: MuscleGroupId[];
  color: string;
  /** Height of each figure in points. */
  height: number;
};

function Figure({ side, selected, color, height }: BodyMapProps & { side: BodySide }) {
  const width = (height * BODY_VIEW.width) / BODY_VIEW.height;
  const regions = Object.entries(BODY_REGIONS[side]) as [MuscleGroupId, typeof BODY_SILHOUETTE][];
  return (
    <Svg width={width} height={height} viewBox={`0 0 ${BODY_VIEW.width} ${BODY_VIEW.height}`}>
      <G opacity={BODY_OPACITY.silhouette}>
        {BODY_SILHOUETTE.map((shape, index) => (
          <ShapeView key={index} shape={shape} color={color} />
        ))}
      </G>
      {regions.map(([muscle, shapes]) => (
        <G
          key={muscle}
          opacity={selected.includes(muscle) ? BODY_OPACITY.active : BODY_OPACITY.idle}
        >
          {shapes.map((shape, index) => (
            <ShapeView key={index} shape={shape} color={color} />
          ))}
        </G>
      ))}
    </Svg>
  );
}

/** Front and back figures with the selected muscle groups filled in. */
export function BodyMap({ selected, color, height }: BodyMapProps) {
  return (
    <View
      style={{ flexDirection: "row", justifyContent: "center", gap: height * 0.12 }}
      accessible
      accessibilityRole="image"
      accessibilityLabel={
        selected.length ? `Muscles worked: ${formatMuscleList(selected)}` : "Body map"
      }
    >
      <Figure side="front" selected={selected} color={color} height={height} />
      <Figure side="back" selected={selected} color={color} height={height} />
    </View>
  );
}
