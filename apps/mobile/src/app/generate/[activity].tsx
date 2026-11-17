import { Redirect, router } from "expo-router";
import { View } from "react-native";
import {
  MUSCLE_GROUPS,
  type ActivityDraft,
  type HabitDetails,
  type MuscleGroupId,
  type ReadingDetails,
  type RecipeDetails,
  type WorkoutDetails,
} from "@outlyne/core";
import { Button, Chip, ChipRow, Field, Label, Screen, Title } from "@/components/ui";
import { useDraft } from "@/store/draft";
import { theme } from "@/theme";

const TITLES: Record<ActivityDraft["activity"], string> = {
  reading: "Reading",
  workout: "Workout",
  habit: "Habit",
  recipe: "Recipe",
};

export default function DetailsScreen() {
  const { draft, setDraft } = useDraft();
  if (!draft) return <Redirect href="/" />;

  return (
    <Screen>
      <Title>{TITLES[draft.activity]}</Title>
      {draft.activity === "reading" ? (
        <ReadingFields values={draft.details} onChange={(details) => setDraft({ activity: "reading", details })} />
      ) : draft.activity === "workout" ? (
        <WorkoutFields values={draft.details} onChange={(details) => setDraft({ activity: "workout", details })} />
      ) : draft.activity === "habit" ? (
        <HabitFields values={draft.details} onChange={(details) => setDraft({ activity: "habit", details })} />
      ) : (
        <RecipeFields values={draft.details} onChange={(details) => setDraft({ activity: "recipe", details })} />
      )}
      <Button
        title="Generate"
        onPress={() => router.push("/generate/customize")}
        style={{ marginTop: theme.space.lg }}
      />
    </Screen>
  );
}

type FieldsProps<T> = { values: T; onChange: (values: T) => void };

function ReadingFields({ values, onChange }: FieldsProps<ReadingDetails>) {
  const set = (partial: Partial<ReadingDetails>) => onChange({ ...values, ...partial });
  return (
    <>
      <Field label="Title" placeholder="Book title" value={values.title} onChangeText={(title) => set({ title })} />
      <Field label="Pages read" placeholder="e.g. 42" keyboardType="number-pad" value={values.pagesRead} onChangeText={(pagesRead) => set({ pagesRead })} />
      <Field label="Time" placeholder="e.g. 1hr 03min" value={values.time} onChangeText={(time) => set({ time })} />
      <Field label="Rating (optional)" placeholder="e.g. 4.5" keyboardType="decimal-pad" value={values.rating} onChangeText={(rating) => set({ rating })} />
    </>
  );
}

function WorkoutFields({ values, onChange }: FieldsProps<WorkoutDetails>) {
  const set = (partial: Partial<WorkoutDetails>) => onChange({ ...values, ...partial });
  function toggle(id: MuscleGroupId) {
    set({
      muscles: values.muscles.includes(id)
        ? values.muscles.filter((m) => m !== id)
        : [...values.muscles, id],
    });
  }
  return (
    <>
      <Field label="Title" placeholder="e.g. Push Day" value={values.title} onChangeText={(title) => set({ title })} />
      <Field label="Total sets" placeholder="e.g. 24" keyboardType="number-pad" value={values.sets} onChangeText={(sets) => set({ sets })} />
      <View style={{ marginBottom: theme.space.md }}>
        <Label>Muscles worked</Label>
        <ChipRow>
          {MUSCLE_GROUPS.map((group) => (
            <Chip key={group.id} label={group.label} selected={values.muscles.includes(group.id)} onPress={() => toggle(group.id)} />
          ))}
        </ChipRow>
      </View>
    </>
  );
}

function HabitFields({ values, onChange }: FieldsProps<HabitDetails>) {
  const set = (partial: Partial<HabitDetails>) => onChange({ ...values, ...partial });
  return (
    <>
      <Field label="Habit" placeholder="e.g. Morning walk" value={values.title} onChangeText={(title) => set({ title })} />
      <Field label="Days so far" placeholder="e.g. 14" keyboardType="number-pad" value={values.days} onChangeText={(days) => set({ days })} />
      <View style={{ marginBottom: theme.space.md }}>
        <Label>Today</Label>
        <ChipRow>
          <Chip label="Completed today" selected={values.mode === "complete"} onPress={() => set({ mode: "complete" })} />
          <Chip label="Minutes today" selected={values.mode === "minutes"} onPress={() => set({ mode: "minutes" })} />
        </ChipRow>
      </View>
      {values.mode === "minutes" ? (
        <Field label="Minutes" placeholder="e.g. 32" keyboardType="number-pad" value={values.minutes} onChangeText={(minutes) => set({ minutes })} />
      ) : null}
    </>
  );
}

function RecipeFields({ values, onChange }: FieldsProps<RecipeDetails>) {
  const set = (partial: Partial<RecipeDetails>) => onChange({ ...values, ...partial });
  return (
    <>
      <Field label="Title" placeholder="e.g. Lemon pasta" value={values.title} onChangeText={(title) => set({ title })} />
      <View style={{ marginBottom: theme.space.md }}>
        <Label>Recipe by</Label>
        <ChipRow>
          <Chip label="Homemade" selected={values.source === "homemade"} onPress={() => set({ source: "homemade" })} />
          <Chip label="By someone else" selected={values.source === "author"} onPress={() => set({ source: "author" })} />
        </ChipRow>
      </View>
      {values.source === "author" ? (
        <Field label="Author" placeholder="e.g. Ina Garten or @handle" value={values.author} onChangeText={(author) => set({ author })} />
      ) : null}
      <Field label="Cook time" placeholder="e.g. 45 min" value={values.cookTime} onChangeText={(cookTime) => set({ cookTime })} />
      <Field label="Servings" placeholder="e.g. 4" keyboardType="number-pad" value={values.servings} onChangeText={(servings) => set({ servings })} />
      <Field label="Rating (optional)" placeholder="e.g. 4.5" keyboardType="decimal-pad" value={values.rating} onChangeText={(rating) => set({ rating })} />
    </>
  );
}
