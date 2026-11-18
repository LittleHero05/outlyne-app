import { Redirect, router } from "expo-router";
import { Pressable, StyleSheet, View } from "react-native";
import { OUTLINE_COLORS, previewBackdrop } from "@outlyne/core";
import { StoryCard } from "@/components/story-card";
import { Button, Label, Screen, Subtitle, Title } from "@/components/ui";
import { useDraft } from "@/store/draft";
import { theme } from "@/theme";

const CARD_WIDTH = 260;

export default function CustomizeScreen() {
  const { draft, outlineColorId, setOutlineColorId } = useDraft();
  if (!draft) return <Redirect href="/" />;

  return (
    <Screen>
      <Title>Customize</Title>
      <Subtitle>Pick an outline color for your Story overlay</Subtitle>

      <View style={[styles.preview, { backgroundColor: previewBackdrop(outlineColorId).check }]}>
        <StoryCard draft={draft} outlineColorId={outlineColorId} width={CARD_WIDTH} />
      </View>

      <Label>Outline color</Label>
      <View style={styles.swatches} accessibilityRole="radiogroup">
        {OUTLINE_COLORS.map((color) => {
          const selected = color.id === outlineColorId;
          return (
            <Pressable
              key={color.id}
              accessibilityRole="radio"
              accessibilityLabel={color.label}
              accessibilityState={{ selected }}
              onPress={() => setOutlineColorId(color.id)}
              style={[
                styles.swatch,
                { backgroundColor: color.hex, borderColor: color.swatchBorder ?? "transparent" },
                selected && styles.swatchSelected,
              ]}
            />
          );
        })}
      </View>

      <Button title="Continue" onPress={() => router.push("/generate/preview")} style={{ marginTop: theme.space.xl }} />
    </Screen>
  );
}

const styles = StyleSheet.create({
  preview: {
    alignSelf: "center",
    borderRadius: theme.radius.xl,
    marginBottom: theme.space.xl,
    overflow: "hidden",
  },
  swatches: { flexDirection: "row", flexWrap: "wrap", gap: 12, justifyContent: "center" },
  swatch: { width: 48, height: 48, borderRadius: 24, borderWidth: 2 },
  swatchSelected: { transform: [{ scale: 1.1 }], borderColor: theme.colors.text, borderWidth: 3 },
});
