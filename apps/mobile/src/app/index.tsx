import { router } from "expo-router";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { type ActivityType } from "@outlyne/core";
import { Screen, Title } from "@/components/ui";
import { useDraft } from "@/store/draft";
import { theme } from "@/theme";

const ACTIVITIES: { id: ActivityType; label: string }[] = [
  { id: "reading", label: "Reading" },
  { id: "workout", label: "Workout" },
  { id: "habit", label: "Habit" },
  { id: "recipe", label: "Recipe" },
];

export default function ActivitySelectScreen() {
  const { start } = useDraft();

  function choose(activity: ActivityType) {
    start(activity);
    router.push({ pathname: "/generate/[activity]", params: { activity } });
  }

  return (
    <Screen>
      <Title>Select Activity Type</Title>
      <View style={styles.grid}>
        {ACTIVITIES.map((activity) => (
          <Pressable
            key={activity.id}
            accessibilityRole="button"
            onPress={() => choose(activity.id)}
            style={({ pressed }) => [styles.tile, pressed && styles.tilePressed]}
          >
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
    width: "47%",
    aspectRatio: 135 / 165,
    borderRadius: 22,
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
  tileLabel: { fontSize: 20, fontWeight: "500", color: theme.colors.text },
});
