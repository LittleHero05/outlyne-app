import { StyleSheet, Text, View } from "react-native";
import {
  STORY_EXPORT,
  formatHabitToday,
  formatMuscleList,
  formatRating,
  formatRecipeBy,
  formatServings,
  formatStreak,
  getOutlineColor,
  readingPace,
  type ActivityDraft,
  type OutlineColorId,
} from "@outlyne/core";

type StoryCardProps = {
  draft: ActivityDraft;
  outlineColorId: OutlineColorId;
  width: number;
};

function Stat({ label, value, color }: { label: string; value: string; color: string }) {
  return (
    <View style={styles.stat}>
      <Text style={[styles.statLabel, { color }]}>{label}</Text>
      <Text style={[styles.statValue, { color }]}>{value}</Text>
    </View>
  );
}

/**
 * Native twin of the web ActivityCard. Same layout and formatters, rendered
 * with React Native views so it can later be captured by react-native-view-shot.
 * The activity icon and the Workout body map arrive with react-native-svg.
 */
export function StoryCard({ draft, outlineColorId, width }: StoryCardProps) {
  const color = getOutlineColor(outlineColorId).hex;
  const height = (width * STORY_EXPORT.height) / STORY_EXPORT.width;
  const { details } = draft;

  return (
    <View style={[styles.card, { width, height }]}>
      <Text style={[styles.statLabel, { color }]}>{headlineLabel(draft)}</Text>
      <Text style={[styles.headline, { color }]}>{details.title || "Untitled"}</Text>

      {draft.activity === "reading" ? (
        <>
          <View style={styles.pair}>
            <Stat label="Pages" value={draft.details.pagesRead || "—"} color={color} />
            <Stat label="Time" value={draft.details.time || "—"} color={color} />
          </View>
          <View style={styles.pair}>
            {readingPace(draft.details.pagesRead, draft.details.time) ? (
              <Stat label="Pace" value={readingPace(draft.details.pagesRead, draft.details.time)!} color={color} />
            ) : null}
            {draft.details.rating.trim() ? (
              <Stat label="Rating" value={`★ ${formatRating(draft.details.rating)}`} color={color} />
            ) : null}
          </View>
        </>
      ) : null}

      {draft.activity === "workout" ? (
        <>
          <View style={styles.pair}>
            <Stat label="Sets" value={draft.details.sets || "—"} color={color} />
          </View>
          {draft.details.muscles.length ? (
            <View style={styles.pair}>
              <Stat label="Muscles" value={formatMuscleList(draft.details.muscles)} color={color} />
            </View>
          ) : null}
        </>
      ) : null}

      {draft.activity === "habit" ? (
        <View style={styles.pair}>
          <Stat label="Streak" value={formatStreak(draft.details.days)} color={color} />
          <Stat label="Today" value={formatHabitToday(draft.details)} color={color} />
        </View>
      ) : null}

      {draft.activity === "recipe" ? (
        <>
          <Text style={[styles.byline, { color }]}>by {formatRecipeBy(draft.details)}</Text>
          <View style={styles.pair}>
            <Stat label="Cook time" value={draft.details.cookTime || "—"} color={color} />
            <Stat label="Servings" value={formatServings(draft.details.servings)} color={color} />
          </View>
          {draft.details.rating.trim() ? (
            <View style={styles.pair}>
              <Stat label="Rating" value={`★ ${formatRating(draft.details.rating)}`} color={color} />
            </View>
          ) : null}
        </>
      ) : null}

      <Text style={[styles.brand, { color }]}>OUTLYNE</Text>
    </View>
  );
}

function headlineLabel(draft: ActivityDraft): string {
  switch (draft.activity) {
    case "reading":
      return "Book title";
    case "workout":
      return "Workout";
    case "habit":
      return "Habit";
    case "recipe":
      return "Recipe";
  }
}

const styles = StyleSheet.create({
  card: {
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 24,
    paddingVertical: 40,
    backgroundColor: "transparent",
  },
  headline: { fontSize: 20, fontWeight: "600", textAlign: "center", marginTop: 4 },
  byline: { fontSize: 14, fontWeight: "500", marginTop: 4, opacity: 0.9 },
  pair: { flexDirection: "row", gap: 24, marginTop: 20, justifyContent: "center" },
  stat: { alignItems: "center", maxWidth: 200 },
  statLabel: { fontSize: 11, fontWeight: "600", opacity: 0.9, textAlign: "center" },
  statValue: { fontSize: 18, fontWeight: "600", marginTop: 4, textAlign: "center" },
  brand: { fontSize: 9, fontWeight: "600", letterSpacing: 2, marginTop: 32, opacity: 0.8 },
});
