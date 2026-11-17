import { View } from "react-native";
import { STORY_EXPORT, type ActivityDraft, type OutlineColorId } from "@outlyne/core";
import { StoryCard } from "@/components/story-card";

const RENDER_WIDTH = 260;

/**
 * The full-size StoryCard, scaled down. Rendering at full width and scaling
 * keeps text proportions identical to the exported image.
 */
export function CardThumb({
  draft,
  outlineColorId,
  width,
}: {
  draft: ActivityDraft;
  outlineColorId: OutlineColorId;
  width: number;
}) {
  const scale = width / RENDER_WIDTH;
  const renderHeight = (RENDER_WIDTH * STORY_EXPORT.height) / STORY_EXPORT.width;
  return (
    <View style={{ width, height: renderHeight * scale, overflow: "hidden" }}>
      <View
        style={{
          width: RENDER_WIDTH,
          height: renderHeight,
          transform: [
            { translateX: -(RENDER_WIDTH - RENDER_WIDTH * scale) / 2 },
            { translateY: -(renderHeight - renderHeight * scale) / 2 },
            { scale },
          ],
        }}
      >
        <StoryCard draft={draft} outlineColorId={outlineColorId} width={RENDER_WIDTH} />
      </View>
    </View>
  );
}
