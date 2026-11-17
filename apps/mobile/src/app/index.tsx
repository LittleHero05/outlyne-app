import { Stack, router } from "expo-router";
import { Pressable, StyleSheet, Text, View, useWindowDimensions } from "react-native";
import { type ActivityType } from "@outlyne/core";
import { Icon } from "@/components/icon";
import { Screen, Title } from "@/components/ui";
import { useDraft } from "@/store/draft";
import { theme } from "@/theme";

const ACTIVITIES: { id: ActivityType; label: string }[] = [
  { id: "reading", label: "Reading" },
  { id: "workout", label: "Workout" },
  { id: "habit", label: "Habit" },
  { id: "recipe", label: "Recipe" },
];

/** Same portrait proportion as the web activity tiles. */
const TILE_ASPECT = 165 / 135;

export default function ActivitySelectScreen() {
  const { start } = useDraft();
  const { width: windowWidth } = useWindowDimensions();
  // Size tiles explicitly: aspectRatio with a % width is ignored in a wrapping
  // row, which collapsed the tiles to their content height.
  const tileWidth = Math.floor((windowWidth - theme.space.lg * 2 - theme.space.md) / 2);
  const tileSize = { width: tileWidth, height: Math.round(tileWidth * TILE_ASPECT) };

  function choose(activity: ActivityType) {
    start(activity);
    router.push({ pathname: "/generate/[activity]", params: { activity } });
  }

  return (
    <Screen>
      <Stack.Screen
        options={{
          headerRight: () => (
            <Pressable
              accessibilityRole="button"
              onPress={() => router.push("/cards")}
              hitSlop={10}
            >
              <Text style={styles.headerLink}>My cards</Text>
            </Pressable>
          ),
        }}
      />
      <Title>Select Activity Type</Title>
      <View style={styles.grid}>
        {ACTIVITIES.map((activity) => (
          <Pressable
            key={activity.id}
            accessibilityRole="button"
            onPress={() => choose(activity.id)}
            style={({ pressed }) => [styles.tile, tileSize, pressed && styles.tilePressed]}
          >
            <Icon name={activity.id} color={theme.colors.maroon} size={60} />
            <Text style={styles.tileLabel}>{activity.label}</Text>
          </Pressable>
        ))}
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  grid: { flexDirection: "row", flexWrap: "wrap", gap: theme.space.md },
  tile: {
    borderRadius: 22,
    gap: 16,
    backgroundColor: theme.colors.surface,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 4,
    elevation: 3,
  },
  tilePressed: { transform: [{ scale: 0.98 }] },
  headerLink: { fontSize: 16, fontWeight: "600", color: theme.colors.maroon },
  tileLabel: { fontSize: 20, fontWeight: "500", color: theme.colors.text, textAlign: "center" },
});
